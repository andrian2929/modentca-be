const mongoose = require('mongoose')
const { Schema, model } = mongoose

const CheckinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    checkinAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['morning', 'evening'] }
  },
  { timestamps: true, versionKey: false }
)

const Checkin = model('Checkin', CheckinSchema)

module.exports = Checkin
