'use strict'

const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true
  },
  file_type: {
    type: String,
    required: true
  },
  file_size: {
    type: String,
    required: true
  },
  _owner: { // this is needed to set up a relationship (one to many) between a User and Examples
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { // options for the `.toJSON` method
    virtuals: true, // include virtual properties when we call `.toJSON`
    // this transform will set a `.editable` property on the resulting pojo
    // created by `.toJSON` which is `true` if the user making the request
    // owns the resource, otherwise false
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const File = mongoose.model('File', fileSchema)

module.exports = File
