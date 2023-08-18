const mongoose = require('mongoose')
const { Schema, model } = mongoose

const ConsecutiveCheckinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    day: { type: Number },
    lastBreak: { type: Date, default: null },
    consecutiveDayRecord: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const ConsecutiveCheckin = model('ConsecutiveCheckin', ConsecutiveCheckinSchema)

module.exports = ConsecutiveCheckin
