'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ArchiveSchema = new Schema({
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

var Archive = mongoose.model('Archive', ArchiveSchema);

module.exports = Archive;
