const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const OutlookStrategy = require('passport-outlook').Strategy
const User = require('../auth/models/user')
require('dotenv').config()

passport.serializeUser(function (user, done) {
    done(null, user)
})
passport.deserializeUser(function (obj, done) {
    done(null, obj)
})

// ... for city users
passport.use(new OutlookStrategy({
        clientID: process.env.OUTLOOK_CLIENT_ID,
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
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
                return done(null, user)
            }
            return done(null, false, {
                msg: 'Invalid email or password.'
            });
        });
    });
}));