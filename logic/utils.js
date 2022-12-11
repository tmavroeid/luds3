const AWS = require('aws-sdk')
const logger = require('winston')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const conf = new (require('conf'))()
const empty = require('is-empty')
const chalk = require('chalk')
const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const info = (msg) => logger.log('info', `${msg}`)
const error = (msg, stacktrace = undefined) => logger.log('error', `${msg}`, stacktrace)
const userCreds = conf.get('user-creds')
// const bucketname = process.env.AWS_BUCKET_NAME

AWS.config.update({ accessKeyId: userCreds.accesskey, secretAccessKey: userCreds.secretkey, region: userCreds.region })

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

function listObjects (params, s3, s3buckets = []) {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params).promise()
      .then(({ Contents, IsTruncated, NextContinuationToken }) => {
        s3buckets.push(...Contents)
        !IsTruncated ? resolve(s3buckets) : resolve(listObjects(Object.assign(params, { ContinuationToken: NextContinuationToken }), s3buckets))
      })
      .catch(reject)
  })
} 

// this is the function used to convert the size that the s3 objects have in bytes to nice readable format
function bytesToNiceFormat (x) {
  let l = 0; let n = parseInt(x, 10) || 0
  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
}

function getS3directorylisting (bucket) {
  const bucketname = typeof bucket !== 'undefined' ? bucket : process.env.AWS_BUCKET_NAME
  if (typeof bucketname === 'undefined') {
    error(chalk.red.bold('MISSING BUCKET'))
    return false
  }
  const s3 = new AWS.S3()
  const params = {
    Bucket: bucketname
  }
  const s3bucket = new AWS.S3({ params })
  const s3checkbucket = s3bucket.headBucket(params).promise()
  // If the bucket is valid, then the listObjects function is invoked to initiate the listing
  return s3checkbucket.then((result) => {
    info(chalk.green.italic('Valid S3 bucket.'))
    return listObjects(params, s3)
  }).catch(function (err) {
    error(chalk.red.italic('Invalid s3 bucket.'))
    return error
  })
}
module.exports = {
  getS3object,
  bytesToNiceFormat,
  getS3directorylisting
}
