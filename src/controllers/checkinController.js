const { toLocal, getCurrentTime, checkInTime } = require('../utils/timeUtils')
const checkinModel = require('../models/Checkin')
const userModel = require('../models/User')
const consecutiveCheckinModel = require('../models/ConsecutiveCheckin')
const pointHistoryModel = require('../models/PointHistory')
const checkInPointModel = require('../models/CheckinPoint')

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

    const isAllowed = isCheckinAllowed(type)
    if (!isAllowed) {
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

    await addCheckInPoint(userId)

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
    console.log(err)
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
 * Get check-in point history of current user within month
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
 * Get checkin statitic of current user within month
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with statistic of user check-in or error message.
 */

const checkInStatistic = async (req, res) => {
  const { _id: userId } = req.user

  try {
    const totalPoint = await getTotalPoint(userId)
    const consecutiveCheckin = await getConsecutiveCheckiDay(userId)
    const checkinPercentage = await getCheckinReport(userId)

    return res.status(200).json({
      message: 'OK',
      data: {
        totalPoint,
        consecutiveCheckin,
        checkinPercentage
      }
    })
  } catch (err) {
    console.log(err)
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
    const checkinPoint = await checkInPointModel.findOne({
      userId
    })

    console.log(checkinPoint)

    console.log(checkinPoint)
    return checkinPoint ? checkinPoint.point : 0
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
const isCheckinAllowed = (type) => {
  const { start, end } = checkInTime(type)
  const currentTime = Date.now()
  return currentTime >= start && currentTime <= end
}

/**
 * Get consecutive check-in of current user
 *
 * @param {string} userId
 * @returns {number} Consecutive check-in of current user
 */
const getConsecutiveCheckiDay = async (userId) => {
  try {
    const consecutiveCheckin = await consecutiveCheckinModel.findOne({
      userId
    })

    if (!consecutiveCheckin) {
      return 0
    }
    return consecutiveCheckin.day
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Add consecutive check-in of user by 1.
 *
 * @param {string} userId
 */
const addConsecutiveCheckinDay = async (userId) => {
  try {
    const consecutiveCheckin = await consecutiveCheckinModel.findOne({
      userId
    })

    if (!consecutiveCheckin) {
      await consecutiveCheckinModel.create({
        userId,
        day: 1
      })
    } else {
      await consecutiveCheckinModel
        .updateOne({ userId })
        .set({ day: consecutiveCheckin.consecutive + 1 })
    }
  } catch (err) {
    throw new Error(err)
  }
}

const resetConsecutiveCheckinDay = async (userId) => {
  const consecutiveCheckin = await consecutiveCheckinModel.findOne({
    userId
  })

  if (!consecutiveCheckin) {
    await consecutiveCheckinModel.create({
      userId,
      day: 0
    })
  } else {
    await consecutiveCheckinModel.updateOne({ userId }, { day: 0 })
  }
}

/**
 * Add check-in point of user by 5.
 *
 * @param {string} userId
 */
const addCheckInPoint = async (userId) => {
  try {
    const checkinPoint = await checkInPointModel.findOne({
      userId
    })

    if (!checkinPoint) {
      await checkInPointModel.create({
        userId,
        point: 5
      })
    } else {
      const checkInPoint = Math.min(Math.max(checkinPoint.point + 5, 0), 1800)
      await checkInPointModel.updateOne({ userId }, { point: checkInPoint })
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Reduce check-in point of user by 10.
 *
 * @param {string} userId
 */
const reduceCheckInPoint = async (userId) => {
  try {
    const checkinPoint = await checkInPointModel.findOne({
      userId
    })

    if (!checkinPoint) {
      await checkInPointModel.create({
        userId,
        point: 0
      })
    } else {
      const checkInPoint = Math.min(Math.max(checkinPoint.point - 10, 0), 1800)
      await checkInPointModel.updateOne({ userId }, { point: checkInPoint })
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * Marks users as not checked-in, updating their point history and consecutive check-ins.
 */
const markAsNotCheckedIn = async () => {
  try {
    const users = await userModel.find()
    users.forEach(async (user) => {
      const { _id: userId } = user

      const [morningCheckin, eveningCheckin] = await Promise.all([
        checkinModel.findOne({
          userId,
          type: 'morning',
          checkinAt: {
            $gte: checkInTime('morning').start,
            $lt: checkInTime('morning').end
          }
        }),
        checkinModel.findOne({
          userId,
          type: 'evening',
          checkinAt: {
            $gte: checkInTime('evening').start,
            $lt: checkInTime('evening').end
          }
        })
      ])

      if (!morningCheckin) {
        await reduceCheckInPoint(userId)
        await pointHistoryModel.create({
          userId,
          point: -10,
          type: 'out'
        })
      }

      if (!eveningCheckin) {
        await reduceCheckInPoint(userId)
        await pointHistoryModel.create({
          userId,
          point: -10,
          type: 'out'
        })
      }

      if (morningCheckin || eveningCheckin) {
        await addConsecutiveCheckinDay(userId)
      } else {
        await resetConsecutiveCheckinDay(userId)
      }
    })
  } catch (err) {
    throw new Error(err)
  }
}

const getCheckinReport = async (userId) => {
  try {
    const currentTime = getCurrentTime()
    const daysInMonth = currentTime.daysInMonth
    const startOfMonth = currentTime.startOf('month').toJSDate()
    const endOfMonth = currentTime.endOf('month').toJSDate()

    const checkIn = checkinModel.countDocuments({
      userId,
      checkinAt: {
        $gte: startOfMonth,
        $lt: endOfMonth
      },
      type: {
        $in: ['morning', 'evening']
      }
    })
    return Math.floor(((await checkIn / 2) / daysInMonth) * 100)
  } catch (err) { throw new Error(err) }
}

module.exports = { checkIn, checkInHistory, checkInPointHistory, checkInStatistic, markAsNotCheckedIn }
