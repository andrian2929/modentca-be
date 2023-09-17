const UserModel = require('../../models/User')
const { toLocal } = require('../../utils/timeUtils')

const getUser = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 }).lean()
    const formattedUsers = users.map(formatResponse)

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: { message: 'NOT_FOUND' } })
    }

    return res
      .status(200)
      .json({ message: 'OK', data: formattedUsers })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

const showUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password').lean()
    const formattedUser = formatResponse(user)

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: 'NOT_FOUND' } })
    }

    return res
      .status(200)
      .json({ message: 'OK', data: formattedUser })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

const formatResponse = (user) => {
  user.createdAt = toLocal(user.createdAt).toISO()
  return user
}

module.exports = {
  getUser,
  showUser
}
