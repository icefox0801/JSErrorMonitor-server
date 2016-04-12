'use strict';

function map() {
  emit({
    version: this.os.version,
    family: this.os.family
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
