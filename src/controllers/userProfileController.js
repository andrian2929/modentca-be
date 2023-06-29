const UserModel = require('../models/User')
const profileValidation = require('../validation/profileValidation')

const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
    return res
      .status(200)
      .json({ message: 'OK', data: user })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

const updateUserProfile = async (req, res) => {
  const { error } = profileValidation.updateProfile(req.body)
  if (error) {
    return res
      .status(400)
      .json({
        error: {
          message: error.details[0].message
        }
      })
  }
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    )
    return res
      .status(200)
      .json({ message: 'OK', data: user })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile
}
