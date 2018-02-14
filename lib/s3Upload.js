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
      console.log('"console.log(err, data)" is directly underneath me\nThe data should appear under this line.\n')
      console.log(err, data)
      resolve(data)
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
const s3Upload = function (xFile) {
  // for reference:
  // fs.createReadStream('sample.txt', { start: 90, end: 99 });
  console.log('I made my variables, yum!')
  const stream = fs.createReadStream(xFile.path)
  const ext = path.extname(xFile.originalname)
  const filename = path.basename(xFile.originalname, ext)
  const mimeType = xFile.mimetype

  // This returns the date in yyyy-mm-dd format. Good to organize files into folders based on date.
  const folder = (new Date()).toISOString().slice(0, 10)



  return promiseRandomBytes()
    .then(rando => {
      return {
        ACL: 'public-read',
        Bucket: 'bucket-bitstash', // OR Bucket: process.env.AWS_BUCKET_NAME
        ContentType: mimeType,
        Key: folder + '/' + rando + '-' + filename + ext,
        Body: stream
      }
    })
    .then(promiseUpload)
}

module.exports = s3Upload
