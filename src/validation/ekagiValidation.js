const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)
const { ValidationError } = joi

const ekagiSchema = joi.object({
  title: joi.string().alter({
    post: (ekagiSchema) => ekagiSchema.required(),
    put: (ekagiSchema) => ekagiSchema.optional()
  }).max(255).messages({
    'any.required': 'TITLE_REQUIRED',
    'string.base': 'TITLE_MUST_BE_STRING',
    'string.max': 'TITLE_MAX_255',
    'string.empty': 'TITLE_REQUIRED'
  }),
  type: joi.string().alter({
    post: (ekagiSchema) => ekagiSchema.required(),
    put: (ekagiSchema) => ekagiSchema.optional()
  }).valid('article', 'video').messages({
    'any.required': 'TYPE_REQUIRED',
    'string.base': 'TYPE_MUST_BE_STRING',
    'any.only': 'TYPE_INVALID',
    'string.empty': 'TYPE_REQUIRED'
  }),
  content: joi.string()
    .alter({
      post: (ekagiSchema) => ekagiSchema.required(),
      put: (ekagiSchema) => ekagiSchema.optional()
    })
    .required().messages({
      'any.required': 'CONTENT_REQUIRED',
      'string.base': 'CONTENT_MUST_BE_STRING',
      'string.empty': 'CONTENT_REQUIRED'
    }),
  thumbnail: joi.any().optional()
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const storeEkagi = async (req, res, next) => {
  console.log(req.body)
  const { error } = ekagiSchema.tailor('post').validate(req.body)
  console.error(error)
  if (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: {
          message: error.details[0].message
        }
      })
    }

    return res.status(400).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const updateEkagi = async (req, res, next) => {
  const { error } = ekagiSchema.tailor('put').validate(req.body)
  console.error(error)
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = { storeEkagi, updateEkagi }
