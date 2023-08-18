const mongoose = require('mongoose')
const { Schema, model } = mongoose

const RewardSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    point: { type: Number, required: true },
    photo: { type: Schema.Types.Mixed, default: null },
    stock: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
)

const Reward = model('Reward', RewardSchema)

module.exports = Reward
