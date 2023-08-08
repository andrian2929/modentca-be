const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema, model } = mongoose

const SALT_ROUNDS = 10

const provinceSchema = {
  provinceId: { type: String, default: null },
  name: { type: String, default: null }
}

const citySchema = {
  cityId: { type: String, default: null },
  name: { type: String, default: null }
}

const districtSchema = {
  districtId: { type: String, default: null },
  name: { type: String, default: null }
}

const subDistrictSchema = new Schema({
  subDistrictId: { type: String, default: null },
  name: { type: String, default: null }
})

const addressSchema = new Schema({
  province: { type: provinceSchema, required: true },
  city: { type: citySchema, required: true },
  district: { type: districtSchema, required: true },
  subDistrict: { type: subDistrictSchema, required: true }
})

const ParentSchema = new Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  relation: { type: String, enum: ['ayah', 'ibu', null], default: null },
  birthDate: { type: Date, default: null },
  phoneNumber: { type: String, default: null }
})

const UserSchema = new Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    parentEmail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, default: null },
    image: { type: Schema.Types.Mixed, default: null },
    sex: { type: String, enum: ['L', 'P', null], default: null },
    role: {
      type: String,
      enum: ['user', 'health_care', 'email'],
      default: 'user'
    },
    emailVerifiedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    parent: {
      type: ParentSchema,
      default: null
    },
    address: {
      type: addressSchema,
      default: null
    }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.pre('save', async function (next) {
  const user = this
  try {
    if (!user.isModified('password')) return next()
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    user.password = await bcrypt.hash(user.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  const user = this

  try {
    // noinspection JSUnresolvedVariable
    if (!user._update.password) return next()
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    // noinspection JSUnresolvedVariable
    user._update.password = await bcrypt.hash(user._update.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

const User = model('User', UserSchema)
module.exports = User
