/**
 * Module dependencies.
 */
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const expressValidator = require('express-validator')
const sass = require('node-sass-middleware')
const methodOverride = require('method-override')
require('dotenv').config()

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home')
const userController = require('./controllers/user')

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport')

/**
 * Create Express server.
 */
const app = express()

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
  process.exit()
})

/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(bodyParser())
app.use(methodOverride())
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}))
app.use(expressValidator())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1209600000
  }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl
  } else if (req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl
  }
  next()
})
app.use('/', express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000
}))
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
  maxAge: 31557600000
}))
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
  maxAge: 31557600000
}))
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), {
  maxAge: 31557600000
}))
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
  maxAge: 31557600000
}))

/**
 * Primary app routes.
 */
app.get('/', homeController.index)
app.get('/login', userController.getLogin)
app.post('/login', userController.postLogin)
app.get('/logout', userController.logout)
app.get('/forgot', userController.getForgot)
app.post('/forgot', userController.postForgot)
app.get('/reset/:token', userController.getReset)
app.post('/reset/:token', userController.postReset)
app.get('/signup', userController.getSignup)
app.post('/signup', userController.postSignup)
app.get('/account', passportConfig.isAuthenticated, userController.getAccount)
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile)
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword)


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler())
} else {
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Server Error')
  })
}

/**
 * Start Express server.
 */
const port = process.env.PORT || 5000
app.listen(port)
console.log(`Listening on ${port}`)