"use strict";
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const stacky = require('stacky');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const routes = require('./routes/index');

const app = express();

const env = process.env.NODE_ENV || 'development';

const authenticateMiddleWare = function (req, res ,next) {

  passport.authenticate('local', { session: false }, function(err, user, info) {
    if (err) {
      res.status(500);
      res.end(JSON.stringify({
        status: -1,
        message: err.message,
        result: null
      }));
      return false;
    }

    if (!user) {
      res.status(401);
      res.end(JSON.stringify({
        status: -1,
        message: 'username or password is invalid!',
        result: null
      }));
      return false;
    }

    next();

  });
};

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use('error', authenticateMiddleWare);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;

  res.end(JSON.stringify({
    status: -1,
    message: err.message,
    result: null
  }));

});

/// error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      stack: err.stack
    }))

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    status: -1,
    message: err.message,
    stack: err.stack
  }))
});

// Connect to mongodb
var connect = function () {

  var url = 'mongodb://127.0.0.1:27017/jsError';
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };

  mongoose.connect(url, options);


};

connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

module.exports = app;
