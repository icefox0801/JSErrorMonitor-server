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

  promise.then(data => res.end(JSON.stringify({
    status: 0,
    message: 'ok',
    result: _.take(data.sort((x, y) => y.value.latest - x.value.latest), 10)
  })), err => res.end(JSON.stringify({
    status: -1,
    message: err.message,
    result: null
  })));

}

function listAll (req, res) {

  var page = req.params.page;
  var pageSize = 20;

  var queryData = JSError.find().sort({
    date: -1
  }).skip(pageSize * (page - 1)).limit(pageSize);

  var queryCount = JSError.count({url: ''});

  Promise.all([queryData.exec(), queryCount.exec()]).then(out => {

    var jsErrors = out[0];
    var count = out[1];
    var meta = {};

    meta.total = Math.ceil(count / pageSize);
    meta.current = req.params.page;
    meta.pageSize = pageSize;

    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: jsErrors,
      meta: meta
    }));
  }, err => res.end(JSON.stringify({
    status: -1,
    message: err.message,
    result: null
  })));

}

function listArchive (req, res) {
  var query = JSError.aggregate([{
    $group: {
      _id: {
        message: '$message',
        url: '$url'
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
  var query = JSError.aggregate([{
    $group: {
      _id: {
        name: '$browser.name'
      },
      count: {
        $sum: 1
      },
      min: {
        $min: '$browser.version'
      },
      max: {
        $max: '$browser.version'
      }
    }
  }, {
    $sort: {
      count: -1
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

module.exports = {
  listMost: listMost,
  listLatest: listLatest,
  listAll: listAll,
  listArchive: listArchive,
  listBrowser: listBrowser
};
