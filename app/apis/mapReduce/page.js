'use strict';

function map() {
  emit({
    message: this.message,
    url: this.url,
    status: this.status
  }, {
    count: 1,
    earliest: this.date.getTime(),
    latest: this.date.getTime()
  });
}

function reduce(k, vals) {
  var e, l, o;

  for(var i = 0, len = vals.length; i < len; i++) {
    o = vals[i];
    if(i === 0) {
      e = o.earliest;
      l = o.latest;
    } else {
      e = (o.earliest < e) ? o.earliest : e;
      l = (o.latest > e) ? o.latest : e
    }
  }

  return {
    count: len,
    earliest: new Date(e),
    latest: new Date(l)
  }
}

module.exports = function (options) {
  return Object.assign({}, { map, reduce }, options)
};
