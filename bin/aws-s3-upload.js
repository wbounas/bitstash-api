'use strict'

const mongoose = require('../app/middleware/mongoose')

const s3Upload = require('../lib/s3Upload')

const mime = require('mime-types')

// node packages
const fs = require('fs')
const path = require('path')

// "File" references the model right now.
// Consider changing "File" to some less common programming word later.
const File = require('../app/models/file')

// load environment variables
const filepath = process.argv[2]

const db = mongoose.connection

const done = function () { // eslint-disable-line no-unused-vars
  db.close()
}

// const stream = fs.createReadStream(filepath)
const ext = path.extname(filepath)
const filename = path.basename(filepath, ext)
const mimeType = mime.lookup(filepath)

const fileObject = {
  file: {
    originalname: filepath,
    path: filepath,
    mimetype: mimeType
  }
}

s3Upload(fileObject)
  .then(data => {
    return File.create({
      url: data.Location,
      file_name: filename,
      file_type: ext,
      file_size: 'placeholder',
      tags: ext,
      _owner: '4040404'
    })
  })
  .then(data => {
    console.log('data is', data)
    return data
  })
  .catch(console.error)
  .then(done)

//
// COMMAND LINE:
// NODE_PATH=. node bin/aws-s3-upload.js public/favicon.ico
