'use strict';
var JSError = require('../models/jsError');
var moment = require('moment');

function errorTrend (req, res) {

  try {
    var query = JSError.aggregate([{
      $match: {
        date: {
          $gte: new Date(moment().subtract(24, 'h'))
        }
      }
    }, {
      $project: {
        _id: '$date',
        hourAgo: {
          $mod: [{
            $subtract: [{
              $add: [new Date().getUTCHours(), 24]
            }, {
              $hour: '$date'
            }]
          }, 24]
        }
      }
    }, {
      $group: {
        _id: {
          hourAgo: '$hourAgo'
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $sort: {
        _id: 1
      }
    }]);

  } catch (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  }

  query.exec().then(function (data) {
    res.end(JSON.stringify({
      status: 0,
      message: 'ok',
      result: data
    }));
  }, function (err) {
    res.end(JSON.stringify({
      status: -1,
      message: err.message,
      result: null
    }));
  });
}

module.exports = {
  errorTrend: errorTrend
};
