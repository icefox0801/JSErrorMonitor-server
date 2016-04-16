'use strict';

function map() {
  emit(this.os.family, 1);
}

function reduce(k, vals) {
  return vals.length;
}

module.exports = function (options) {
  return Object.assign({}, { map, reduce }, options)
};
