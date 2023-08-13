const { Schema, model } = require('mongoose')

const CariogramHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    def: {
      type: Number, required: true
    },
    result: {
      type: String, required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const CariogramHistory = model('CariogramHistory', CariogramHistorySchema)

module.exports = CariogramHistory
