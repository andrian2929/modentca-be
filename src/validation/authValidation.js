const Joi = require("joi");
const JoiDate = require("@joi/date");

const joi = Joi.extend(JoiDate);

const registerUserSchema = Joi.object({
  firstName: joi.string().max(255).required().messages({
    "any.required": "FIRST_NAME_REQUIRED",
    "string.base": "FIRST_NAME_MUST_BE_STRING",
    "string.max": "FIRST_NAME_MAX_255",
    "string.empty": "FIRST_NAME_REQUIRED",
  }),
  lastName: joi.string().max(255).optional().messages({
    "string.base": "LAST_NAME_MUST_BE_STRING",
    "string.max": "LAST_NAME_MAX_255",
    "string.empty": "LAST_NAME_REQUIRED",
  }),
  parentEmail: joi.string().max(255).email().required().messages({
    "string.base": "PARENT_EMAIL_MUST_BE_STRING",
    "any.required": "PARENT_EMAIL_REQUIRED",
    "string.email": "PARENT_EMAIL_INVALID",
    "string.max": "PARENT_EMAIL_MAX_255",
    "string.empty": "PARENT_EMAIL_REQUIRED",
  }),
  password: joi.string().min(8).max(255).required().messages({
    "string.base": "PASSWORD_MUST_BE_STRING",
    "any.required": "PASSWORD_REQUIRED",
    "string.min": "PASSWORD_MIN_8",
    "string.max": "PASSWORD_MAX_255",
    "string.empty": "PASSWORD_REQUIRED",
  }),
  birthDate: joi.date().format("YYYY-MM-DD").required().messages({
    "any.required": "BIRTH_DATE_REQUIRED",
    "date.base": "BIRTH_DATE_INVALID",
    "date.empty": "BIRTH_DATE_REQUIRED",
    "date.format": "BIRTH_DATE_INVALID",
  }),
  sex: joi.string().valid("L", "P").required().messages({
    "string.base": "SEX_MUST_BE_STRING",
    "any.only": "SEX_INVALID",
    "any.required": "SEX_REQUIRED",
    "string.empty": "EMAIL_REQUIRED",
  }),
  parent: joi
    .object({
      firstName: joi.string().max(255).required().messages({
        "any.required": "FIRST_NAME_REQUIRED",
        "string.base": "FIRST_NAME_MUST_BE_STRING",
        "string.max": "FIRST_NAME_MAX_255",
        "string.empty": "FIRST_NAME_REQUIRED",
      }),
      lastName: joi.string().max(255).optional().messages({
        "string.base": "LAST_NAME_MUST_BE_STRING",
        "string.max": "LAST_NAME_MAX_255",
        "string.empty": "LAST_NAME_REQUIRED",
      }),
      birthDate: joi.date().format("YYYY-MM-DD").optional().messages({
        "date.base": "BIRTH_DATE_INVALID",
        "date.empty": "BIRTH_DATE_REQUIRED",
        "date.format": "BIRTH_DATE_INVALID",
      }),
      phoneNumber: joi
        .string()
        .pattern(/^\d{1,32}$/)
        .optional()
        .messages({
          "string.base": "PHONE_NUMBER_MUST_BE_STRING",
          "string.pattern.base": "PHONE_NUMBER_INVALID",
          "string.empty": "PHONE_NUMBER_REQUIRED",
        }),
      relation: joi.string().valid("ayah", "ibu").required().messages({
        "string.base": "RELATION_MUST_BE_STRING",
        "any.only": "RELATION_INVALID",
        "any.required": "RELATION_REQUIRED",
        "string.empty": "RELATION_REQUIRED",
      }),
    })
    .optional()
    .messages({
      "object.unknown": "UNKNOWN_FIELD_FOUND",
    }),
}).messages({
  "object.unknown": "UNKNOWN_FIELD_FOUND",
});

const loginUserSchema = Joi.object({
  email: joi.string().max(255).email().required().messages({
    "string.base": "EMAIL_MUST_BE_STRING",
    "any.required": "EMAIL_REQUIRED",
    "string.email": "EMAIL_INVALID",
    "string.max": "EMAIL_MAX_255",
    "string.empty": "EMAIL_REQUIRED",
  }),
  password: joi.string().required().messages({
    "string.base": "PASSWORD_MUST_BE_STRING",
    "any.required": "PASSWORD_REQUIRED",
    "string.empty": "PASSWORD_REQUIRED",
  }),
}).messages({
  "object.unknown": "UNKNOWN_FIELD_FOUND",
});

const verifyEmailSchema = Joi.object({
  email: joi.string().max(255).email().required().messages({
    "string.base": "EMAIL_MUST_BE_STRING",
    "any.required": "EMAIL_REQUIRED",
    "string.email": "EMAIL_INVALID",
    "string.max": "EMAIL_MAX_255",
    "string.empty": "EMAIL_REQUIRED",
  }),
}).messages({
  "object.unknown": "UNKNOWN_FIELD_FOUND",
});

const updatePasswordSchema = Joi.object({
  currentPassword: joi.string().required().messages({
    "string.base": "CURRENT_PASSWORD_MUST_BE_STRING",
    "any.required": "CURRENT_PASSWORD_REQUIRED",
    "string.empty": "CURRENT_PASSWORD_REQUIRED",
  }),
  newPassword: joi.string().max(255).required().messages({
    "string.base": "NEW_PASSWORD_MUST_BE_STRING",
    "any.required": "NEW_PASSWORD_REQUIRED",
    "string.max": "NEW_PASSWORD_MAX_255",
    "string.empty": "NEW_PASSWORD_REQUIRED",
  }),
}).messages({});

const forgotPasswordSchema = Joi.object({
  email: joi.string().max(255).email().required().messages({
    "string.base": "EMAIL_MUST_BE_STRING",
    "any.required": "EMAIL_REQUIRED",
    "string.email": "EMAIL_INVALID",
    "string.max": "EMAIL_MAX_255",
    "string.empty": "EMAIL_REQUIRED",
  }),
}).messages({
  "object.unknown": "UNKNOWN_FIELD_FOUND",
});

const signInWithGoogleSchema = Joi.object({
  idToken: joi.string().required().messages({
    "string.base": "ID_TOKEN_MUST_BE_STRING",
    "any.required": "ID_TOKEN_REQUIRED",
    "string.empty": "ID_TOKEN_REQUIRED",
  }),
}).messages({
  "object.unknown": "UNKNOWN_FIELD_FOUND",
});

const authValidation = {
  signUp: (data) => registerUserSchema.validate(data),
  signIn: (data) => loginUserSchema.validate(data),
  verifyEmail: (data) => verifyEmailSchema.validate(data),
  updatePassword: (data) => updatePasswordSchema.validate(data),
  forgotPassword: (data) => forgotPasswordSchema.validate(data),
  signInWithGoogle: (data) => signInWithGoogleSchema.validate(data),
};

module.exports = authValidation;
