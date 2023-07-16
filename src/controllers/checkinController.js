const { toLocal, getCurrentTime, checkInTime } = require('../utils/timeUtils')
const checkinModel = require('../models/Checkin')
const pointHistoryModel = require('../models/PointHistory')

/**
 * Check-in user for toothbrushing.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with check-in data or error message.
 */
const checkIn = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { type } = req.body

    const isAvailable = isCheckinTimeAvailable(type)
    if (!isAvailable) {
      return res.status(422).json({
        error: {
          message: 'CHECKIN_TIME_NOT_AVAILABLE'
        }
      })
    }

    const isExist = await isExistCheckin(userId, type)
    if (isExist) {
      return res.status(422).json({
        error: {
          message: 'ALREADY_CHECKED_IN'
        }
      })
    }

    const checkin = await checkinModel.create({
      userId,
      type
    })

    await pointHistoryModel.create({
      checkin: {
        checkinAt: toLocal(checkin.checkinAt).toISO(),
        type: checkin.type
      },
      userId,
      point: 5,
      type: 'in'
    })

    const checkinAt = toLocal(checkin.checkinAt).toISO()
    const createdAt = toLocal(checkin.createdAt).toISO()
    const updatedAt = toLocal(checkin.updatedAt).toISO()

    return res.status(201).json({
      message: 'OK',
      data: {
        ...checkin.toObject(),
        checkinAt,
        createdAt,
        updatedAt
      }
    })
  } catch (err) {
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * Get check-in data for a user within the current month.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with check-in data or error message.
 */
const checkInHistory = async (req, res) => {
  try {
    const { _id: userId } = req.user

    const currentTime = getCurrentTime()
    const startOfMonth = currentTime.startOf('month').toJSDate()
    const endOfMonth = currentTime.endOf('month').toJSDate()

    const checkIn = await checkinModel.find({
      userId,
      checkinAt: {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    }).sort({ checkinAt: 'asc' })

    const checkInData = checkIn.map((item) => {
      const checkinAt = toLocal(item.checkinAt).toISO()
      const createdAt = toLocal(item.createdAt).toISO()
      const updatedAt = toLocal(item.updatedAt).toISO()

      return {
        ...item.toObject(),
        checkinAt,
        createdAt,
        updatedAt
      }
    })
    return res.status(200).json({
      message: 'OK',
      data: checkInData
    })
  } catch (err) {
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * Get check-in point history for a user within the current month.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res -
 * @returns {Object} Response object with check-in point history or error message.
 */
const checkInPointHistory = async (req, res) => {
  const { _id: userId } = req.user
  const currentTime = getCurrentTime()

  const startOfMonth = currentTime.startOf('month').toJSDate()
  const endOfMonth = currentTime.endOf('month').toJSDate()

  const checkinPoint = await pointHistoryModel.find({
    userId,
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth
    }
  }).sort({ createdAt: 'asc' })

  if (!checkinPoint) {
    return res.status(404).json({
      error: {
        message: 'NOT_FOUND'
      }
    })
  }

  const checkinPointData = checkinPoint.map((item) => {
    const createdAt = toLocal(item.createdAt).toISO()
    const updatedAt = toLocal(item.updatedAt).toISO()

    if (item.checkin) {
      const checkinAt = toLocal(item.checkin.checkinAt).toISO()
      return {
        ...item.toObject(),
        checkin: {
          ...item.checkin.toObject(),
          checkinAt
        },
        createdAt,
        updatedAt
      }
    }

    return {
      ...item.toObject(),
      createdAt,
      updatedAt
    }
  })

  return res.status(200).json({
    message: 'OK',
    data: checkinPointData
  })
}

/**
 * Get statistic of user check-in.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with statistic of user check-in or error message.
 */

const checkInStatistic = async (req, res) => {
  const { _id: userId } = req.user

  try {
    const totalPoint = await getTotalPoint(userId)

    return res.status(200).json({
      message: 'OK',
      data: {
        totalPoint
      }
    })
  } catch (err) {
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * Get total point of user check-in.
 *
 * @param {string} userId User ID.
 * @returns {number} Total point of user check-in.
 */
const getTotalPoint = async (userId) => {
  try {
    const total = await pointHistoryModel.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $group: {
          _id: '$userId',
          totalPoint: { $sum: '$point' }
        }
      }
    ])

    if (total.length === 0) {
      return 0
    }
    if (total[0].totalPoint < 0) {
      return 0
    }

    if (total[0].totalPoint > 1800) {
      return 1800
    }
    return total[0].totalPoint
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Check if a check-in record already exists for the user and type.
 *
 * @param {string} userId - User ID.
 * @param {string} type - Check-in type ('morning' or 'evening').
 * @returns {boolean} True if a check-in exists, false otherwise.
 */
const isExistCheckin = async (userId, type) => {
  const { start, end } = checkInTime(type)
  const checkin = await checkinModel.findOne({
    userId,
    type,
    checkinAt: {
      $gte: start,
      $lt: end
    }
  })
  return !!checkin
}

/**
 * Check if the current time is within the check-in time.
 *
 * @param {string} type - Check-in type ('morning' or 'evening').
 * @returns {boolean} True if the current time is within the check-in time, false otherwise.
 */
const isCheckinTimeAvailable = (type) => {
  const { start, end } = checkInTime(type)
  const currentTime = Date.now()
  return currentTime >= start && currentTime <= end
}

module.exports = { checkIn, checkInHistory, checkInPointHistory, checkInStatistic }
