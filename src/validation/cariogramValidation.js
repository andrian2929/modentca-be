const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const checkCariogramSchema = joi
  .object({
    decayed: joi.number().required().messages({
      'number.base': 'DECAYED_MUST_BE_NUMBER',
      'number.empty': 'DECAYED_REQUIRED',
      'any.required': 'DECAYED_REQUIRED'
    }),
    extracted: joi.number().required().messages({
      'number.base': 'EXTRACTED_MUST_BE_NUMBER',
      'number.empty': 'EXTRACTED_REQUIRED',
      'any.required': 'EXTRACTED_REQUIRED'
    }),
    filled: joi.number().required().messages({
      'number.base': 'FILLED_MUST_BE_NUMBER',
      'number.empty': 'FILLED_REQUIRED',
      'any.required': 'FILLED_REQUIRED'
    })
      .messages({
        'object.unknown': 'UNKNOWN_FIELD_FOUND'
      })
  })

const getCariogramHistorySchema = joi.object({
  startDate: joi.date().optional().format('YYYY-MM-DD').messages({
    'date.format': 'START_DATE_INVALID_FORMAT'
  }),
  endDate: joi.date().optional().format('YYYY-MM-DD').messages({
    'date.format': 'END_DATE_INVALID_FORMAT'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const checkCariogram = (req, res, next) => {
  const { error } = checkCariogramSchema.validate(req.query)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const getCariogramHistory = (req, res, next) => {
  const { error } = getCariogramHistorySchema.validate(req.query)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = { checkCariogram, getCariogramHistory }
