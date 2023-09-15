const UserModel = require('../../models/User')

const getUser = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 }).lean()

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: { message: 'NOT_FOUND' } })
    }

    return res
      .status(200)
      .json({ message: 'OK', data: users })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

const showUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password').lean()

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: 'NOT_FOUND' } })
    }

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
  getUser,
  showUser
}
