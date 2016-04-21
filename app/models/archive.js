'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
  orderId: {
    type: Number,
    default: 1
  },
  message: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  business: {
    type: String,
    default: 'all',
    required: true
  },
  platform: {
    type: String,
    default: 'PC',
    required: true
  },
  earliest: {
    type: Date,
    default: new Date
  },
  latest: {
    type: Date,
    default: new Date
  },
  jsErrors: [{
    type: Schema.Types.ObjectId,
    ref: 'JSError'
  }],
  status: {
    type: String,
    default: 'open'
  }
});

autoIncrement.initialize(mongoose.connection);
ArchiveSchema.plugin(autoIncrement.plugin, {
  model: 'Archive',
  field: 'orderId',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Archive', ArchiveSchema);
