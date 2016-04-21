'use strict';
const collectError = require('./collectError');
const account = require('./account');
const error = require('./jsError');
const chart = require('./chart');
const archive = require('./archive');

module.exports = {
  collectError,
  account,
  error,
  archive,
  chart
};
