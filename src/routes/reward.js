const { Router } = require('express')
const {
  getReward,
  storeReward,
  updateReward,
  deleteReward,
  showReward,
  redeemReward,
  redemptionHistory
} = require('../controllers/rewardController')
const { authenticateToken } = require('../middleware/auth')
const rewardValidation = require('../validation/rewardValidation')
const rewardPhotoUpload = require('../middleware/upload/rewardPhoto')

const router = Router()

router.get('/', authenticateToken, getReward)
router.get('/redemption-history', authenticateToken, redemptionHistory)
router.get('/:id', authenticateToken, showReward)
router.post('/', authenticateToken, rewardPhotoUpload, rewardValidation.storeReward, storeReward)
router.put('/:id', authenticateToken, rewardPhotoUpload, rewardValidation.updateReward, updateReward)
router.delete('/:id', authenticateToken, deleteReward)
router.post('/:id/redeem', authenticateToken, redeemReward)

module.exports = router
