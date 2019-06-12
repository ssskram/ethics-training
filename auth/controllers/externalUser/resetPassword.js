const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../../models/user");
const randomBytesAsync = promisify(crypto.randomBytes);

// sendgrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID);

// forgot password
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("forgotPassword");
};

// post forgot password
exports.postForgot = (req, res, next) => {
  req.assert("email", "Please enter a valid email address.").isEmail();
  req.sanitize("email").normalizeEmail({
    gmail_remove_dots: false
  });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors[0].msg);
    return res.render("forgotPassword");
  }

  const createRandomToken = randomBytesAsync(16).then(buf =>
    buf.toString("hex")
  );

  const setRandomToken = token =>
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (!user) {
        req.flash("errors", "Account with that email address does not exist.");
        return res.render("forgotPassword");
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user = user.save();
      }
      return user;
    });

  const sendForgotPasswordEmail = async user => {
    if (!user) {
      return;
    }
    const token = user.passwordResetToken;
    const msg = {
      to: user.email,
      from: "Support@pghethicstraining.com",
      subject: "Reset your password on PGH Ethics Training",
      text: `You are receiving this email because you have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await sgMail.send(msg);
    req.flash(
      "info",
      `An e-mail has been sent to ${user.email} with further instructions.`
    );
    res.render("forgotPassword");
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .catch(next);
};

// get password reset token
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  User.findOne({
    passwordResetToken: req.params.token
  })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", "Password reset token is invalid or has expired.");
        return res.render("forgotPassword");
      }
      res.render("reset", {
        token: req.params.token
      });
    });
};

// process password reset
exports.postReset = (req, res, next) => {
  req.assert("password", "Password must be at least 4 characters long.").len(4);
  req.assert("confirm", "Passwords must match.").equals(req.body.password);
  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors[0].msg);
    return res.render("reset", {
      token: req.body.token
    });
  }

  const resetPassword = () =>
    User.findOne({
      passwordResetToken: req.body.token
    })
      .where("passwordResetExpires")
      .gt(Date.now())
      .then(user => {
        if (!user) {
          req.flash(
            "errors",
            "Password reset token is invalid or has expired."
          );
          return res.render("forgotPassword");
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(
          () =>
            new Promise((resolve, reject) => {
              req.logIn(user, err => {
                if (err) {
                  return reject(err);
                }
                resolve(user);
              });
            })
        );
      });

  const sendResetPasswordEmail = async user => {
    if (!user) {
      return;
    }
    const msg = {
      to: user.email,
      from: "Support@pghethicstraining.com",
      subject: "Your PGH Ethics Training password has been changed",
      text: `Hello,\n\nThis is a confirmation that the password for your account ${
        user.email
      } has just been changed.\n`
    };
    await sgMail.send(msg);
    req.flash("success", "Success! Your password has been changed.");
    res.render("externalUser");
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .catch(err => next(err));
};
