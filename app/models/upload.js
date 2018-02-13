'use strict'

const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {}
})

const Upload = mongoose.model('Upload', uploadSchema)

module.exports = Upload
