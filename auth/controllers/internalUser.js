
const passport = require('passport')

// login
exports.login = (req, res) => {
    req.logout()
    res.render('login')
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