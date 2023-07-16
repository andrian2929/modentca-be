const { Schema, model } = require('mongoose')

const CheckinSchema = new Schema(
  {
    checkinAt: { type: Date },
    type: { type: String }
  },
  { _id: false }
)

const PointHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    point: { type: Number },
    type: { type: String, enum: ['in', 'out', 'redeem'] },
    checkin: CheckinSchema
  }, {
    timestamps: true,
    versionKey: false
  }
)

const PointHistory = model('PointHistory', PointHistorySchema)

module.exports = PointHistory
