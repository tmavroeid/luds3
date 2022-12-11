const path = require('path')
const app = require('./app')
const debug = require('debug')('server:server')
const http = require('http')
const { getS3object, bytestoniceformat, getS3directorylisting } = require(path.join(__dirname, '/logic/utils'))
const logger = require('winston')
const conf = new (require('conf'))()
const chalk = require('chalk')
const info = (msg) => logger.log('info', `${msg}`)
const error = (msg, stacktrace = undefined) => logger.log('error', `[Controllers] ${msg}`, stacktrace)
const port = normalizePort(process.env.PORT || '8008')
app.set('port', port)
const server = http.createServer(app)

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
    .then((results) => {
      results.forEach((element) => {
        if (element.Size === 0) {
          info(chalk.white.italic(element.Key))
        } else {
          info(chalk.white.italic(element.Key) + ' -- ' + chalk.white.italic(bytesToNiceFormat(element.Size)))
        }
      })
      return results
    }).catch((err) => {
      error(err)
      return err
    })
}

function download (key) {
  return getS3object(key)
    .then((result) => {
      return result
    }).catch((err) => {
      error(err)
      return err
    })
}

function deploy ({ bucket }) {
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
  process.env.AWS_BUCKET_NAME = bucket
}

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
    * Event listener for HTTP server "error" event.
    */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
    * Event listener for HTTP server "listening" event.
    */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
  console.log('Listening on', bind)
  console.log('Avaliable Endpoints: /list, /download/[FILEKEY]')
}

module.exports = {
  setupCredentials,
  getCredentials,
  listing,
  download,
  deploy
}
