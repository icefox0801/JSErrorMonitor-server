'use strict';

const _ = require('lodash');
const moment = require('moment');
const map = {
  '1': {
    format: '',
    interval: 5 * 60 * 1000 // 5minutes
  },
  '24': {
    format: '',
    interval: 60 * 60 * 1000 // 1hour
  },
  '168': {
    format: '',
    interval: 12 * 60 * 60 * 1000 // 12hours
  },
  '720': {
    format: '',
    interval: 24 * 60 * 60 * 1000 // 1day
  },
  '8760': {
    format: '',
    interval: 30 * 24 * 60 * 60 * 1000 // 1month
  }
};

module.exports = function (dateList, timeRange) {
  const now = moment();
  timeRange = timeRange ? timeRange.toString() : '1';
  var interval = map[timeRange].interval || 1;
  var format = map[timeRange].format || 'hh:mm';
  var length = timeRange * 60 * 60 * 1000 / interval;
  var countMap =  _.chain(dateList).map(date => moment(date).diff(now, 'ms')).countBy(ms => Math.floor(ms / interval)  + length).value();
  var countList = _.fill(new Array(length + 1), 0);
  _.each(countMap, (value, key) => {
    countList[key] = value;
  });
  var start = moment().subtract(timeRange, 'h').toDate().getTime();
  return {
    list: countList,
    start: start,
    interval,
    format
  }
};
