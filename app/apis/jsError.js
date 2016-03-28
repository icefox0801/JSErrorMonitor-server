'use strict';
const JSError = require('../models/jsError');
const _ = require('lodash');
const moment = require('moment');
const archiveMapReduce = require('./mapReduce/archive');

function listMost (req, res) {
  var promise = JSError.mapReduce(archiveMapReduce);

  promise.then(function (data) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: _.take(data.sort((x, y) => y.value.count - x.value.count), 10)
    }));
  }).then(function (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function listLatest (req, res) {
  var promise = JSError.mapReduce(archiveMapReduce);

  promise.then(function (data) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: _.take(data.sort((x, y) => y.value.latest - x.value.latest), 10)
    }));
  }).then(function (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function listAll (req, res) {
  var query = JSError.find().sort({
    date: -1
  }).limit(20);

  query.exec().then(function (jsErrors) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: jsErrors
    }));
  }).then(function (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

function listArchive (req, res) {
  var query = JSError.aggregate([{
    $group: {
      _id: {
        message: '$message',
        url: '$sUrl'
      },
      count: {
        $sum: 1
      },
      earliest: {
        $min: '$date'
      },
      latest: {
        $max: '$date'
      }
    }
  }, {
    $sort: {
      count: -1,
      latest: 1
    }
  }]);

  query.exec().then(function (data) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: data
    }));
  });
}

function listBrowser (req, res) {
}

module.exports = {
  listMost: listMost,
  listLatest: listLatest,
  listAll: listAll,
  listArchive: listArchive,
  listBrowser: listBrowser
};
