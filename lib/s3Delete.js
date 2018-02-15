'use strict'

require('dotenv').config()

// npm packages
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const mime = require('mime-types')

// node packages
const fs = require('fs')
const path = require('path')

const promiseDeleteObject = function (params) {
  return new Promise((resolve, reject) => {
    console.log('Can\'t wait to delete these params!!', params)
    s3.deleteObject(params, function (err, data) {
      if (err) { reject(err) }
      console.log('"console.log(err, data)" is directly underneath me\nThe data should appear under this line.\n')
      console.log(err, data)
      resolve(data)
    })
  })
}

const s3Delete = function (data) {
  console.log('preparing to delete data:', data)
  const params = {
    Bucket: 'bucket-bitstash',
    Key: data.key
  }

  return promiseDeleteObject(params)
}

module.exports = s3Delete

/* The following example deletes an object from an S3 bucket. */
 //
 // var params = {
 //  Bucket: "examplebucket",
 //  Key: "objectkey.jpg"
 // };
 // s3.deleteObject(params, function(err, data) {
 //   if (err) console.log(err, err.stack); // an error occurred
 //   else     console.log(data);           // successful response
 //   /*
 //   data = {
 //   }
 //   */
 // });
