'use strict';
const _ = require('lodash');
const moment = require('moment');
const JSErrorModel = require('../models/jsError');
const queryCondition = require('./utils/queryCondition');
const groupDates = require('./utils/groupDates');

function errorTrend (req, res) {
  var params = req.body;

  var query = queryCondition(JSErrorModel.find().select('date'), params);

  query.exec().then(function (data) {
    var now = moment();
    var plots = groupDates(_.chain(data).map(jsError => jsError.date).value(), params.timeRange);
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: plots.list,
      meta: {
        start: plots.start,
        interval: plots.interval,
        format: plots.format
      }
    }));
  }, function (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

module.exports = {
  errorTrend: errorTrend
};
