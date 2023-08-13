const { Schema, model } = require('mongoose')

const DentalTrackerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  photo: {
    type: Schema.Types.Mixed,
    required: true
  }
},
{
  timestamps: true,
  versionKey: false
})

const DentalTracker = model('DentalTracker', DentalTrackerSchema)
module.exports = DentalTracker
