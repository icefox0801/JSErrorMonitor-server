"use strict";
var express = require('express');
var router = express.Router();

var API = require('../apis');

/* GET home page. */
router.get('/', function(req, res) {
  res.end('index');
});

/* POST error list */
router.post('/api/error/list/most', API.error.listMost);
router.post('/api/error/list/latest', API.error.listLatest);
router.post('/api/error/list/all/:page', API.error.listAll);
router.post('/api/error/list/archive/:page', API.error.listArchive);
router.post('/api/error/list/page/:page', API.error.listPage);
router.post('/api/error/list/browser/', API.error.listBrowser);
router.post('/api/error/list/os/', API.error.listOS);

/* GET error detail */
router.get('/api/error/detail/:id', API.error.detail);

/* GET charts */
router.get('/api/chart/error/trend', API.chart.errorTrend);

/* Error Collect API */
router.get('/collect/e.gif', API.collectError);

module.exports = router;

