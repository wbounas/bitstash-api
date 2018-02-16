'use strict'

const HttpError = require('lib/wiring/errors/http-error')

const setMongooseModel = (model, options) =>
  function (req, res, next) {
    console.log('req.params is:', req.params)
    console.log('req.body is:', req.body)
    const search = { _id: req.params.id }
    if (options && options.forUser) {
      search._owner = req.user
    }

    model.findOne(search, (error, document) => {
      error = error || !document && new HttpError(404)
      if (error) {
        return next(error)
      }

      req[model.modelName.toLowerCase()] = document
      next()
    })
  }

module.exports = setMongooseModel
