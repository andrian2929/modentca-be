const { Router } = require('express')
const authValidation = require('../validation/authValidation')
const { authenticateLogin, authenticateToken } = require('../middleware/auth')
require('../config/passport')

const {
  signIn,
  signUp,
  signInWithGoogle,
  getMe,
  sendEmailVerification,
  verifyEmail,
  sendPasswordResetCode,
  resetPassword,
  changePassword,
  deleteAccount
} = require('../controllers/authController')

const router = Router()

router.post('/sign-up', authValidation.signUp, signUp)
router.post('/sign-in-with-google', signInWithGoogle)
router.post('/sign-in', authValidation.signIn, authenticateLogin, signIn)
router.post('/send-email-verification', sendEmailVerification)
router.post('/verify-email/:code', verifyEmail)
router.delete('/delete-account', authValidation.deleteAccount, authenticateToken, deleteAccount)
router.post('/send-password-reset', sendPasswordResetCode)
router.put('/reset-password', resetPassword)
router.put('/change-password', authValidation.updatePassword, authenticateToken, changePassword)
router.get('/me', authenticateToken, getMe)

module.exports = router
