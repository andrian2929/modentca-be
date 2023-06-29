const { Router } = require('express')
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userProfileController')
const verifyToken = require('../middleware/auth')
const router = Router()

router.get('/', verifyToken, getUserProfile)
router.put('/', verifyToken, updateUserProfile)

module.exports = router
