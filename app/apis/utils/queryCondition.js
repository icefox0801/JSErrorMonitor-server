'use strict';
const moment = require('moment');

function buildRegex (str) {
  return new RegExp('^' + (str === 'all' ? '.*' : str) + '$' ,'i');
}

module.exports = function (query, params) {
  var timeRange = parseInt(params.timeRange, 10) || 168;
  var browserRegex = buildRegex(params.browser || 'all');
  var osRegex = buildRegex(params.os || 'all');
  var statusRegex = buildRegex(params.status || 'all');
  var keywordRegex = new RegExp(params.keyword || '.*', 'i');
  return query.where('date').gte(moment().subtract(timeRange, 'h').toDate())
    .where('status').regex(statusRegex)
    .where('browser.name').regex(browserRegex)
    .where('os.name').regex(osRegex)
    .where('message').regex(keywordRegex);
};
