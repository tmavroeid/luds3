const path = require('path')
const app = require('./app')
const debug = require('debug')('server:server')
const http = require('http')
const { getS3object, download, upload, deleteKey, bytesToNiceFormat, getS3directorylisting } = require(path.join(__dirname, '/logic/utils'))

const logger = require('winston')
const conf = new (require('conf'))()
const chalk = require('chalk')
const info = (msg) => logger.log('info', `${msg}`)
const error = (msg, stacktrace = undefined) => logger.log('error', `[Controllers] ${msg}`, stacktrace)

function setupCredentials ({ accesskey, secretkey, region }) {
  let userCreds = conf.get('user-creds')
  if (!userCreds) {
    userCreds = {}
  }
  if (typeof accesskey === 'undefined' || typeof secretkey === 'undefined' || typeof region === 'undefined') {
    info(
      chalk.green.bold('You have to define all three variables, access-key, secret-access-key and region')
    )
  }
  userCreds.accesskey = accesskey
  userCreds.secretkey = secretkey
  userCreds.region = region
  conf.set('user-creds', userCreds)
  info(
    chalk.green.bold('User credentials are stored!')
  )
  return true
}

function getCredentials () {
  const userCreds = conf.get('user-creds')
  info(
    chalk.yellow.bold(`User credentials are: ${userCreds.accesskey}, ${userCreds.secretkey} and ${userCreds.region}`)
  )
}

function listing ({ bucket }) {
  return getS3directorylisting(bucket)
    .then((s3keys) => {
      if (Array.isArray(s3keys)) {
        s3keys.forEach((element) => {
          if (element.Size === 0) {
            info(chalk.white.italic(element.Key))
          } else {
            info(chalk.white.italic(element.Key) + ' -- ' + chalk.white.italic(bytesToNiceFormat(element.Size)))
          }
        })
      } else {
        info(chalk.red.italic('SOMETHING WENT WRONG RETRIEVING THE S3 KEYS'))
      }
      return true
    }).catch((err) => {
      error(err)
      return err
    })
}

function downloadFile ({ bucket, key }) {
  return download(bucket, key)
    .then((result) => {
      return result
    }).catch((err) => {
      error(err)
      return err
    })
}

function uploadFile ({ bucket, filepath, prefix }) {
  return upload(bucket, filepath, prefix)
    .then((result) => {
      return result
    }).catch((err) => {
      error(err)
      return err
    })
}

function deleteFile ({ bucket, key }) {
  return deleteKey(bucket, key)
    .then((result) => {
      return result
    }).catch((err) => {
      error(err)
      return err
    })
}

function deploy ({ bucket }) {
  const { normalizePort, onError, onListening } = require(path.join(__dirname, '/server.js'))
  const port = normalizePort(process.env.PORT || '8008')
  app.set('port', port)
  const server = http.createServer(app)
  server.on('error', onError)
  server.on('listening', onListening)
  process.env.AWS_BUCKET_NAME = bucket
}

module.exports = {
  setupCredentials,
  getCredentials,
  listing,
  downloadFile,
  uploadFile,
  deleteFile,
  deploy
}
