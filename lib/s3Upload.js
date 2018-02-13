'use strict'

require('dotenv').config()

// s3Upload(filepath)
// npm packages
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const mime = require('mime-types')

// node packages
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const promiseRandomBytes = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
        resolve(buf.toString('hex'))
      }
    })
  })
}

// const filepath = process.argv[2]

const promiseUpload = function (params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) { reject(err) }
      console.log('I should appear BEFORE the data')
      console.log('"console.log(err, data)" is directly underneath me\nThe data should appear under this line.\n')
      console.log(err, data)
      console.log('\nNow, (theoretically) the data has been logged.\nHowever, the promiseUpload function has not resolved.\n The final line should not have logged yet.')
      resolve(data)
      console.log('\nThis log occurs underneath the "resolve(data)" line in the promiseUpload function\nIt should not appear, right? WHY IS IT HERE?!\n')
    })
  })
}

// const params = {
//   ACL: 'public-read',
//   Bucket: 'first-bucket-water-buffalo',
//   ContentType: mimeType,
//   Key: randomString + ext,
//   Body: stream
// }
// folder = (new Date()).toISOString().slice(0,10)
// that returns the date in yyyy-mm-dd format. Good to organize files into folders based on date.
const s3Upload = function (xFile) {
  // for reference:
  // fs.createReadStream('sample.txt', { start: 90, end: 99 });
  let stream
  let ext
  let filename
  let mimeType
  if ((typeof xFile) === 'string') {
    stream = fs.createReadStream(xFile)
    ext = path.extname(xFile)
    filename = path.basename(xFile, ext)
    mimeType = mime.lookup(xFile)
  } else {
    stream = fs.createReadStream(xFile.file.path)
    ext = path.extname(xFile.file.originalname)
    filename = path.basename(xFile.file.originalname, ext)
    mimeType = xFile.file.mimetype
  }

  // console.log('mimeType: ', mimeType)
  const folder = (new Date()).toISOString().slice(0, 10)

  return promiseRandomBytes()
    .then(rando => {
      return {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: mimeType,
        Key: folder + '/' + rando + '-' + filename + ext,
        Body: stream
      }
    })
    .then(promiseUpload)
}

module.exports = s3Upload
