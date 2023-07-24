const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const cariogramSchema = joi
  .object({
    decay: joi.number().required().messages({
      'number.base': 'DECAY_MUST_BE_NUMBER',
      'number.empty': 'DECAY_REQUIRED',
      'any.required': 'DECAY_REQUIRED'
    }),
    extracted: joi.number().required().messages({
      'number.base': 'EXTRACTED_MUST_BE_NUMBER',
      'number.empty': 'EXTRACTED_REQUIRED',
      'any.required': 'EXTRACTED_REQUIRED'
    }),
    filling: joi.number().required().messages({
      'number.base': 'FILLING_MUST_BE_NUMBER',
      'number.empty': 'FILLING_REQUIRED',
      'any.required': 'FILLING_REQUIRED'
    })
      .messages({
        'object.unknown': 'UNKNOWN_FIELD_FOUND'
      })
  })

const cariogram = (req, res, next) => {
  const { error } = cariogramSchema.validate(req.query)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = { cariogram }
