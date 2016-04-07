'use strict';

const _ = require('lodash');

module.exports = function (data) {
  var resultMap = _.chain(data).map(item => ({
    family: item._id.family,
    version: item._id.version,
    count: item.value.count
  })).groupBy('family').value();

  _.each(resultMap, (value, key) => {
    var count = _.sumBy(value, 'count');
    var max = _.maxBy(value, 'version').version;
    var min = _.minBy(value, 'version').version;
    _.set(resultMap, key, {
      family: key,
      versions: _.sortBy(value, 'version'),
      count, max, min
    })
  });

  return _.chain(resultMap).values().sortBy('count').reverse().value();
};
