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

/* error detail routes */
router.get('/api/error/detail/:id', API.error.detail);
router.post('/api/error/detail/:id', API.error.detailUpdate);

/* GET charts */
router.get('/api/chart/error/trend', API.chart.errorTrend);

/* Error Collect API */
router.get('/collect/e.gif', API.collectError);

module.exports = router;

