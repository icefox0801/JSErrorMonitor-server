'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var JSErrorSchema = new Schema({
  message: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  ip: {
    type: String,
    default: ''
  },
  stack: [{
    method: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 0
    },
    column: {
      type: Number,
      default: 0
    }
  }],
  file: {
    path: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 0
    },
    column: {
      type: Number,
      default: 0
    }
  },
  date: {
    type: Date,
    default: new Date()
  },
  browser: {
    name: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    }
  },
  device: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  os: {
    name: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    }
  },
  platform: {
    type: String,
    default: 'PC'
  },
  status: {
    type: String,
    default: 'open'
  },
  flag: {
    type: Number,
    default: 0
  },
  archiveId: {
    type: String,
    default: ''
  },
  archive: [{
    type: Schema.Types.ObjectId,
    ref: 'JSError'
  }]
});

JSErrorSchema.set('toObject', { getters: true });

var JSError = mongoose.model('JSError', JSErrorSchema);

module.exports = JSError;
