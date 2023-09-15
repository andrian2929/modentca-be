const { Router } = require('express')
const {
  getUser,
  showUser
} = require('../../controllers/admin/userController')

const {
  getCheckInHistory,
  getCheckInConsecutive,
  getCheckInSummary,
  getCheckInStatus
} = require('../../controllers/admin/userCheckInController')

const router = Router()

router.get('/', getUser)
router.get('/:id', showUser)
router.get('/:id/checkin/history', getCheckInHistory)
router.get('/:id/checkin/status', getCheckInStatus)
router.get('/:id/checkin/summary', getCheckInSummary)
router.get('/:id/checkin/consecutive', getCheckInConsecutive)

module.exports = router
