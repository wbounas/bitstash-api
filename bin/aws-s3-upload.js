'use strict'

const mongoose = require('../app/middleware/mongoose')

const s3Upload = require('../lib/s3Upload')

// "File" references the model right now.
// Consider changing "File" to some less common programming word later.
const File = require('../app/models/file')

// load environment variables
const filepath = process.argv[2]

const db = mongoose.connection

const done = function () { // eslint-disable-line no-unused-vars
  db.close()
}

s3Upload(filepath)
  .then(data => {
    return File.create({
      url: data.Location
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
