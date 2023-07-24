const mongoose = require('mongoose')
const { Schema, model } = mongoose

const CheckInPointSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    point: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const CheckInPoint = model('CheckinPoint', CheckInPointSchema)

module.exports = CheckInPoint
