const mongoose = require('mongoose')
const { Schema, model } = mongoose

const RedemptionHistorySchema = new Schema(
  {
    reward: { type: Schema.Types.ObjectId, ref: 'Reward' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, versionKey: false }
)

const RedemptionHistory = model('RedemptionHistory', RedemptionHistorySchema)

module.exports = RedemptionHistory
