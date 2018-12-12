const express = require('express')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const OutlookStrategy = require('passport-outlook').Strategy
const User = require('./auth/models/user')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const expressValidator = require('express-validator')

// environment variables
require('dotenv').config()
const OUTLOOK_CLIENT_ID = process.env.OUTLOOK_CLIENT_ID
const OUTLOOK_CLIENT_SECRET = process.env.OUTLOOK_CLIENT_SECRET

// /**
//  * Controllers (route handlers).
//  */
// const userController = require('./auth/controllers/user')

// configure passport
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})
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

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  User.findOne({
    email: email.toLowerCase()
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        msg: `Email ${email} not found.`
      });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, {
        msg: 'Invalid email or password.'
      });
    });
  });
}));
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
 * Create Express server.
 */
const app = express()
app.set('views', __dirname + '/auth/views')
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser())
app.use(methodOverride())
app.use(expressValidator())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'mmmmmCOOKIES',
  cookie: {
    _expires: (720 * 60 * 1000)
  },
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/auth/assets'))

// app.use((req, res, next) => {
//   res.locals.user = req.user
//   next()
// })

// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//     req.path !== '/login' &&
//     req.path !== '/signup' &&
//     !req.path.match(/^\/auth/) &&
//     !req.path.match(/\./)) {
//     req.session.returnTo = req.originalUrl
//   } else if (req.user &&
//     (req.path === '/account' || req.path.match(/^\/api/))) {
//     req.session.returnTo = req.originalUrl
//   }
//   next()
// })

// /**
//  * auth routing
//  */

// app.post('/login', userController.postLogin)
// app.get('/forgot', userController.getForgot)
// app.post('/forgot', userController.postForgot)
// app.get('/reset/:token', userController.getReset)
// app.post('/reset/:token', userController.postReset)
// app.get('/signup', userController.getSignup)
// app.post('/signup', userController.postSignup)

// returns user's email address
app.use('/getUser', function (req, res) {
  res.status(200).send({
    "user": req.user.emails[0].value
  })
})

// login page
app.get('/login', function (req, res) {
  req.logout()
  res.render('login', {
    user: req.user
  })
})

// logout endpoint, called from client
// logs out user and redirects to login page
app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
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
  function (req, res) {
    // if user has pgh emal address, let through the gates
    if (req.user.emails[0].value.includes('@pittsburghpa.gov')) {
      res.locals.user = req.user
      res.redirect('/')
    } else { // otherwise, get lost!
      res.redirect('/accessDenied')
    }
  })


// all other routes get pushed through wildcard
// basically, some string tricks to ensure bundle gets imported correctly and then
// routing is deferred to react running in client
app.get('*', ensureAuthenticated, (req, res) => {
  console.log('here')
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
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

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