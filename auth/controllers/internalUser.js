
const passport = require('passport')

// login
exports.login = (req, res) => {
    req.logout()
    res.render('login')
}

// logout
exports.logout = (req, res) => {
    req.logout()
    req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err)
        req.user = null
        res.redirect('/login')
    })
}

// 401
exports.accessDenied = (req, res) => {
    req.logout()
    res.render('401')
}

// MS oauth service redirect
exports.auth = passport.authenticate('windowslive', {
    scope: [
        'https://outlook.office.com/Mail.Read'
    ]
})