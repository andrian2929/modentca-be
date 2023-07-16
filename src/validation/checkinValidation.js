const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const CheckinSchema = joi.object({
  type: joi.string().required().valid('morning', 'evening').messages({
    'any.required': 'TYPE_REQUIRED',
    'string.base': 'TYPE_MUST_BE_STRING',
    'any.only': 'TYPE_INVALID'
  })
}).messages({
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

module.exports = { checkIn }
