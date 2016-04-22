'use strict';
const passport = require('passport');
const AccountModel = require('../models/account');

function authenticated (req, res, next) {

  if(req.isAuthenticated()) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: {
        username: req.user.username
      }
    }));
  } else {
    res.end(JSON.stringify({
      status: -1,
      message: 'not authenticated!',
      result: {
        username: ''
      }
    }));
  }

}

function login (req, res) {

  passport.authenticate('local', function(err, user, info) {

    if (err) {
      res.status(500);
      res.end(JSON.stringify({
        status: -1,
        message: err.message,
        result: {
          username: ''
        }
      }));
      return false;
    }

    if (!user) {
      res.end(JSON.stringify({
        status: -1,
        message: 'username or password is invalid!',
        result: {
          username: ''
        }
      }));
      return false;
    }

    req.login(user, function(err) {

      if (err) {
        res.end(JSON.stringify({
          status: -1,
          message: err.message,
          result: {
            username: ''
          }
        }));
        return false;
      }

      res.end(JSON.stringify({
        status: 0,
        message: 'ok',
        result: {
          username: req.user.username
        }
      }));

    });

  })(req, res);

}

function logout (req, res) {
  req.logout();

  res.end(JSON.stringify({
    status: 0,
    message: 'ok',
    result: {
      username: ''
    }
  }));
}

function register (req, res) {
  AccountModel.register(new AccountModel({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      res.end(JSON.stringify({
        status: -1,
        message: err.message,
        result: null
      }));
      return false;
    }

    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.end(JSON.stringify({
          status: 0,
          message: 'ok',
          result: null
        }));
      });
    });
  });
}

module.exports = {
  authenticated,
  login,
  logout,
  register
};
