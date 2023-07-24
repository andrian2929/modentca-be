const mongoose = require('mongoose')
const { Schema, model } = mongoose
// const DateTime = require('../config/time')
// const morningStart = DateTime.now().set({
//   hour: 8,
//   minute: 0,
//   second: 0,
//   millisecond: 0
// })

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
