'use strict';
const passport = require('passport');
const AccountModel = require('../models/account');

function authorized (req, res) {
  if(req.user) res.end('ok');

  res.end('fail');
}

function login (req, res, next) {

  passport.authenticate('local', function(err, user, info) {

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

    req.login(user, function(err) {

      if (err) {
        res.status(401);
        res.end(JSON.stringify({
          status: -1,
          message: err.message,
          result: null
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

  })(req, res, next);

}

function logout () {
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
  authorized,
  login,
  logout,
  register
};
