"use strict";
var express = require('express');
var router = express.Router();

var API = require('../apis');

/* GET home page. */
router.get('/', function(req, res) {
  res.end('index');
});

/* GET error list page */
router.get('/api/error/list/most', API.error.listMost);
router.get('/api/error/list/latest', API.error.listLatest);
router.get('/api/error/list/all/:page', API.error.listAll);
router.get('/api/error/list/archive/:page', API.error.listArchive);
router.get('/api/error/list/browser/:page', API.error.listBrowser);

/* GET charts */
router.get('/api/chart/error/trend', API.chart.errorTrend);

/* Error Collect API */
router.get('/collect/e.gif', API.collectError);

module.exports = router;

