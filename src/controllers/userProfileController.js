const UserModel = require('../models/User')
const { handleCloudinaryDelete } = require('../helpers/cloudinary')

/**
 * @description Get the current authenticated user profile.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const getUserProfile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: 'OK', data: req.user })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

/**
 * @description update the current authenticated user profile.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id, req.body, { new: true }).select('-password')
    return res
      .status(200)
      .json({ message: 'OK', data: updatedUser })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ error: err })
  }
}

/**
 * @description Upload profile picture.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Promise<*>}
 */
const uploadProfilePhoto = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)

    if (user.image?.publicId) {
      await handleCloudinaryDelete(user.image.publicId)
    }
    user.image = {
      publicId: req.uploadResult.public_id,
      url: req.uploadResult.secure_url
    }
    await user.save()
    return res
      .status(200)
      .json({
        message: 'OK',
        data: {
          imageUrl: user.image.url,
          imagePublicId: user.image.publicId
        }
      })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto
}
