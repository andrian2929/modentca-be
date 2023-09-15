const { Router } = require('express')
const {
  getCheckInConsecutive,
  getCheckInSummary,
  getCheckInStatus,
  getCheckInHistory
} = require('../../controllers/admin/userCheckInController')

const router = Router()

router.get('/status', getCheckInStatus)
router.get('/summary', getCheckInSummary)
router.get('/history', getCheckInHistory)
router.get('/consecutive', getCheckInConsecutive)

module.exports = router
