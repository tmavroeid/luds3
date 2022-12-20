const AWS = require('aws-sdk')
const logger = require('winston')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const conf = new (require('conf'))()
const fs = require('fs')
const chalk = require('chalk')
const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const info = (msg) => logger.log('info', `${msg}`)
const error = (msg, stacktrace = undefined) => logger.log('error', `${msg}`, stacktrace)
const userCreds = conf.get('user-creds')
AWS.config.update({ accessKeyId: userCreds.accesskey, secretAccessKey: userCreds.secretkey, region: userCreds.region })

function getS3object (fileKey){
  const bucketname = typeof bucket !== 'undefined' ? bucket : process.env.AWS_BUCKET_NAME
  if (typeof bucketname === 'undefined') {
    error(chalk.red.bold('MISSING BUCKET'))
    return false
  }
  
  const s3 = new AWS.S3()
  // Create the parameters for getting the object of a specific key
  const fileParams = {
    Bucket: bucketname,
    Key: fileKey
  }
  let key = path.basename(fileKey)
  return new Promise((resolve, reject) => {
    return resolve(s3.getObject(fileParams).createReadStream())
  })
}

function download (bucket, fileKey){
  const bucketname = typeof bucket !== 'undefined' ? bucket : process.env.AWS_BUCKET_NAME
  if (typeof bucketname === 'undefined') {
    error(chalk.red.bold('MISSING BUCKET'))
    return false
  }
  
  const s3 = new AWS.S3()
  // Create the parameters for getting the object of a specific key
  const fileParams = {
    Bucket: bucketname,
    Key: fileKey
  }
  let key = path.basename(fileKey)
  let file = fs.createWriteStream(__dirname+'/'+key)
  return new Promise((resolve, reject) => {
    return s3.getObject(fileParams).createReadStream()
    .on('end', () => {
        return resolve();
    })
    .on('error', (error) => {
        return reject(error);
    }).pipe(file)
  });
}

function upload (bucket, filePath, prefix){
  const bucketname = typeof bucket !== 'undefined' ? bucket : process.env.AWS_BUCKET_NAME
  if (typeof bucketname === 'undefined') {
    error(chalk.red.bold('MISSING BUCKET'))
    return false
  }
  const s3 = new AWS.S3() 
  const blob = fs.readFileSync(filePath)
  let fileName = path.basename(filePath)
  const Bucket = bucketname;
  const Prefix = prefix
  const MaxKeys = 1
  const params = {
        Bucket,
        Prefix,
        MaxKeys
  }
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params).promise()
      .then(({ Contents, IsTruncated, NextContinuationToken }) => {
        if(Contents.length > 0) {
          resolve(s3.upload({
            Bucket: bucketname,
            Key: fileName,
            Body: blob,
          }).promise())
        } else {
          reject('THE PREFIX DOES NOT EXIST')
        }
      })
  })
  .then((uploadedImage)=>{
    return uploadedImage.Location
  })
  .catch((err)=>{
    error(err, err.stack)
    return err
  })

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
  download,
  upload,
  bytesToNiceFormat,
  getS3directorylisting
}
