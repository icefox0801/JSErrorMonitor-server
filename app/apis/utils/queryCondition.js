'use strict';
const moment = require('moment');

function buildRegex (str) {
  return new RegExp('^' + (str === 'all' ? '.*' : str) + '$' ,'i');
}

module.exports = function (query, params) {
  var timeRange = parseInt(params.timeRange, 10) || 168;
  var browserRegex = buildRegex(params.browser || 'all');
  var osRegex = buildRegex(params.os || 'all');
  var statusRegex = buildRegex(params.status || 'open');
  var businessRegex = buildRegex(params.business || 'all');
  var keywordRegex = new RegExp(params.keyword || '.*', 'i');
  var platformRegex = buildRegex(params.platform || 'PC');
  return query.where('date').gte(moment().subtract(timeRange, 'h').toDate())
    .where('platform').regex(platformRegex)
    .where('business').regex(businessRegex)
    .where('status').regex(statusRegex)
    .where('browser.family').regex(browserRegex)
    .where('os.family').regex(osRegex)
    .where('message').regex(keywordRegex);
};
