const passport = require('passport')

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
            req.flash('errors', info.msg)
            return res.render('externalUser')
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