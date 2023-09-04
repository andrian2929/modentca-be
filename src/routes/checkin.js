const { Router } = require('express')
const router = Router()

const auth = require('../middleware/auth')
const checkInvalidation = require('../validation/checkinValidation')

const {
  checkIn,
  checkInHistory,
  checkInPointHistory,
  checkInStatistic,
  getCheckInReport,
  getCheckInStatus,
  getConsecutiveCheckin,
  getCheckInSummary,
  getCheckInLeaderboard
} = require('../controllers/checkinController')

router.get('/report/:regionType/:regionId/:year/:month', checkInvalidation.getCheckInReport, getCheckInReport)
router.post('/', auth.authenticateToken, checkInvalidation.checkIn, checkIn)
router.get('/history', auth.authenticateToken, checkInvalidation.getCheckInHistory, checkInHistory)
router.get('/point-history', auth.authenticateToken, checkInPointHistory)
router.get('/statistic', auth.authenticateToken, checkInStatistic)
router.get('/status', auth.authenticateToken, checkInvalidation.getCheckInStatus, getCheckInStatus)
router.get('/consecutive', auth.authenticateToken, getConsecutiveCheckin)
router.get('/summary', auth.authenticateToken, getCheckInSummary)
router.get('/leaderboard', auth.authenticateToken, getCheckInLeaderboard)

module.exports = router
