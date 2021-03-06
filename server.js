const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressValidator = require("express-validator");
const passport = require("passport");
const mongoose = require("mongoose");
const flash = require("express-flash");
const MongoStore = require("connect-mongo")(session);

// passport config
require("./config/passport");

// environment variables
require("dotenv").config();

// connect to mongo
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

// configure express
const app = express();
app.set("views", __dirname + "/auth/views");
app.set("view engine", "ejs");
app.use(cookieParser(process.env.SECRET));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(expressValidator());
app.use(methodOverride());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1209600000
    },
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/auth/assets"));
app.use(flash());

// external users
const externalLogin = require("./auth/controllers/externalUser/login");
const signup = require("./auth/controllers/externalUser/signup");
const resetPassword = require("./auth/controllers/externalUser/resetPassword");
app.get("/externalUser", externalLogin.getLoginForm);
app.post("/login", externalLogin.postLogin);
app.get("/newAccount", signup.getSignup);
app.post("/newAccount", signup.postSignup);
app.get("/validate/:token", signup.validateAccount);
app.get("/forgotPassword", resetPassword.getForgot);
app.post("/forgotPassword", resetPassword.postForgot);
app.get("/reset/:token", resetPassword.getReset);
app.post("/reset", resetPassword.postReset);

// internal users
const internalUser = require("./auth/controllers/internalUser");
app.get("/login", internalUser.login);
app.get("/accessDenied", internalUser.accessDenied);
app.get("/auth", internalUser.auth);
app.get(
  "/signin-microsoft",
  passport.authenticate("windowslive", {
    failureRedirect: "/login"
  }),
  async function(req, res) {
    // if user has pgh emal address, let through the gates
    if (req.user.emails[0].value.includes("@pittsburghpa.gov")) {
      await req.logIn(req.user, err => {
        if (err) {
          return next(err);
        }
      });
      req.session.save(() => {
        res.redirect("/");
      });
    }
  }
);

// logout
const logout = require("./auth/controllers/logout");
app.get("/logout", logout.logout);

// returns user's email address
app.get("/getUser", function(req, res) {
  res.status(200).send({
    user: req.user.email || req.user.emails[0].value,
    organization: req.user.organization || "City of Pittsburgh",
    name: req.user.name || req.user.displayName
  });
});

// all other routes get pushed through wildcard
// basically, some string tricks to ensure bundle gets imported correctly and then
// routing is deferred to react running in client
app.get("*", ensureAuthenticated, (req, res) => {
  const link = req.path == "/" ? "index.html" : req.path;
  const root = path.join(__dirname, "app/build");
  res.sendFile(
    link,
    {
      root: root
    },
    error => {
      if (error) {
        res.sendFile("/", {
          root: root
        });
      }
    }
  );
});

// helper function to validate user on every route
async function ensureAuthenticated(req, res, next) {
  const authed = await req.isAuthenticated();
  if (authed == true) {
    return next();
  } else {
    res.redirect("/login");
  }
}

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Listening on ${port}`);
