'use strict';
const _ = require('lodash');
const moment = require('moment');
const JSErrorModel = require('../models/jsError');
const queryCondition = require('./utils/queryCondition');
const getJSErrorCondition = require('./utils/getJSErrorCondition');
const groupDates = require('./utils/groupDates');
const browserMapReduce = require('./mapReduce/browser');
const osMapReduce = require('./mapReduce/os');
const businessMapReduce = require('./mapReduce/business');
const platformMapReduce = require('./mapReduce/platform');


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
        interval: plots.interval
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

function errorBrowser (req, res) {
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(browserMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).map(browser => ({ name: browser._id.family, count: browser.value.count })).value();
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result
    }));
  }, err => {
    res.writeHead(500);
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function errorOs (req, res) {
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(osMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).map(os => ({ name: os._id.family, count: os.value.count })).value();
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result
    }));
  }, err => {
    res.writeHead(500);
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function errorBusiness (req, res) {
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(businessMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).map(business => ({ name: business._id.name, count: business.value.count })).value();
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result
    }));
  }, err => {
    res.writeHead(500);
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function errorPlatform (req, res) {
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(platformMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).map(platform => ({ name: platform._id.name, count: platform.value.count })).value();
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result
    }));
  }, err => {
    res.writeHead(500);
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

module.exports = {
  errorTrend,
  errorBrowser,
  errorOs,
  errorBusiness,
  errorPlatform
};
