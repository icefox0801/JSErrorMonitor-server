'use strict';
const JSErrorModel = require('../models/jsError');
const ArchiveModel = require('../models/archive');
const _ = require('lodash');
const moment = require('moment');
const archiveMapReduce = require('./mapReduce/archive');
const pageMapReduce = require('./mapReduce/page');
const browserMapReduce = require('./mapReduce/browser');
const osMapReduce = require('./mapReduce/os');
const getJSErrorCondition = require('./utils/getJSErrorCondition');
const getArchiveCondition = require('./utils/getArchiveCondition');
const queryCondition = require('./utils/queryCondition');
const groupResults = require('./utils/groupResults');

function listMost (req, res) {
  var query = ArchiveModel.find(getArchiveCondition(req.body))
    .select('_id message url status jsErrors earliest latest');

  query.exec().then(data => {
    var result = _.chain(data)
      .map(archiveModel => _.chain(archiveModel.toJSON()).set('count', archiveModel.jsErrors.length).omit('jsErrors').value())
      .sortBy(['count', 'latest']).reverse().take(10).value();

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
  var query = ArchiveModel.find(getArchiveCondition(req.body))
    .select('_id message url status jsErrors earliest latest');

  query.exec().then(data => {
    var result = _.chain(data)
      .map(archiveModel => _.chain(archiveModel.toJSON()).set('count', archiveModel.jsErrors.length).omit('jsErrors').value())
      .sortBy(['latest', 'count']).reverse().take(10).value();
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
  var queryData = queryCondition(JSErrorModel.find().select('_id message browser os date status'), params)
    .sort({ date: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  var queryCount = queryCondition(JSErrorModel.find(), params).count();

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

  var query = ArchiveModel.find(getArchiveCondition(req.body))
    .select('_id message url status jsErrors earliest latest');

  query.exec().then( data => {
    var result = _.chain(data)
      .map(archiveModel => _.chain(archiveModel.toJSON()).set('count', archiveModel.jsErrors.length).omit('jsErrors').value())
      .sortBy(['count', 'latest']).reverse().slice(startIndex, endIndex).value();

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

function listPage (req, res) {
  var page = req.params.page;
  var pageSize = parseInt(req.body.pageSize, 10) || 20;
  var startIndex = (page - 1) * pageSize;
  var endIndex = page * pageSize;
  var query = ArchiveModel.find(getArchiveCondition(req.body))
    .select('_id message url status jsErrors earliest latest');

  query.exec().then( data => {
    var resultMap = _.chain(data).each(archive => {
      _.set(archive, 'count', archive.jsErrors.length);
    }).groupBy('url').value();
    _.each(resultMap, (value, key) => {
      _.set(resultMap, key, {
        url: key,
        count: _.sumBy(value, 'count'),
        earliest: _.minBy(value, 'earliest').earliest,
        latest: _.maxBy(value, 'latest').latest,
        archive: _.keys(_.countBy(value, 'message')).length
      });
    });
    var chainQuery = _.chain(resultMap).values().sortBy('count').reverse();
    var result = chainQuery.slice(startIndex, endIndex).value();

    var meta = {};
    meta.count = chainQuery.value().length;
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
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(browserMapReduce({
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
  var queryOptions = getJSErrorCondition(req.body);
  var promise = JSErrorModel.mapReduce(osMapReduce({
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

function detail (req, res) {
  var id = req.params.id;
  var query = ArchiveModel.findById(id).select('_id status latest earliest platform business url message jsErrors').populate('jsErrors', 'message url stack userAgent browser os date', null, {
    sort: {
      date: -1
    },
    limit: 10
  });

  query.exec().then(archiveModel => {
    var abstract = {
      message: archiveModel.message,
      url: archiveModel.url,
      status: archiveModel.status,
      earliest: archiveModel.earliest,
      latest: archiveModel.latest
    };
    var browsers = _.chain(archiveModel.jsErrors).groupBy('browser.family').keys();
    var os = _.chain(archiveModel.jsErrors).groupBy('os.family').keys();
    _.set(abstract, 'browsers', browsers);
    _.set(abstract, 'os', os);
    _.set(abstract, 'count', archiveModel.jsErrors.length);
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: archiveModel.jsErrors,
      abstract
    }));
  })
}

module.exports = {
  listMost: listMost,
  listLatest: listLatest,
  listAll: listAll,
  listArchive: listArchive,
  listPage: listPage,
  listBrowser: listBrowser,
  listOS: listOS,
  detail: detail
};
