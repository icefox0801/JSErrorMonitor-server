'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: String
  }
});

AccountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', AccountSchema);
