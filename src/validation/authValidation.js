const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)
const User = require('../models/User')

const registerUserSchema = joi.object({
  firstName: joi.string().max(255).required().messages({
    'any.required': 'FIRST_NAME_REQUIRED',
    'string.base': 'FIRST_NAME_MUST_BE_STRING',
    'string.max': 'FIRST_NAME_MAX_255',
    'string.empty': 'FIRST_NAME_REQUIRED'
  }),
  lastName: joi.string().max(255).optional().messages({
    'string.base': 'LAST_NAME_MUST_BE_STRING',
    'string.max': 'LAST_NAME_MAX_255',
    'string.empty': 'LAST_NAME_REQUIRED'
  }),
  username: joi.string().required().max(32).messages({
    'any.required': 'USERNAME_REQUIRED',
    'string.base': 'USERNAME_MUST_BE_STRING',
    'string.max': 'USERNAME_MAX_32',
    'string.empty': 'USERNAME_REQUIRED'
  }),
  parentEmail: joi.string().optional().email().max(255).messages({
    'string.base': 'EMAIL_MUST_BE_STRING',
    'string.email': 'EMAIL_INVALID',
    'string.max': 'EMAIL_MAX_255',
    'string.empty': 'EMAIL_REQUIRED'
  }),
  password: joi.string().min(8).max(255).required().messages({
    'string.base': 'PASSWORD_MUST_BE_STRING',
    'any.required': 'PASSWORD_REQUIRED',
    'string.min': 'PASSWORD_MIN_8',
    'string.max': 'PASSWORD_MAX_255',
    'string.empty': 'PASSWORD_REQUIRED'
  }),
  birthDate: joi.date().format('YYYY-MM-DD').required().messages({
    'any.required': 'BIRTH_DATE_REQUIRED',
    'date.base': 'BIRTH_DATE_INVALID',
    'date.empty': 'BIRTH_DATE_REQUIRED',
    'date.format': 'BIRTH_DATE_INVALID'
  }),
  sex: joi.string().valid('L', 'P').required().messages({
    'string.base': 'SEX_MUST_BE_STRING',
    'any.only': 'SEX_INVALID',
    'any.required': 'SEX_REQUIRED',
    'string.empty': 'EMAIL_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const loginUserSchema = joi.object({
  username: joi.string().required().max(32).messages({
    'any.required': 'USERNAME_REQUIRED',
    'string.base': 'USERNAME_MUST_BE_STRING',
    'string.max': 'USERNAME_MAX_32'
  }),
  password: joi.string().required().messages({
    'string.base': 'PASSWORD_MUST_BE_STRING',
    'any.required': 'PASSWORD_REQUIRED',
    'string.empty': 'PASSWORD_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const verifyEmailSchema = joi.object({
  email: joi.string().max(255).email().required().messages({
    'string.base': 'EMAIL_MUST_BE_STRING',
    'any.required': 'EMAIL_REQUIRED',
    'string.email': 'EMAIL_INVALID',
    'string.max': 'EMAIL_MAX_255',
    'string.empty': 'EMAIL_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const updatePasswordSchema = joi.object({
  currentPassword: joi.string().required().messages({
    'string.base': 'CURRENT_PASSWORD_MUST_BE_STRING',
    'any.required': 'CURRENT_PASSWORD_REQUIRED',
    'string.empty': 'CURRENT_PASSWORD_REQUIRED'
  }),
  newPassword: joi.string().max(255).required().messages({
    'string.base': 'NEW_PASSWORD_MUST_BE_STRING',
    'any.required': 'NEW_PASSWORD_REQUIRED',
    'string.max': 'NEW_PASSWORD_MAX_255',
    'string.empty': 'NEW_PASSWORD_REQUIRED'
  })
}).messages({})

const resetPasswordSchema = joi.object({
  newPassword: joi.string().max(255).required().messages({
    'string.base': 'NEW_PASSWORD_MUST_BE_STRING',
    'any.required': 'NEW_PASSWORD_REQUIRED',
    'string.max': 'NEW_PASSWORD_MAX_255',
    'string.empty': 'NEW_PASSWORD_REQUIRED'
  }),
  confirmPassword: joi.string().max(255).required().valid(joi.ref('newPassword')).messages({
    'string.base': 'CONFIRM_PASSWORD_MUST_BE_STRING',
    'any.required': 'CONFIRM_PASSWORD_REQUIRED',
    'string.max': 'CONFIRM_PASSWORD_MAX_255',
    'string.empty': 'CONFIRM_PASSWORD_REQUIRED',
    'any.only': 'CONFIRM_PASSWORD_NOT_MATCH'
  }),
  code: joi.string().required().messages({
    'string.base': 'CODE_MUST_BE_STRING',
    'any.required': 'CODE_REQUIRED',
    'string.empty': 'CODE_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const sendPasswordResetCodeSchema = joi.object({
  email: joi.string().max(255).email().required().messages({
    'string.base': 'EMAIL_MUST_BE_STRING',
    'any.required': 'EMAIL_REQUIRED',
    'string.email': 'EMAIL_INVALID',
    'string.max': 'EMAIL_MAX_255',
    'string.empty': 'EMAIL_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const deleteAccountSchema = joi.object({
  password: joi.string().required().messages({
    'string.base': 'PASSWORD_MUST_BE_STRING',
    'any.required': 'PASSWORD_REQUIRED',
    'string.empty': 'PASSWORD_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const signInWithGoogleSchema = joi.object({
  idToken: joi.string().required().messages({
    'string.base': 'ID_TOKEN_MUST_BE_STRING',
    'any.required': 'ID_TOKEN_REQUIRED',
    'string.empty': 'ID_TOKEN_REQUIRED'
  })
}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const signUp = async (req, res, next) => {
  const { error } = registerUserSchema.validate(req.body)
  const { parentEmail, username } = req.body

  const user = await User.findOne({
    $or: [
      {
        parentEmail
      },
      {
        username
      }
    ]
  })

  if (error) { return res.status(422).json({ error: { message: error.details[0].message } }) }
  if (user) return res.status(422).json({ error: { message: 'EMAIL_OR_USERNAME_ALREADY_EXIST' } })

  next()
}

const signIn = (req, res, next) => {
  const { error } = loginUserSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const verifyEmail = (req, res, next) => {
  const { error } = verifyEmailSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const updatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const resetPassword = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const sendPasswordResetEmail = (req, res, next) => {
  const { error } = sendPasswordResetCodeSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const deleteAccount = (req, res, next) => {
  const { error } = deleteAccountSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

const signInWithGoogle = (req, res, next) => {
  const { error } = signInWithGoogleSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  updatePassword,
  resetPassword,
  sendPasswordResetEmail,
  deleteAccount,
  signInWithGoogle
}
