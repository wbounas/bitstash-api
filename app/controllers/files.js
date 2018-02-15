'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const File = models.file

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

// node packages
const multer = require('multer')
const multerUpload = multer({ dest: '/tmp' })
const fs = require('fs')
const path = require('path')

const s3Upload = require('../../lib/s3Upload')
const s3Delete = require('../../lib/s3Delete')

const index = (req, res, next) => {
  File.find()
    .then(files => res.json({
      files: files.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    file: req.file.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  // console.log('req is', req)
  const userFile = req
  // console.log('userFile:', userFile)
  console.log('req.body:', req.body)
  console.log('req.file:', req.file)
  // const userFile = Object.assign(req.body.file, {
  //   _owner: req.body.user._id
  // })
  // console.log('req.user is', req.user)
  // console.log('req is', req)
  // console.log('req.file is', req.file)

  // s3Upload(req.file)
  //   .then((data) => File.create({
  //     url: data.Location
  //   }))
  //   .then(file =>
  //     res.status(201)
  //       .json({
  //         file: file.toJSON({ virtuals: true, user: req.user })
  //       }))
  //   .catch(next)

  const ext = path.extname(userFile.file.originalname)
  const filename = path.basename(userFile.file.originalname, ext)
  // returns object with various file info, including size
  const fileSizeInBytes = fs.statSync(userFile.file.path).size
  console.log('look at me!!')
  s3Upload(userFile)
    .then(data => {
      return File.create({
        url: data.Location,
        file_name: filename,
        file_type: ext,
        file_size: fileSizeInBytes,
        tags: ext,
        _owner: req.body.user._id
        // _owner: userFile._owner
      })
    })
    .then(file =>
      res.status(201)
        .json({
          file: file.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.file._owner  // disallow owner reassignment.

  req.file.update(req.body.file)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  // Define the key for S3 Bucket
  const keyURL = req.file.url
  const searchString = 'amazonaws.com/'
  // This returns the position of the first character of the key
  const startChar = keyURL.search(searchString) + searchString.length
  // this is the position of last character of the key string
  const endChar = keyURL.length
  // This parses the key string from the KeyURL
  const keyString = keyURL.substring(startChar, endChar)

  // This object is for the s3Delete function
  const objectForDelete = {
    key: keyString
  }

  s3Delete(objectForDelete)
    .then(data => req.file.remove())
    .then(data => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: multerUpload.single('file[path]'), only: ['create'] },
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(File), only: ['show'] },
  { method: setModel(File, { forUser: true }), only: ['update', 'destroy'] }
] })
