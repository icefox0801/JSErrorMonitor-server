'use strict';

function map() {
  emit({
    version: this.browser.version,
    family: this.browser.family
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
