const {
  promisify
} = require('util')
const crypto = require('crypto')
const passport = require('passport')
const User = require('../models/user')
const randomBytesAsync = promisify(crypto.randomBytes)

// sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID)

// login
exports.getLoginForm = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  } else res.render('externalUser')
}

// post login
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/login')
    }
    await req.login(user, (err) => {
      if (err) {
        return next(err)
      }
    })
    req.session.save(() => {
      res.redirect('/')
    })
  })(req, res, next)
}


// signup
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.render('newAccount')
}

// post signup
exports.postSignup = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })
  User.findOne({
    email: req.body.email
  }, (err, existingUser) => {
    if (err) {
      return next(err)
    }
    if (existingUser) {
      return res.redirect('/signup')
    }
    user.save((err) => {
      if (err) {
        return next(err)
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  })
}


// get password reset token
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  User
    .findOne({
      passwordResetToken: req.params.token
    })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect('/forgotPassword')
      }
      console.log('here')
      res.render('reset', {
        token: req.params.token
      })
    })
}

// process password reset
exports.postReset = (req, res, next) => {
  const resetPassword = () =>
    User
    .findOne({
      passwordResetToken: req.body.token
    })
    .where('passwordResetExpires').gt(Date.now())
    .then((user) => {
      if (!user) {
        return res.redirect('back')
      }
      user.password = req.body.password
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      return user.save().then(() => new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            return reject(err)
          }
          resolve(user)
        })
      }))
    })

  const sendResetPasswordEmail = (user) => {
    if (!user) {
      return
    }
    const msg = {
      to: user.email,
      from: 'Support@pghethicstraining.com',
      subject: 'Your PGH Ethics Training password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    }
    sgMail.send(msg)
  }

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => {
      if (!res.finished) res.redirect('/')
    })
    .catch(err => next(err))
}

// forgot password
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  res.render('forgotPassword')
}

// post forgot password
exports.postForgot = (req, res, next) => {

  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'))

  const setRandomToken = token =>
    User
    .findOne({
      email: req.body.email
    })
    .then((user) => {
      if (!user) {} else {
        user.passwordResetToken = token
        user.passwordResetExpires = Date.now() + 3600000 // 1 hour
        user = user.save()
      }
      return user
    })

  const sendForgotPasswordEmail = async (user) => {
    if (!user) {
      return
    }
    const token = user.passwordResetToken
    const msg = {
      to: user.email,
      from: 'Support@pghethicstraining.com',
      subject: 'Reset your password on PGH Ethics Training',
      text: `You are receiving this email because you have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    await sgMail.send(msg)
    req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`)
    res.render('forgotPassword')
  }

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .catch(next)
}