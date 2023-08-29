const { toLocal, getCurrentTime, checkInTime, createDateTime, getInterval } = require('../utils/timeUtils')
const checkinModel = require('../models/Checkin')
const userModel = require('../models/User')
const consecutiveCheckinModel = require('../models/ConsecutiveCheckin')
const pointHistoryModel = require('../models/PointHistory')
const checkInPointModel = require('../models/CheckinPoint')

/**
 * @description Check-in user for tooth brushing.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with check-in data or error message.
 */
const checkIn = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { type } = req.body

    if (!canCheckIn(type)) {
      return res.status(422).json({
        error: {
          message: 'CHECKIN_TIME_NOT_AVAILABLE'
        }
      })
    }

    const isExist = await hasCheckinIn(userId, type)
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
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * @description Get check-in data for a user within the current month.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with check-in data or error message.
 */
const checkInHistory = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { date } = req.query
    let endOfMonth
    let startOfMonth
    if (date) {
      startOfMonth = createDateTime({
        year: date.split('-')[0],
        month: date.split('-')[1]
      }).startOf('month').toJSDate()

      endOfMonth = createDateTime({
        year: date.split('-')[0],
        month: date.split('-')[1]
      }).endOf('month').toJSDate()
    } else {
      const currentTime = getCurrentTime()
      startOfMonth = currentTime.startOf('month').toJSDate()
      endOfMonth = currentTime.endOf('month').toJSDate()
    }

    const checkIn = await checkinModel.find({
      userId,
      checkinAt: {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    }).sort({ checkinAt: -1 })

    if (checkIn.length === 0) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

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
 * @description Get check-in point history of current user within month.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
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
  }).sort({ createdAt: -1 })

  if (checkinPoint.length === 0) {
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
 * @description Get check-in statistic of current user within month.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object with statistic of user check-in or error message.
 */

const checkInStatistic = async (req, res) => {
  //
  const { _id: userId } = req.user
  const { date } = req.query

  try {
    let startDate, endDate
    if (date) {
      const [year, month, day] = date.split('-')
      startDate = createDateTime({ year, month, day }).startOf('week')
      endDate = createDateTime({ year, month, day }).endOf('week')
    } else {
      const currentTime = getCurrentTime()
      startDate = currentTime.startOf('week')
      endDate = currentTime.endOf('week')
    }

    const weekInterval = getInterval(startDate.toJSDate(), endDate.toJSDate())
    const dailyIntervals = weekInterval.splitBy({ days: 1 }).map((d) => d.start)
    const checkInStatus = await Promise.all(dailyIntervals.map((day) => getCheckInStatusByDate(userId, day.toFormat('yyyy-MM-dd'))))

    const newCheckin = checkInStatus.map((item) => {
      return {
        date: item.date,
        completed: item.morning + item.evening
      }
    })

    return res.status(200).json({
      message: 'OK',
      data: newCheckin
    }
    )
  } catch (err) {
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

const getCheckInSummary = async (req, res) => {
  const { _id: userId } = req.user

  try {
    const { month, year } = getCurrentTime()
    const totalPoint = await getTotalPoint(userId)
    const consecutiveCheckInDay = await getConsecutiveCheckInDay(userId)
    const checkInPercentage = await checkInReport(userId, year, month)

    return res.status(200).json({
      message: 'OK',
      data: {
        totalPoint,
        consecutiveCheckInDay,
        checkInPercentage
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * @description Get check-in status e.g. true or false of current user within month.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const getCheckInStatus = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const { date } = req.query
    const currentTime = getCurrentTime()
    if (date) {
      const checkInStatus = await getCheckInStatusByDate(userId, date)
      return res.status(200).json({
        message: 'OK',
        data: checkInStatus
      })
    }

    const firstDayOfMonth = currentTime.startOf('month').toJSDate()
    const lastDayOfMonth = currentTime.endOf('month').toJSDate()
    const monthInterval = getInterval(firstDayOfMonth, lastDayOfMonth)
    const dailyIntervals = monthInterval.splitBy({ days: 1 }).map((d) => d.start)
    const checkInStatus = await Promise.all(dailyIntervals.map((day) => getCheckInStatusByDate(userId, day.toFormat('yyyy-MM-dd'))))

    return res.status(200).json({
      message: 'OK',
      data: checkInStatus
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * Get consecutive check-in data of the current user.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const getConsecutiveCheckin = async (req, res) => {
  try {
    const { _id: userId } = req.user

    const consecutiveCheckin = await consecutiveCheckinModel.findOne({
      userId
    }).lean()

    if (!consecutiveCheckin) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    consecutiveCheckin.lastBreak = consecutiveCheckin.lastBreak ? toLocal(consecutiveCheckin.lastBreak).toISO() : null
    return res.status(200).json({
      message: 'OK',
      data: consecutiveCheckin
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}
/**
 * @description Get total point of user check-in.
 * @param {string} userId User ID.
 * @returns {number} Total point of user check-in.
 */
const getTotalPoint = async (userId) => {
  try {
    const checkinPoint = await checkInPointModel.findOne({
      userId
    })

    return checkinPoint ? checkinPoint.point : 0
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description Check if a check-in exists for the current user and type.
 * @param {string} userId - User ID.
 * @param {string} type - Check-in type ('morning' or 'evening').
 * @returns {boolean} True if a check-in exists, false otherwise.
 */
const hasCheckinIn = async (userId, type) => {
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
 * @description Check if the current time is within the check-in time.
 * @param {string} type - Check-in type ('morning' or 'evening').
 * @returns {boolean} True if the current time is within the check-in time, false otherwise.
 */
const canCheckIn = (type) => {
  const { start, end } = checkInTime(type)
  const currentTime = Date.now()
  return currentTime >= start && currentTime <= end
}

/**
 * @description Get consecutive check-in day of user.
 * @param {string} userId - User ID.
 * @returns {number} Consecutive check-in day of user.
 */
const getConsecutiveCheckInDay = async (userId) => {
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
 * @description Add consecutive check-in day of user by 1.
 * @param {string} userId - User ID.
 * @throws {Error} Error message.
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
        .set({ day: consecutiveCheckin.day + 1 })
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

/**
 * @description Reset consecutive check-in day of user to 0.
 * @param {string} userId - User ID.
 * @throws {Error} Error message.
 */
const resetConsecutiveCheckinDay = async (userId) => {
  try {
    const consecutiveCheckin = await consecutiveCheckinModel.findOne({
      userId
    })

    if (!consecutiveCheckin) {
      await consecutiveCheckinModel.create({
        userId,
        day: 0
      })
    } else {
      if (consecutiveCheckin.consecutiveDayRecord < consecutiveCheckin.day) {
        await consecutiveCheckinModel.updateOne({ userId }, { lastBreak: Date.now(), consecutiveDayRecord: consecutiveCheckin.day })
      }
      await consecutiveCheckinModel.updateOne({ userId }, { lastBreak: Date.now(), day: 0 })
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description Add check-in point of user by 5.
 * @param {string} userId - User ID.
 * @param {number} point - Point to add.
 */
const addCheckInPoint = async (userId, point = 5) => {
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
      const checkInPoint = Math.min(Math.max(checkinPoint.point + point, 0), 1800)
      await checkInPointModel.updateOne({ userId }, { point: checkInPoint })
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description Reduce check-in point of user by 10.
 * @param {string} userId - User ID.
 * @param {number} point - Point to reduce.
 * @throws {Error} Error message.
 */
const reduceCheckInPoint = async (userId, point = 10) => {
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
      const checkInPoint = Math.min(Math.max(checkinPoint.point - point, 0), 1800)
      await checkInPointModel.updateOne({ userId }, { point: checkInPoint })
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description Marks users as not checked-in, updating their point history and consecutive check-in
 * @throws {Error} Error message.
 */
const markAsNotCheckedIn = async () => {
  try {
    const users = await userModel.find()
    for (const user of users) {
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
          point: -5,
          type: 'out'
        })
      }

      if (!eveningCheckin) {
        await reduceCheckInPoint(userId)
        await pointHistoryModel.create({
          userId,
          point: -5,
          type: 'out'
        })
      }

      if (morningCheckin || eveningCheckin) {
        await addConsecutiveCheckinDay(userId)
      } else {
        await resetConsecutiveCheckinDay(userId)
      }
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description Get check-in report of user within the certain month.
 * @param {string} userId - User ID.
 * @param {number} year - Year.
 * @param {number} month - Month.
 * @returns {number} Check-in percentage of user.
 * @throws {Error} Error message.
 */
const checkInReport = async (userId, year, month) => {
  try {
    const dateTime = createDateTime({ year, month })

    const daysInMonth = dateTime.daysInMonth
    const startOfMonth = dateTime.startOf('month').toJSDate()
    const endOfMonth = dateTime.endOf('month').toJSDate()

    const checkInCount = checkinModel.countDocuments({
      userId,
      checkinAt: {
        $gte: startOfMonth,
        $lt: endOfMonth
      },
      type: {
        $in: ['morning', 'evening']
      }
    })
    return Math.floor(((await checkInCount) / 2 / daysInMonth) * 100)
  } catch (err) { throw new Error(err) }
}

/**
 * @description Get check-in report by region within the certain month.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const getCheckInReport = async (req, res) => {
  try {
    const { regionType, regionId, month, year } = req.params

    const regionField = {
      province: 'address.province.provinceId',
      city: 'address.city.cityId',
      district: 'address.district.districtId',
      subdistrict: 'address.subDistrict.subDistrictId'
    }

    const users = await userModel
      .find({
        [regionField[regionType]]: regionId
      })
      .lean()

    if (users.length === 0) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    let sumOfPercentage = 0
    for (const user of users) {
      const checkInPercentage = await checkInReport(user._id, year, month)
      sumOfPercentage += checkInPercentage
    }

    const averageCheckInPercentage = sumOfPercentage / users.length

    return res.status(200).json({
      message: 'OK',
      data: {
        averageCheckInPercentage
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}
const getCheckInStatusByDate = async (userId, date) => {
  try {
    const [year, month, day] = date.split('-')
    const startOfDay = createDateTime({ year, month, day }).startOf('day').toJSDate()
    const endOfDay = createDateTime({ year, month, day }).endOf('day').toJSDate()

    const morningCheckin = await checkinModel.findOne({
      userId,
      checkinAt: { $gte: startOfDay, $lt: endOfDay },
      type: 'morning'
    })

    const eveningCheckin = await checkinModel.findOne({
      userId,
      checkinAt: { $gte: startOfDay, $lt: endOfDay },
      type: 'evening'
    })

    return {
      morning: !!morningCheckin,
      evening: !!eveningCheckin,
      date
    }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  checkIn,
  checkInHistory,
  checkInPointHistory,
  checkInStatistic,
  markAsNotCheckedIn,
  getTotalPoint,
  reduceCheckInPoint,
  getCheckInReport,
  getCheckInStatus,
  getConsecutiveCheckin,
  getCheckInSummary
}
