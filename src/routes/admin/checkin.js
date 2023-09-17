const { Router } = require('express')

const {
  getCheckInLeaderboard
} = require('../../controllers/admin/userCheckInController')

const router = Router()

router.get('/checkin/leaderboard', getCheckInLeaderboard)

module.exports = router
