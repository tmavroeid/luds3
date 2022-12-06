const winston = require('winston')
const { format } = winston
// const config = require(process.env.CONFIG_PATH)

const formatter = ({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} ${level}: ${stack}`
  } else {
    return `${timestamp} ${level}: ${message}`
  }
}

const transports = []

// Add console transport by default
transports.push(
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.splat(),
      format.printf(formatter)
    )
  })
)

// Add Sentry transport
// if (config.sentryDSN) {
//   const Sentry = require('winston-sentry-log')
//   transports.push(new Sentry({
//     config: {
//       dsn: config.sentryDSN,
//       release: config.version,
//       serverName: config.hostname,
//       tracesSampleRate: 1.0,
//       maxBreadcrumbs: 50
//     },
//     level: 'error'
//   }))
// }

// Configure global logger defaults
winston.configure({
  levels: winston.config.syslog.levels,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.splat(),
    format.printf(formatter)
  ),
  transports
})

// if (config.isDevelopment) {
//   winston.configure({
// format: format.combine(format.colorize({ all: true })),
// transports
//   })
// }

module.exports = winston
