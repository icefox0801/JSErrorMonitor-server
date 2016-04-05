'use strict';
const moment = require('moment');
function buildRegex (str) {
  return new RegExp('^' + (str === 'all' ? '.*' : str) + '$' ,'i');
}

module.exports = function (query, params) {
  var timeRange = parseInt(params.timeRange, 10) || 168;
  var browser = params.browser || 'all';
  var os = params.os || 'all';
  var status = params.status || 'all';
  var keyword = params.keyword;
  var browserRegex = buildRegex(browser);
  var osRegex = buildRegex(os);
  var statusRegex = buildRegex(status);
  var keywordRegex = new RegExp(keyword || '.*', 'i');
  return query.where('date').gte(moment().subtract(timeRange, 'h').toDate())
    .where('status').regex(statusRegex)
    .where('browser.name').regex(browserRegex)
    .where('os.name').regex(osRegex)
    .where('message').regex(keywordRegex);
};
