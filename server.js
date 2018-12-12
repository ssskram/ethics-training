const express = require('express')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const OutlookStrategy = require('passport-outlook').Strategy
const LocalStrategy = require('passport-local').Strategy
const User = require('./auth/models/user')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')

// environment variables
require('dotenv').config()
const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET
const MONGO_URI = process.env.MONGODB_URI

// connect to mongo
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGO_URI)
const db = mongoose.connection

// configure passport
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// ... for city users
passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: 'signin-microsoft',
    proxy: true
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile)
    })
  }
))

// ... for non-city users
passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  User.findOne({
    email: email.toLowerCase()
  }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, {
        msg: `Email ${email} not found.`
      })
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err)
      }
      if (isMatch) {
        return done(null, user)
      }
      return done(null, false, {
        msg: 'Invalid email or password.'
      })
    })
  })
}))

// cookie config
const cookieExpirationDate = new Date()
const cookieExpirationDays = 365
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays)

// configure express
const app = express()
app.set('views', __dirname + '/auth/views')
app.set('view engine', 'ejs')
app.use(cookieParser('asdf33g4w4hghjkuil8saef345'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(methodOverride())
app.use(session({
  secret: 'asdf33g4w4hghjkuil8saef345',
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: cookieExpirationDate
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/auth/assets'))
app.use(cors())

/*
Endpoints!!
Only one to retrieve email
*/

// returns user's email address
app.get('/getUser', function (req, res) {
  res.status(200).send({
    'user': req.user.emails[0].value
  })
})

/**
 * auth routing
 */

const userController = require('./auth/controllers/user')
app.post('/login', userController.postLogin)
app.get('/forgot', userController.getForgot)
app.post('/forgot', userController.postForgot)
app.get('/reset/:token', userController.getReset)
app.post('/reset/:token', userController.postReset)
app.get('/signup', userController.getSignup)
app.post('/signup', userController.postSignup)

/**
 * all other routing
 */

// login page
app.get('/login', function (req, res) {
  req.logout()
  res.render('login')
})

// logout endpoint, called from client
// logs out user and redirects to login page
app.get('/logout', function (req, res) {
  req.logout()
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err)
    req.user = null
    res.redirect('/login')
  })
})

// 401 page
app.get('/accessDenied', function (req, res) {
  req.logout()
  res.render('401')
})

// MS oauth service redirect
app.get('/auth',
  passport.authenticate('windowslive', {
    scope: [
      'https://outlook.office.com/Mail.Read'
    ]
  })
)
// ...and return
app.get('/signin-microsoft',
  passport.authenticate('windowslive', {
    failureRedirect: '/login'
  }),
  async function (req, res, next) {
    // if user has pgh emal address, let through the gates
    if (req.user.emails[0].value.includes('@pittsburghpa.gov')) {
      await req.logIn(req.user, (err) => {
        if (err) {
          return next(err)
        }
      })
      req.session.save(() => {
        res.redirect('/')
      })
    } else { // otherwise, get lost!
      res.redirect('/accessDenied')
    }
  })

// all other routes get pushed through wildcard
// basically, some string tricks to ensure bundle gets imported correctly and then
// routing is deferred to react running in client
app.get('*', ensureAuthenticated, (req, res) => {
  const link = (req.path == '/' ? 'index.html' : req.path)
  const root = path.join(__dirname, 'app/build')
  res.sendFile(link, {
    root: root
  }, (error) => {
    if (error) {
      res.sendFile('/', {
        root: root
      })
    }
  })
})

// helper function to validate user on every route
function ensureAuthenticated(req, res, next) {
  console.log('here')
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const port = process.env.PORT || 5000
app.listen(port)
console.log(`Listening on ${port}`)