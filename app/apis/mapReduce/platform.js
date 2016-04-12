'use strict';

function map() {
  emit({
    name: this.platform
  }, {
    count: 1
  });
}

function reduce(k, vals) {
  return {
    count: vals.length
  };
}

module.exports = function (options) {
  return Object.assign({}, { map, reduce }, options)
};
