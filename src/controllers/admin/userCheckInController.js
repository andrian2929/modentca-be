const {
  getCheckInStatus: checkInStatus,
  checkInHistory,
  getConsecutiveCheckin: checkInConsecutive,
  getCheckInSummary: checkInSummary
} = require('../../controllers/checkinController')

/**
 * Retrieves the check-in history for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise} A promise that resolves with the check-in history.
 */
const getCheckInHistory = async (req, res) => {
  req.user._id = req.params.id
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
  req.user._id = req.params.id
  await checkInStatus(req, res)
}

const getCheckInConsecutive = async (req, res) => {
  req.user._id = req.params.id
  await checkInConsecutive(req, res)
}

const getCheckInSummary = async (req, res) => {
  req.user._id = req.params.id
  await checkInSummary(req, res)
}

module.exports = {
  getCheckInHistory,
  getCheckInStatus,
  getCheckInConsecutive,
  getCheckInSummary
}
