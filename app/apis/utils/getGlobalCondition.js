'use strict';
var moment = require('moment');

module.exports = function (params) {
  var timeRange = parseInt(params.timeRange, 10) || 168;
  var browser = params.browser || 'all';
  var os = params.os || 'all';
  var business = params.business || 'all';
  var browserRegex = new RegExp('^' + (browser === 'all' ? '.*' : browser) + '$' ,'i');
  var osRegex = new RegExp('^' + (os === 'all' ? '.*' : os) + '$', 'i');
  var businessRegex = new RegExp('^' + (business === 'all' ? '.*' : os) + '$', 'i');
  var platform = params.platform || 'PC';
  var platformRegex = new RegExp('^' + platform + '$', 'i');
  return {
    platform: {
      $regex: platformRegex
    },
    $or: [
      {business: {$regex: businessRegex}},
      {business: {$exists: false}}
    ],
    date: {
      $gte: moment().subtract(timeRange, 'h').toDate()
    }
  };
};
