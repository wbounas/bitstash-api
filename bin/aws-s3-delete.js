'use strict'

const mongoose = require('../app/middleware/mongoose')

const s3Delete = require('../lib/s3Delete.js')

const db = mongoose.connection

const done = function () { // eslint-disable-line no-unused-vars
  db.close()
}

// load environment variables
const fileKey = process.argv[2]

const objectForDelete = {
  key: fileKey
}

s3Delete(objectForDelete)
  .then(console.log)
  .catch(console.error)
  .then(done)
