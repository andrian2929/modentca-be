const dentalTrackerModel = require('../models/DentalTracker')

const getDentalTracker = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const dentalTracker = await dentalTrackerModel.find({ userId }).sort({ date: -1 }).lean()
    if (dentalTracker.length === 0) {
      res.status(404).json({
        error:
          {
            message: 'NOT_FOUND'
          }
      })
    }
    res.status(200).json({
      message: 'OK',
      data: dentalTracker
    })
  } catch (err) {
    console.error(err)
  }
}

const storeDentalTracker = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { public_id: publicId, secure_url: url } = req.uploadResult

    const dentalTracker = await dentalTrackerModel.create({
      userId,
      photo: {
        publicId,
        url
      }
    })

    res.status(201).json({
      message: 'CREATED',
      data: dentalTracker
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}
module.exports = { getDentalTracker, storeDentalTracker }
