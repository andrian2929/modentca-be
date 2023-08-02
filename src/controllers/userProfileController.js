const UserModel = require('../models/User')

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

module.exports = {
  getUserProfile,
  updateUserProfile
}
