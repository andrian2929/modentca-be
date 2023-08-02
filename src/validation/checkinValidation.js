const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const CheckinSchema = joi
  .object({
    type: joi.string().required().valid('morning', 'evening').messages({
      'any.required': 'TYPE_REQUIRED',
      'string.base': 'TYPE_MUST_BE_STRING',
      'any.only': 'TYPE_INVALID'
    })
  })
  .messages({
    'object.unknown': 'UNKNOWN_FIELD_FOUND'
  })

const getCheckInReportSchema = joi
  .object({
    regionType: joi
      .string()
      .required()
      .valid('province', 'city', 'district', 'subString')
      .messages({
        'any.required': 'REGION_TYPE_REQUIRED',
        'string.base': 'REGION_TYPE_MUST_BE_STRING',
        'any.only': 'REGION_TYPE_INVALID',
        'string.empty': 'REGION_TYPE_REQUIRED'
      }),
    regionId: joi.string().required().messages({
      'any.required': 'REGION_ID_REQUIRED',
      'string.base': 'REGION_ID_MUST_BE_STRING',
      'string.empty': 'REGION_ID_REQUIRED'
    }),
    year: joi
      .string()
      .pattern(/^[0-9]{4}$/)
      .required()
      .messages({
        'any.required': 'YEAR_REQUIRED',
        'string.base': 'YEAR_MUST_BE_STRING',
        'string.empty': 'YEAR_REQUIRED',
        'string.pattern.base': 'YEAR_INVALID'
      }),
    month: joi
      .string()
      .required()
      .pattern(/^(0?[1-9]|1[0-2])$/)
      .messages({
        'any.required': 'MONTH_REQUIRED',
        'string.base': 'MONTH_MUST_BE_STRING',
        'string.empty': 'MONTH_REQUIRED',
        'string.pattern.base': 'MONTH_INVALID'
      })
  })
  .messages({
    'object.unknown': 'UNKNOWN_FIELD_FOUND'
  })

const checkIn = async (req, res, next) => {
  const { error } = CheckinSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const getCheckInReport = async (req, res, next) => {
  const { error } = getCheckInReportSchema.validate(req.params)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }

  next()
}

module.exports = { checkIn, getCheckInReport }
