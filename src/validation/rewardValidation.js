const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const storeRewardSchema = joi.object({
  name: joi.string().max(255).required().messages({
    'string.base': 'NAME_MUST_BE_STRING',
    'string.max': 'NAME_MAX_255',
    'string.empty': 'NAME_REQUIRED',
    'any.required': 'NAME_REQUIRED'
  }),
  description: joi.string().max(255).required().messages({
    'string.base': 'DESCRIPTION_MUST_BE_STRING',
    'string.max': 'DESCRIPTION_MAX_255',
    'string.empty': 'DESCRIPTION_REQUIRED',
    'any.required': 'DESCRIPTION_REQUIRED'
  }),
  point: joi.number().required().messages({
    'number.base': 'POINT_MUST_BE_NUMBER',
    'number.empty': 'POINT_REQUIRED',
    'any.required': 'POINT_REQUIRED'
  }),
  stock: joi.number().required().messages({
    'number.base': 'STOCK_MUST_BE_NUMBER',
    'number.empty': 'STOCK_REQUIRED',
    'any.required': 'STOCK_REQUIRED'
  }),
  isAvailable: joi.boolean().required().messages({
    'boolean.base': 'IS_AVAILABLE_MUST_BE_BOOLEAN',
    'boolean.empty': 'IS_AVAILABLE_REQUIRED',
    'any.required': 'IS_AVAILABLE_REQUIRED'
  })
})
  .messages({
    'object.unknown': 'UNKNOWN_FIELD_FOUND'
  })

const updateRewardSchema = joi.object({
  name: joi.string().max(255).optional().messages({
    'string.base': 'NAME_MUST_BE_STRING',
    'string.max': 'NAME_MAX_255',
    'string.empty': 'NAME_REQUIRED'
  }),
  description: joi.string().max(255).optional().messages({
    'string.base': 'DESCRIPTION_MUST_BE_STRING',
    'string.max': 'DESCRIPTION_MAX_255',
    'string.empty': 'DESCRIPTION_REQUIRED'
  }),
  point: joi.number().optional().messages({
    'number.base': 'POINT_MUST_BE_NUMBER',
    'number.empty': 'POINT_REQUIRED'
  }),
  stock: joi.number().optional().messages({
    'number.base': 'STOCK_MUST_BE_NUMBER',
    'number.empty': 'STOCK_REQUIRED'
  }),
  isAvailable: joi.boolean().optional().messages({
    'boolean.base': 'IS_AVAILABLE_MUST_BE_BOOLEAN',
    'boolean.empty': 'IS_AVAILABLE_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const storeReward = (req, res, next) => {
  const { error } = storeRewardSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const updateReward = (req, res, next) => {
  const { error } = updateRewardSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = { storeReward, updateReward }
