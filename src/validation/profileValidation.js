const joiDate = require('@joi/date')
const joi = require('joi').extend(joiDate)

const updateProfileSchema = joi.object({
  firstName: joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': 'FIRST_NAME_MUST_BE_STRING',
      'string.max': 'FIRST_NAME_MAX_255',
      'string.empty': 'FIRST_NAME_REQUIRED'
    }),
  lastName: joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': 'LAST_NAME_MUST_BE_STRING',
      'string.max': 'LAST_NAME_MAX_255',
      'string.empty': 'LAST_NAME_REQUIRED'
    }),
  birthDate: joi.date()
    .format('YYYY-MM-DD')
    .optional()
    .messages({
      'date.base': 'BIRTH_DATE_INVALID',
      'date.empty': 'BIRTH_DATE_REQUIRED',
      'date.format': 'BIRTH_DATE_INVALID'
    }),
  sex: joi.string()
    .valid('L', 'P')
    .optional().messages({
      'string.base': 'SEX_MUST_BE_STRING',
      'any.only': 'SEX_MUST_BE_L_OR_P',
      'string.empty': 'SEX_REQUIRED'
    }),
  image: joi.string()
    .max(255)
    .optional()
    .messages({
      'string.base': 'IMAGE_MUST_BE_STRING',
      'string.max': 'IMAGE_MAX_255',
      'string.empty': 'IMAGE_REQUIRED'
    }),
  parent: joi.object({
    firstName: joi.string()
      .max(255)
      .required()
      .messages({
        'string.base': 'FIRST_NAME_MUST_BE_STRING',
        'string.max': 'FIRST_NAME_MAX_255',
        'string.empty': 'FIRST_NAME_REQUIRED',
        'any.required': 'FIRST_NAME_REQUIRED'
      }),
    lastName: joi.string()
      .max(255)
      .optional()
      .messages({
        'string.base': 'LAST_NAME_MUST_BE_STRING',
        'string.max': 'LAST_NAME_MAX_255',
        'string.empty': 'LAST_NAME_REQUIRED'
      }),
    birthDate: joi.date()
      .format('YYYY-MM-DD')
      .optional()
      .messages({
        'date.base': 'BIRTH_DATE_INVALID',
        'date.empty': 'BIRTH_DATE_REQUIRED',
        'date.format': 'BIRTH_DATE_INVALID'
      }),
    phoneNumber: joi
      .string()
      .pattern(/^\d{1,32}$/)
      .optional()
      .messages({
        'string.base': 'PHONE_NUMBER_MUST_BE_STRING',
        'string.pattern.base': 'PHONE_NUMBER_INVALID',
        'string.empty': 'PHONE_NUMBER_REQUIRED'
      }),
    relation: joi.string().optional().valid('ayah', 'ibu').messages({
      'string.base': 'RELATION_MUST_BE_STRING',
      'any.only': 'RELATION_MUST_BE_AYAH_OR_IBU',
      'any.required': 'RELATION_REQUIRED',
      'string.empty': 'RELATION_REQUIRED'
    })
  }).optional().messages({
    'object.base': 'PARENT_MUST_BE_OBJECT',
    'object.unknown': 'UNKNOWN_FIELD_FOUND'
  }),
  address: joi.object({
    province: joi.object({
      provinceId: joi.string().required().messages({
        'string.base': 'PROVINCE_ID_MUST_BE_STRING',
        'any.required': 'PROVINCE_ID_REQUIRED',
        'string.empty': 'PROVINCE_ID_REQUIRED'
      }),
      name: joi.string().required().messages({
        'string.base': 'PROVINCE_NAME_MUST_BE_STRING',
        'any.required': 'PROVINCE_NAME_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      })
    }).required().messages({
      'object.base': 'PROVINCE_MUST_BE_OBJECT',
      'object.unknown': 'UNKNOWN_FIELD_FOUND',
      'any.required': 'PROVINCE_REQUIRED'
    }),
    city: joi.object({
      cityId: joi.string().required().messages({
        'string.base': 'CITY_ID_MUST_BE_STRING',
        'any.required': 'CITY_ID_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      }),
      name: joi.string().required().messages({
        'string.base': 'CITY_NAME_MUST_BE_STRING',
        'any.required': 'CITY_NAME_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      })
    }).required().messages({
      'object.base': 'CITY_MUST_BE_OBJECT',
      'object.unknown': 'UNKNOWN_FIELD_FOUND',
      'any.required': 'CITY_REQUIRED'
    }),
    district: joi.object({
      districtId: joi.string().required().messages({
        'string.base': 'DISTRICT_ID_MUST_BE_STRING',
        'any.required': 'DISTRICT_ID_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      }),
      name: joi.string().required().messages({
        'string.base': 'DISTRICT_NAME_MUST_BE_STRING',
        'any.required': 'DISTRICT_NAME_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      })
    }).required().messages({
      'object.base': 'DISTRICT_MUST_BE_OBJECT',
      'object.unknown': 'UNKNOWN_FIELD_FOUND',
      'any.required': 'DISTRICT_REQUIRED'
    }),
    subDistrict: joi.object({
      subDistrictId: joi.string().required().messages({
        'string.base': 'SUB_DISTRICT_ID_MUST_BE_STRING',
        'any.required': 'SUB_DISTRICT_ID_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      }),
      name: joi.string().required().messages({}).required().messages({
        'string.base': 'SUB_DISTRICT_NAME_MUST_BE_STRING',
        'any.required': 'SUB_DISTRICT_NAME_REQUIRED',
        'string.empty': 'PROVINCE_NAME_REQUIRED'
      })
    }).required().messages({
      'object.base': 'SUB_DISTRICT_MUST_BE_OBJECT',
      'object.unknown': 'UNKNOWN_FIELD_FOUND',
      'any.required': 'SUB_DISTRICT_REQUIRED'
    })
  }).messages({
    'object.base': 'ADDRESS_MUST_BE_OBJECT',
    'object.unknown': 'UNKNOWN_FIELD_FOUND'
  })

}).messages({
  'object.unknown': 'UNKNOWN_FIELD_FOUND'
})

const updateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body)
  if (error) {
    return res.status(422).json({
      error: {
        message: error.details[0].message
      }
    })
  }
  next()
}

module.exports = { updateProfile }
