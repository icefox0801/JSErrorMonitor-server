"use strict";
const express = require('express');
const router = express.Router();

const API = require('../apis');

/* home page routes */
router.get('/', function(req, res) {
  res.end('index');
});

/* error list routes */
router.post('/api/error/list/most', API.error.listMost);
router.post('/api/error/list/latest', API.error.listLatest);
router.post('/api/error/list/all/:page', API.error.listAll);
router.post('/api/error/list/archive/:page', API.error.listArchive);
router.post('/api/error/list/page/:page', API.error.listPage);
router.post('/api/error/list/browser/', API.error.listBrowser);
router.post('/api/error/list/os/', API.error.listOS);

/* archive routes */
router.get('/api/archive/detail/:id', API.archive.detail);
router.get('/api/archive/detail/:id/:skip', API.archive.detailMore);
router.post('/api/archive/update/:id', API.archive.update);

/* chart routes */
router.post('/api/chart/error/trend', API.chart.errorTrend);
router.post('/api/chart/error/browser', API.chart.errorBrowser);
router.post('/api/chart/error/os', API.chart.errorOs);
router.post('/api/chart/error/business', API.chart.errorBusiness);
router.post('/api/chart/error/platform', API.chart.errorPlatform);

/* error collect API */
router.get('/collect/e.gif', API.collectError);

module.exports = router;

