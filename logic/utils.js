const AWS = require('aws-sdk')
const logger = require('winston')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const empty = require('is-empty')
const chalk = require('chalk')
const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const info = (msg) => logger.log('info', `[UTILS] ${msg}`)
const error = (msg, stacktrace = undefined) => logger.log('error', `[Controllers] ${msg}`, stacktrace)
const bucketname = process.env.AWS_BUCKET_NAME
AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION })

function getS3object (fileKey) {
  const s3 = new AWS.S3()
  // Create the parameters for getting the object of a specific key
  const fileParams = {
    Bucket: bucketname,
    Key: fileKey
  }
  // A filestream is initiated and its result is streamed to the frontend modules and then to the client
  return s3.getObject(fileParams).createReadStream()
}

// This is the function that recursivelly lists the objects (e.g. folders, files) inside a bucket
// The objects of its folder inside the bucket are amended to the array, s3buckets, which is finally returned to the first call of the function and then to the frontend modules
// The s3buckets array holds tuples of key-value pairs. Each tuple contains a key and its size.
function listObjects (bucketParams, s3, s3buckets = [], pendingRecursive = 0) {
  let size
  return new Promise((resolve, reject) => {
    return s3.listObjectsV2(bucketParams, (err, data) => {
      if (err) {
        error(err)
        reject(err)
      } else {
        // console.log("success", data)
        if (!empty(data.Contents)) {
          pendingRecursive--
          // The items refer to each key which is parsed, meaning every folder and file.
          data.Contents.forEach(item => {
            // By checking the size of each item, we can differentiate the files from the folders. Each folder has size of 0 bytes.
            if (item.Size === 0) {
              // By uncommenting the following console.logs, the results can be logged in the console
              // console.log(chalk.blue.bold(item.Key));
            } else {
              // console.log(chalk.cyan.italic(item.Key));
            }
            size = bytestoniceformat(item.Size)
            s3buckets.push({ Key: item.Key, Size: size })
            // console.log(item.Key);
          })
        } else {
          pendingRecursive--
        }
        // The data.CommonPrefixes refers to the folders contained inside a folder or the bucket itself.
        if (!empty(data.CommonPrefixes)) {
          data.CommonPrefixes.map(function (commonPrefix) {
            bucketParams.Prefix = commonPrefix.Prefix
            resolve(listObjects(bucketParams, s3, s3buckets, pendingRecursive))
            return true
          })
        } else {
          resolve(s3buckets)
        }
      }
    })
  })
}

// this is the function used to convert the size that the s3 objects have in bytes to nice readable format
function bytestoniceformat (x) {
  let l = 0; let n = parseInt(x, 10) || 0

  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
}

function getS3directorylisting () {
  info(chalk.green.bold(`Bucket name: ${bucketname}`))
  const s3 = new AWS.S3()
  const s3bucket = new AWS.S3({ params: { Bucket: bucketname } })
  // Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: bucketname,
    Delimiter: '/'
  }

  const s3checkbucket = s3bucket.headBucket({ Bucket: bucketname }).promise()

  // If the bucket is valid, then the listObjects function is invoked to initiate the listing
  return s3checkbucket.then((result) => {
    info(chalk.green.bold('Valid S3 bucket.'))
    return listObjects(bucketParams, s3)
  }).catch(function (err) {
    error(chalk.red.bold('Invalid s3 bucket.'))
    return error
  })
}
// the module is exported as S3DownloadObject so as its class and functions to be callable by the other modules
module.exports = {
  getS3object,
  getS3directorylisting
}
