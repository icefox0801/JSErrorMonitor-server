'use strict';
const JSErrorModel = require('../models/jsError');
const ArchiveModel = require('../models/archive');
const useragent = require('useragent');
const stacky = require('stacky');
const requestIp = require('request-ip');

module.exports = function (req, res) {
  var params = req.query;
  var agent = useragent.parse(req.headers['user-agent']);
  var stackInfo = (params.s !== 'undefined') && stacky.parse(params.s);
  var ip = requestIp.getClientIp(req);

  res.writeHeader(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'image/gif'
  });

  res.end();

  var jsError = new JSErrorModel({
    message: params.m,
    file: {
      path: params.su,
      column: params.cn,
      line: params.ln
    },
    device: {
      name: agent.device.toString(),
      width: params.w,
      height: params.h
    },
    os: {
      family: agent.os.family,
      version: agent.os.toVersion(),
      major: agent.os.major,
      minor: agent.os.minor,
      patch: agent.os.patch
    },
    browser: {
      family: agent.family,
      version: agent.toVersion(),
      major: agent.major,
      minor: agent.minor,
      patch: agent.patch
    },
    stack: stackInfo,
    userAgent: req.headers['user-agent'],
    url: req.headers['referer'],
    ip: ip,
    date: new Date()
  });

  jsError.save((err, jsErrorDoc) => {
    var id = jsErrorDoc.id;
    var message = jsErrorDoc.message;
    var url = jsErrorDoc.url;
    var date = jsErrorDoc.date;
    var business = jsErrorDoc.business;

    var query = ArchiveModel.find({
      url,
      message,
      status: 'open'
    });

    query.exec().then(archiveDocs => {
      var archive;
      if(archiveDocs.length === 0) {
        archive = new ArchiveModel({
          url,
          message,
          business,
          earliest: date
        });
      } else {
        archive = archiveDocs[0];
      }

      archive.jsErrors.unshift(id);
      archive.set('latest', date);
      archive.set('business', business);
      archive.save((err, archiveDoc) => {
        jsErrorDoc.set('archiveId', archiveDoc.id);
        jsErrorDoc.save();
      });

    }, err => {});

  });

};
