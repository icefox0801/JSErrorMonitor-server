'use strict';
const JSErrorModel = require('../models/jsError');
const ArchiveModel = require('../models/archive');
const _ = require('lodash');
const moment = require('moment');
const queryCondition = require('./utils/queryCondition');

function detail (req, res) {
  var id = req.params.id;
  var query = ArchiveModel.findById(id).select('_id orderId status latest earliest platform business url message jsErrors').populate('jsErrors', 'message url stack userAgent browser os date', null, {
    sort: {
      date: 1
    },
    limit: 5
  });
  var queryCount = ArchiveModel.findById(id).select('jsErrors');

  Promise.all([query.exec(), queryCount.exec()]).then( out => {
    var archiveModel = out[0];
    var count = out[1].jsErrors.length;
    var abstract = {
      orderId: archiveModel.orderId,
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
    _.set(abstract, 'count', count);
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: archiveModel.jsErrors,
      abstract
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

function detailMore (req, res) {
  var id = req.params.id;
  var skip = req.params.skip;
  var query = ArchiveModel.findById(id).select('jsErrors').populate('jsErrors', 'message url stack userAgent browser os date', null, {
    sort: {
      date: 1
    },
    skip,
    limit: 5
  });

  query.exec().then(archiveModel => {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: archiveModel.jsErrors
    }));
  }, err => {
    res.writeHead(500);
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  })
}

function update (req, res) {
  var id = req.params.id;
  var params = req.body;
  var queryArchive = ArchiveModel.where({ '_id': id }).update({ $set: params });
  var queryJSErrors = JSErrorModel.where({ 'archiveId': id }).setOptions({ multi: true }).update({ $set: params } );

  Promise.all([queryArchive.exec(), queryJSErrors.exec()]).then(out => {
    var notAllOk = (out[0].n !== out[0].ok && out[1].n !== out[1].ok);

    if(notAllOk) {
      res.end(JSON.stringify({
        status: -1,
        message: err.message,
        result: null
      }));
      return false;
    } else {
      res.end(JSON.stringify({
        status: 0,
        message: 'ok',
        result: params
      }));
    }

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
  detail,
  detailMore,
  update
};
