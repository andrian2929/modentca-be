const admin = require('../config/firebase/firebase-admin')
const userModel = require('../models/User')
const firebaseAuthErrorCodes = require('../utils/firebaseAuthErrorCodes')

/**
 * Middleware function to verify the authorization token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Object} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const verifyToken = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) { return res.status(401).json({ error: { message: 'UNAUTHORIZED' } }) }

  try {
    const token = req.headers.authorization.split('Bearer ')[1]
    const decoded = await admin.auth().verifyIdToken(token)
    const user = await userModel.findOne({ parentEmail: decoded.email }).lean()
    if (!user) { return res.status(401).json({ error: { message: 'UNAUTHORIZED' } }) }
    req.user = user
    next()
  } catch (err) {
    const { errorMessage, statusCode } = firebaseAuthErrorCodes(err)
    return res.status(statusCode).json({ error: { message: errorMessage } })
  }
}

module.exports = verifyToken
