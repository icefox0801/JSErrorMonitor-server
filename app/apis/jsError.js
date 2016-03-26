"use strict";
var JSError = require('../models/jsError');

function listAll (req, res) {
  var a = 1;
  var query = JSError.find();

  query.exec().then(function (jsErrors) {
    res.end(JSON.stringify(jsErrors));
  });
}

function listAchieve (req, res) {
  var query = JSError.aggregate([{
    $group: {
      _id: '$message',
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
    res.end(data);
  });
}

function listBrowser (req, res) {
}

module.exports = {
  listAll: listAll,
  listAchieve: listAchieve,
  listBrowser: listBrowser
};
