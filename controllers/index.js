const logger = require('winston')
const { getS3object, getS3directorylisting } = require('../logic/utils')

const error = (msg, stacktrace = undefined) => logger.log('error', `[Controllers] ${msg}`, stacktrace)
// The s3_controller handles the operation of listing and downloading S3 objects by intercting with the /logic scripts

// This is the controller function enabling the listing of all the objects (keys) in a bucket
function s3listing (req, res, next) {
  return getS3directorylisting()
    .then((results) => {
      res.render('index', { results })
    }).catch((err) => {
      error(err)
      res.status(400).send(err)
      return err
    })
}

function apiS3listing (req, res, next) {
  return getS3directorylisting()
    .then((results) => {
      res.status(200).send(results)
      return results
    }).catch((err) => {
      error(err)
      res.status(400).send(err)
      return err
    })
}

// this is the controller enabling the process of downloding a file
function s3download (req, res, next) {
  res.attachment(req.params.key)
  return getS3object(req.params.key)
    .then((result) => {
      result.pipe(res)
      return true
    }).catch((err) => {
      error(err)
      res.status(400).send(err)
      return err
    })
}
function apiS3download (req, res, next) {
  res.attachment(req.params.key)
  return getS3object(req.params.key)
    .then((result) => {
      res.status(200).send(result)
      return result
    }).catch((err) => {
      error(err)
      res.status(400).send(err)
      return err
    })
}

module.exports = {
  s3listing,
  s3download,
  apiS3listing,
  apiS3download
}
