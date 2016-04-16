'use strict';
const collectError = require('./collectError');
const error = require('./jsError');
const chart = require('./chart');
const archive = require('./archive');

module.exports = {
  collectError: collectError,
  error: error,
  archive: archive,
  chart: chart
};
