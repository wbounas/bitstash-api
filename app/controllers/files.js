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
  console.log('req is', req)
  const userFile = Object.assign(req.body.userFile, {
    _owner: req.body.user._id
  })
  console.log('req.user is', req.user)
  console.log('req is', req)
  console.log('req.file is', req.file)

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

  const ext = path.extname(userFile.originalname)
  const filename = path.basename(userFile.originalname, ext)
  // returns object with various file info, including size
  const fileSizeInBytes = fs.statSync(userFile.path).size

  s3Upload(userFile)
    .then(data => {
      return File.create({
        url: data.Location,
        file_name: filename,
        file_type: ext,
        file_size: fileSizeInBytes,
        tags: ext,
        _owner: userFile._owner
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
  req.file.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: multerUpload.single('image[file]'), only: ['create'] },
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show', 'create'] },
  { method: setModel(File), only: ['show'] },
  { method: setModel(File, { forUser: true }), only: ['update', 'destroy'] }
] })
