const { Router } = require('express')

const {
  getCheckInLeaderboard,
  checkIn
} = require('../../controllers/admin/userCheckInController')

const { createAdminCheckIn: adminCheckInValidation } = require('../../validation/checkinValidation')

const router = Router()

router.get('/checkin/leaderboard', getCheckInLeaderboard)
router.post('/checkin', adminCheckInValidation, checkIn)

module.exports = router
