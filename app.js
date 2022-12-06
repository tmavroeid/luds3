const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const swaggerJSDoc = require('swagger-jsdoc')
const logger = require('./common/logger')
const swaggerUi = require('swagger-ui-express')
const helmet = require('helmet')
const cors = require('cors')

const s3Router = require('./routes/index')

const app = express()

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
    description:
      'This is a REST API made with Express to list S3 buckets and download files',
    license: {
      name: 'Licensed Under MIT'
    },
    contact: {
      name: 'The Ex Machina development team'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000'
    }
  ]
}
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js']
}
const swaggerSpec = swaggerJSDoc(options)
// view engine setup
app.set('views', path.join(__dirname, 'views'))
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'hbs')

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', s3Router)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/healthcheck', (req, res) => {
  res.sendStatus(200)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
