const {
  getCheckInStatus: checkInStatus,
  checkInHistory,
  getConsecutiveCheckin: checkInConsecutive,
  getCheckInSummary: checkInSummary,
  getCheckInLeaderboard: checkInLeaderboard
} = require('../../controllers/checkinController')

const {
  toUTC,
  checkInTime,
  toLocalFromIso, getCurrentTime, toLocal, createDateTime
} = require('../../utils/timeUtils')

const checkInModel = require('../../models/Checkin')

/**
 * Retrieves the check-in history for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the check-in history.
 */
const getCheckInHistory = async (req, res) => {
  req.user = { _id: req.params.id }
  await checkInHistory(req, res)
}

/**
 * Retrieves the check-in status for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the check-in status.
 */
const getCheckInStatus = async (req, res) => {
  req.user = { _id: req.params.id }

  await checkInStatus(req, res)
}

const getCheckInConsecutive = async (req, res) => {
  req.user = { _id: req.params.id }
  await checkInConsecutive(req, res)
}

const getCheckInSummary = async (req, res) => {
  req.user = { _id: req.params.id }
  await checkInSummary(req, res)
}

const getCheckInLeaderboard = async (req, res) => {
  await checkInLeaderboard(req, res)
}
const checkIn = async (req, res) => {
  try {
    const { userId, type, date } = req.body
    const checkinExists = await hasCheckIn(userId, type, date)
    if (checkinExists) {
      return res.status(422).json({
        error: {
          message: 'ALREADY_CHECKED_IN'
        }
      })
    }

    const checkin = await checkInModel.create({
      userId,
      type,
      checkinAt: getCheckInTime(type, date)
    })

    return res.status(201).json({
      message: 'OK',
      data: checkin
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

const hasCheckIn = async (userId, type, date) => {
  try {
    date = toLocalFromIso(date)
    const { start, end } = checkInTime(type, date)

    const checkin = await checkInModel.findOne({
      userId,
      type,
      checkinAt: {
        $gte: start,
        $lt: end
      }
    })
    return !!checkin
  } catch (err) {
    throw new Error(err)
  }
}

const getCheckInTime = (type, date) => {
  if (type === 'morning') {
    const randomHours = Math.floor(Math.random() * (12 - 8) + 8)
    return toLocalFromIso(date).set({
      hour: randomHours
    })
  }

  if (type === 'evening') {
    const randomHours = Math.floor(Math.random() * (23 - 16) + 16)
    return toLocalFromIso(date).set({
      hour: randomHours
    }).toJSDate()
  }
}

module.exports = {
  getCheckInHistory,
  getCheckInStatus,
  getCheckInConsecutive,
  getCheckInSummary,
  getCheckInLeaderboard,
  checkIn

}
