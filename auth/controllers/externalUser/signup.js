const {
    promisify
} = require('util')
const crypto = require('crypto')
const User = require('../../models/user')
const randomBytesAsync = promisify(crypto.randomBytes)

// sendgrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID)

// signup
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/')
    }
    res.render('newAccount')
}

// post signup
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail()
    req.assert('password', 'Password must be at least 4 characters long').len(4)
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password)

    const errors = req.validationErrors()

    if (errors) {
        req.flash('errors', errors[0].msg)
        return res.render('newAccount')
    }

    const createRandomToken = randomBytesAsync(16)
        .then(buf => buf.toString('hex'))

    const createAccount = token =>
        User
        .findOne({
            email: req.body.email
        })
        .then(async user => {
            if (user) {
                req.flash('errors', 'Account with that email address already exists.')
                return res.render('newAccount')
            } else {
                const user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    organization: req.body.organization,
                    accountValidated: 'false',
                    accountValidationToken: token
                })
                await user.save()
                return user
            }
        })

    const sendAccountValidationEmail = async (user) => {
        if (!user) {
            return
        }
        const token = user.accountValidationToken
        const msg = {
            to: user.email,
            from: 'Support@pghethicstraining.com',
            subject: 'Validate your account for PGH Ethics Training',
            text: `You are receiving this email because you have created an account on PGH Ethics Training.\n\n
          Please click on the following link, or paste this into your browser to complete the account setup:\n\n
          http://${req.headers.host}/validate/${token}\n\n`
        }
        await sgMail.send(msg)
        req.flash('success', 'Success!  We have emailed you directions on how to complete account setup.')
        res.render('externalUser')
    }

    createRandomToken
        .then(createAccount)
        .then(sendAccountValidationEmail)
        .catch(next)
}

// validate account
exports.validateAccount = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    User
        .findOne({
            accountValidationToken: req.params.token,
            accountValidated: 'false'
        })
        .then((user) => {
            if (!user) {
                req.flash('errors', 'Your account is already validated.  Please try logging in.')
                return res.render('externalUser')
            }
            user.accountValidated = 'true'
            user.accountValidationToken = undefined
            return user.save().then(() => new Promise(async (resolve, reject) => {
                await req.logIn(user, (err) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(user)
                })
                req.session.save(() => {
                    res.redirect('/')
                })
            }))
        })
}