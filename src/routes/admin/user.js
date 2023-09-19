const { Router } = require('express')
const {
  getUser,
  showUser,
  updateUser
} = require('../../controllers/admin/userController')

const validation = require('../../validation/profileValidation')

const {
  getCheckInHistory,
  getCheckInConsecutive,
  getCheckInSummary,
  getCheckInStatus
} = require('../../controllers/admin/userCheckInController')

const router = Router()

router.get('/', getUser)
router.get('/:id', showUser)
router.put('/:id', async (req, res, next) => {
  req.user = {
    _id: req.params.id
  }
  next()
}, validation.updateProfile, updateUser)
router.get('/:id/checkin/history', getCheckInHistory)
router.get('/:id/checkin/status', getCheckInStatus)
router.get('/:id/checkin/summary', getCheckInSummary)
router.get('/:id/checkin/consecutive', getCheckInConsecutive)
module.exports = router
