"use strict";
var JSError = require('../models/jsError');
var useragent = require('useragent');
var stacky = require('stacky');
var requestIp = require('request-ip');

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

  var jsError = new JSError({
    message: params.m,
    file: {
      path: params.su,
      column: params.cn,
      line: params.ln
    },
    device: {
      width: params.w,
      height: params.h
    },
    os: {
      name: agent.os.family,
      version: agent.os.toVersion()
    },
    browser: {
      name: agent.family,
      version: agent.toVersion()
    },
    stack: stackInfo,
    userAgent: req.headers['user-agent'],
    url: req.headers['referer'],
    ip: ip,
    date: new Date()
  });

  jsError.save(function (err) {});

};
