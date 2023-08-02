const { Router } = require('express')
const {
  getReward,
  storeReward,
  updateReward,
  deleteReward,
  showReward,
  redeemReward,
  redemtionHistory
} = require('../controllers/rewardController')
const { authenticateToken } = require('../middleware/auth')
const rewardValidation = require('../validation/rewardValidation')

const router = Router()

router.get('/', authenticateToken, getReward)
router.get('/redemption-history', authenticateToken, redemtionHistory)
router.get('/:id', authenticateToken, showReward)
router.post('/', authenticateToken, rewardValidation.storeReward, storeReward)
router.put('/:id', authenticateToken, rewardValidation.updateReward, updateReward)
router.delete('/:id', authenticateToken, deleteReward)
router.post('/:id/redeem', authenticateToken, redeemReward)

module.exports = router
