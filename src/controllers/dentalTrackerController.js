const dentalTrackerModel = require('../models/DentalTracker')
const { toLocal } = require('../utils/timeUtils')

const getDentalTracker = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const dentalTracker = await dentalTrackerModel.find({ userId }).sort({ createdAt: -1 }).lean()
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
      data: dentalTracker.map((data) => responseFormatter(data))
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
      data: responseFormatter(dentalTracker)
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

const responseFormatter = (data) => {
  return {
    id: data._id,
    userId: data.userId,
    photo: data.photo,
    createdAt: toLocal(data.createdAt),
    updatedAt: toLocal(data.updatedAt)
  }
}
module.exports = { getDentalTracker, storeDentalTracker }
