'use strict';

function map() {
  emit({
    name: this.business
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
