const { Router } = require('express')
const router = Router()

const auth = require('../middleware/auth')
const checkInvalidation = require('../validation/checkinValidation')

const {
  checkIn,
  checkInHistory,
  checkInPointHistory,
  checkInStatistic
} = require('../controllers/checkinController')

router.post('/', checkInvalidation.checkIn, auth.authenticateToken, checkIn)
router.get('/history', auth.authenticateToken, checkInHistory)
router.get('/point-history', auth.authenticateToken, checkInPointHistory)
router.get('/statistic', auth.authenticateToken, checkInStatistic)

module.exports = router
