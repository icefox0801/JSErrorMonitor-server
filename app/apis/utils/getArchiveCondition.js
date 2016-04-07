'use strict';
const moment = require('moment');

function buildRegex (str) {
  return new RegExp('^' + (str === 'all' ? '.*' : str) + '$' ,'i');
}

module.exports = function (params) {
  var timeRange = parseInt(params.timeRange, 10) || 168;
  var browserRegex = buildRegex(params.browser || 'all');
  var osRegex = buildRegex(params.os || 'all');
  var businessRegex = buildRegex(params.business || 'all');
  var statusRegex = buildRegex(params.status || 'all');
  var keywordRegex = new RegExp(params.keyword || '.*', 'i');
  var platformRegex = buildRegex(params.platform || 'PC');
  return {
    platform: {
      $regex: platformRegex
    },
    status: {
      $regex: statusRegex
    },
    business: {
      $regex: businessRegex
    },
    earliest: {
      $gte: moment().subtract(timeRange, 'h').toDate()
    },
    message: {
      $regex: keywordRegex
    }
  };
};
