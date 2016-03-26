"use strict";
var express = require('express');
var router = express.Router();

var API = require('../apis');

/* GET home page. */

router.get('/', function(req, res) {
  res.end('index');
});

/* GET error list page */
router.get('/api/error/list/all', API.error.listAll);
router.get('/api/error/list/achieve', API.error.listAchieve);

/* Error Collect API */
router.get('/collect/e.gif', API.collectError);

module.exports = router;

