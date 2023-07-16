const { Router } = require('express')
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userProfileController')
const auth = require('../middleware/auth')
const profileValidation = require('../validation/profileValidation')
const router = Router()

router.get('/', auth.authenticateToken, getUserProfile)
router.put('/', profileValidation.updateProfile, auth.authenticateToken, updateUserProfile)

module.exports = router
