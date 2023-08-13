const { Schema, model } = require('mongoose')

const EkagiSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: null
    },
    type: {
      type: String,
      enum: ['video', 'article']
    },
    thumbnail: {
      type: Schema.Types.Mixed,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  }, {
    timestamps: true,
    versionKey: false
  }
)

const Ekagi = model('Ekagi', EkagiSchema)

module.exports = Ekagi
