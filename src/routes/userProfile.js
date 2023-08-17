const { Router } = require('express')
const userProfileController = require('../controllers/userProfileController')
const uploadProfilePicture = require('../middleware/upload/profilePicture')
const auth = require('../middleware/auth')
const profileValidation = require('../validation/profileValidation')
const router = Router()

router.put('/photo', auth.authenticateToken, uploadProfilePicture, userProfileController.uploadProfilePhoto)
router.get('/', auth.authenticateToken, userProfileController.getUserProfile)
router.put('/', auth.authenticateToken, profileValidation.updateProfile, userProfileController.updateUserProfile)

module.exports = router
