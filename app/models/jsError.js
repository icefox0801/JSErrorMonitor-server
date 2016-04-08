'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JSErrorSchema = new Schema({
  message: {
    type: String,
    default: '',
    required: true
  },
  userAgent: {
    type: String,
    default: '',
    required: true
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
    family: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    major: {
      type: String,
      default: '0'
    },
    minor: {
      type: String,
      default: '0'
    },
    patch: {
      type: String,
      default: '0'
    }
  },
  device: {
    name: {
      type: String,
      default: ''
    },
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
    family: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    major: {
      type: String,
      default: '0'
    },
    minor: {
      type: String,
      default: '0'
    },
    patch: {
      type: String,
      default: '0'
    }
  },
  platform: {
    type: String,
    default: 'PC',
    required: true
  },
  business: {
    type: String,
    default: 'all',
    required: true
  },
  status: {
    type: String,
    default: 'open',
    required: true
  },
  flag: {
    type: Number,
    default: 0
  },
  archiveId: {
    type: Schema.Types.ObjectId
  }
});

JSErrorSchema.set('toObject', { getters: true });

const JSError = mongoose.model('JSError', JSErrorSchema);

module.exports = JSError;
