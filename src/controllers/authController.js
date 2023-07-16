const UserModel = require('../models/User')
const env = require('../config/env')
const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis')
const bcrypt = require('bcrypt')
const {
  sendEmailVerification: sendEmailVerificationUtil,
  sendPasswordResetCode: sendPasswordResetCodeUtil
} = require('../utils/emailUtils')
const User = require('../models/User')

/**
 * Sign up new user
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response containing the created user data or an error message.
 */
const signUp = async (req, res) => {
  const { parentEmail: email, password } = req.body
  try {
    const newUser = new UserModel({
      parentEmail: email,
      password
    })

    await newUser.save()
    const user = await UserModel.findOne({ parentEmail: email }).select('-password').lean()

    res.status(201).json({ message: 'CREATED', data: user })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Sign in a user and generate an access token with its expiration time.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - The response containing the access token and its expiration time or an error message.
 */
const signIn = async (req, res) => {
  try {
    const { user } = req.user
    const { _id, role } = user
    const accessToken = jwt.sign({ _id, role }, env.JWT_SECRET, { expiresIn: '7d' })
    const expirationTime = Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000)
    return res.status(200).json({ message: 'OK', data: { accessToken, expirationTime } })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Get the current authenticated user's data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express reponse object
 * @returns {Object} - The response containing the current authenticated user's data or an error message.
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user)
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Sends email verification.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body
    const user = await UserModel.findOne({ parentEmail: email })
    if (user.emailVerifiedAt) return res.status(400).json({ error: { message: 'EMAIL_ALREADY_VERIFIED' } })
    const info = await sendEmailVerificationUtil(email)
    if (info.accepted.length) return res.status(200).json({ message: 'OK' })
  } catch (err) {
    return res.status(500).json({ error: { message: 'EMAIL_NOT_SEND' } })
  }
}

/**
 * Verifies email based on the provided code.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const verifyEmail = async (req, res) => {
  try {
    const code = req.params.code
    const email = await redisClient.get(code)
    if (!email) return res.status(400).json({ error: { message: 'INVALID_CODE' } })
    const updatedUser = await UserModel.findOneAndUpdate({ parentEmail: email }, { emailVerifiedAt: Date.now() }, { new: true })
    if (!updatedUser) return res.status(404).json({ error: { message: 'NOT_FOUND' } })
    await redisClient.del(code)
    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    return res.status(500).json({ error: { message: 'INTERNAL_SERVER_ERROR' } })
  }
}

/**
 * Sends password reset code.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const sendPasswordResetCode = async (req, res) => {
  try {
    const { email } = req.body
    const user = await UserModel.findOne({ parentEmail: email })

    if (user) await sendPasswordResetCodeUtil(email)

    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: { message: 'INTERNAL_SERVER_ERROR' } })
  }
}

/**
 * Resets the user's password based on the provided code and new password.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const resetPassword = async (req, res) => {
  try {
    const { newPassword, code } = req.body
    const email = await redisClient.get(code)

    if (!email) return res.status(400).json({ error: { message: 'INVALID_CODE' } })

    const updatedUser = await UserModel.findOneAndUpdate(
      { parentEmail: email },
      { password: newPassword })

    if (!updatedUser) return res.status(404).json({ error: { message: 'NOT_FOUND' } })
    await redisClient.del(code)
    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    return res.status(500).json({ error: { message: 'INTERNAL_SERVER_ERROR' } })
  }
}

/**
 * Deletes the user's account.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const deleteAccount = async (req, res) => {
  try {
    const { _id } = req.user
    const { password } = req.body

    const user = await User.findOne({ _id })
    if (!user) return res.status(404).json({ error: { message: 'NOT_FOUND' } })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: { message: 'PASSWORD_NOT_MATCH' } })

    await User.findByIdAndDelete(_id)
    return res.status(200).json({ message: 'OK' })
  } catch (err) {
    return res.status(500).json({ error: { message: 'INTERNAL_SERVER_ERROR' } })
  }
}

/**
 * Changes the user's password.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 */
const changePassword = async (req, res) => {
  try {
    const { _id } = req.user
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(_id)
    if (!user) return res.status(404).json({ error: { message: 'NOT_FOUND' } })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ error: { message: 'PASSWORD_NOT_MATCH' } })

    const updatedUser = await UserModel.findByIdAndUpdate(_id, { password: newPassword }, { new: true })
    if (updatedUser) return res.status(200).json({ message: 'OK' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: { message: 'INTERNAL_SERVER_ERROR' } })
  }
}

const signInWithGoogle = async (req, res) => {

}

module.exports = {
  signUp,
  signIn,
  signInWithGoogle,
  getMe,
  sendEmailVerification,
  verifyEmail,
  sendPasswordResetCode,
  resetPassword,
  deleteAccount,
  changePassword
}
