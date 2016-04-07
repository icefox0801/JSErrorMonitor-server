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
  var count = vals.length, min, max, v;

  for(var i = 0; i < count; i++) {
    v = vals[i].version;
  }

  return {
    count: count
  };
}

module.exports = function (options) {
  return Object.assign({}, { map, reduce }, options)
};
