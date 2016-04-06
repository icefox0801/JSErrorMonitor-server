'use strict';
const JSError = require('../models/jsError');
const _ = require('lodash');
const moment = require('moment');
const archiveMapReduce = require('./mapReduce/archive');
const browserMapReduce = require('./mapReduce/browser');
const osMapReduce = require('./mapReduce/os');
const getGlobalCondition = require('./utils/getGlobalCondition');
const queryCondition = require('./utils/queryCondition');
const groupResults = require('./utils/groupResults');

function listMost (req, res) {
  var queryOptions = getGlobalCondition(req.body);
  var promise = JSError.mapReduce(archiveMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).sortBy('value.count').reverse().take(10).map(archive => ({
      message: archive._id.message,
      url: archive._id.url,
      count: archive.value.count,
      earliest: archive.value.earliest,
      latest: archive.value.latest
    })).value();
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

function listLatest (req, res) {
  var queryOptions = getGlobalCondition(req.body);
  var promise = JSError.mapReduce(archiveMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = _.chain(data).sortBy('value.latest').reverse().take(10).map(archive => ({
      message: archive._id.message,
      url: archive._id.url,
      count: archive.value.count,
      earliest: archive.value.earliest,
      latest: archive.value.latest
    })).value();
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

function listAll (req, res) {
  var page = req.params.page;
  var pageSize = parseInt(req.body.pageSize, 10) || 20;
  var params = req.body;
  var queryData = queryCondition(JSError.find().select('_id message browser os date status'), params)
    .sort({ date: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  var queryCount = queryCondition(JSError.find(), params)
    .count();

  Promise.all([queryData.exec(), queryCount.exec()]).then(out => {
    var jsErrors = out[0];
    var count = out[1];
    var meta = {};

    meta.count = count;
    meta.total = Math.ceil(count / pageSize);
    meta.current = req.params.page;
    meta.pageSize = pageSize;

    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: jsErrors,
      meta
    }));
  }, err => {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }))
  });

}

function listArchive (req, res) {
  var page = req.params.page;
  var pageSize = parseInt(req.body.pageSize, 10) || 20;
  var startIndex = (page - 1) * pageSize;
  var endIndex = page * pageSize;
  var queryOptions = getGlobalCondition(req.body);
  var promise = JSError.mapReduce(archiveMapReduce({
    query: queryOptions
  }));

  promise.then( data => {
    var result = _.chain(data).sortBy('value.count').reverse().slice(startIndex, endIndex).map(archive => ({
      message: archive._id.message,
      url: archive._id.url,
      status: archive._id.status,
      count: archive.value.count,
      earliest: archive.value.earliest,
      latest: archive.value.latest
    })).value();

    var meta = {};
    meta.count = data.length;
    meta.total = Math.ceil(meta.count / pageSize);
    meta.current = page;
    meta.pageSize = pageSize;

    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result, meta
    }));
  }, err => {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }))
  });
}

function listBrowser (req, res) {
  var queryOptions = getGlobalCondition(req.body);
  var promise = JSError.mapReduce(browserMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = groupResults(data);
    var meta = { count: result.length };
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result, meta
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

function listOS (req, res) {
  var queryOptions = getGlobalCondition(req.body);
  var promise = JSError.mapReduce(osMapReduce({
    query: queryOptions
  }));

  promise.then(data => {
    var result = groupResults(data);
    var meta = { count: result.length };
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result, meta
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
  listMost: listMost,
  listLatest: listLatest,
  listAll: listAll,
  listArchive: listArchive,
  listBrowser: listBrowser,
  listOS: listOS
};
