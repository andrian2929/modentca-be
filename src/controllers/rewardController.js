const { toLocal } = require('../utils/timeUtils')
const { getTotalPoint, reduceCheckInPoint } = require('../controllers/checkinController')
const rewardModel = require('../models/Reward')
const redemptionHistoryModel = require('../models/RedemptionHistory')

/**
 * Retrieve all rewards.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req - Express response object.
 * @returns {Object} - The response containing the rewards data or an error message.
 */
const getReward = async (req, res) => {
  try {
    const rewards = await rewardModel.find().lean()

    if (rewards.length === 0) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    const formattedRewards = rewards.map((reward) => (formatResponse(reward)))

    return res.status(200).json({
      message: 'OK',
      data: formattedRewards
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * Create a new reward.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req - Express response object.
 * @returns {Object} - The response containing the newly created reward data or an error message.
 */
const storeReward = async (req, res) => {
  try {
    const { name, description, point, stock, isAvailable } = req.body

    const reward = await rewardModel.create({
      name,
      description,
      point,
      stock,
      isAvailable
    })

    return res.status(201).json({
      message: 'CREATED',
      data: formatResponse(reward)
    })
  } catch (err) {
    return res
      .status(500)
      .json({
        error: {
          message: 'INTERNAL_SERVER_ERROR'
        }
      })
  }
}

/**
 * @description Update specified reward.
 * @param {Object} req - Express request object.
 * @param {Object} req - Express response object.
 * @returns {Object} - The response containing the updated reward data or an error message.
 */
const updateReward = async (req, res) => {
  try {
    const { name, description, point, stock, isAvailable } = req.body
    const reward = await rewardModel.findById(req.params.id)

    if (!reward) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    const updatedReward = await rewardModel.findByIdAndUpdate(req.params.id,
      {
        name: name || reward.name,
        description: description || reward.description,
        point: point || reward.point,
        stock: stock || reward.stock,
        isAvailable: isAvailable || reward.isAvailable
      },
      { new: true })

    return res.status(200).json({
      message: 'OK',
      data: formatResponse(updatedReward)
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @description Delete specified reward.
 * @param {Object} req - Express request object.
 * @param {Object} req - Express response object.
 */
const deleteReward = async (req, res) => {
  try {
    const reward = await rewardModel.findById(req.params.id)

    if (!reward) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    await rewardModel.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * @description Show specified reward.
 * @param {Object} req - Express request object.
 * @param {Object} req - Express response object.
 * @returns {Object} - The response containing the specified reward data or an error message.
 */
const showReward = async (req, res) => {
  try {
    const reward = await rewardModel.findById(req.params.id)

    if (!reward) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    return res.status(200).json({
      message: 'OK',
      data: formatResponse(reward)
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

/**
 * @description Redeem specified reward
 * @param {Object} req - Express request object
 * @param {Object} req - Express response object
 * @returns {Object} - The response containing
 *
 *
 */
const redeemReward = async (req, res) => {
  try {
    const reward = await rewardModel.findById(req.params.id).lean()

    if (!reward) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    const totalPoint = await getTotalPoint(req.user._id)

    if (reward.stock === 0) {
      return res.status(400).json({
        error: {
          message: 'OUT_OF_STOCK'
        }
      })
    }

    if (!reward.isAvailable) {
      return res.status(400).json({
        error: {
          message: 'REWARD_NOT_AVAILABLE'
        }
      })
    }

    if (totalPoint < reward.point) {
      return res.status(400).json({
        error: {
          message: 'INSUFFICIENT_POINT'
        }
      })
    }

    await rewardModel.findByIdAndUpdate(req.params.id, { stock: reward.stock - 1 })
    await reduceCheckInPoint(req.user._id, reward.point)
    await redemptionHistoryModel.create({
      user: req.user._id,
      reward: req.params.id
    })

    return res.status(200).json({
      message: 'OK'
    })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

const redemtionHistory = async (req, res) => {
  try {
    const redemptionHistories = await redemptionHistoryModel
      .find({
        user: req.user._id
      })
      .populate('reward', 'name description')
      .select('-user')
      .lean()

    if (redemptionHistories.length === 0) {
      return res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    return res.status(200).json({
      message: 'OK',
      data: redemptionHistories.map((redemptionHistory) => (formatRedemptionHistory(redemptionHistory)))
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

const formatResponse = (reward) => ({
  id: reward._id,
  name: reward.name,
  description: reward.description,
  point: reward.point,
  stock: reward.stock,
  isAvailable: reward.isAvailable,
  createdAt: toLocal(reward.createdAt),
  updatedAt: toLocal(reward.updatedAt)
})

const formatRedemptionHistory = (redemptionHistory) => {
  const { reward } = redemptionHistory

  if (!reward) {
    return {
      id: redemptionHistory._id,
      reward: null,
      createdAt: toLocal(redemptionHistory.createdAt),
      updatedAt: toLocal(redemptionHistory.updatedAt)
    }
  }

  return {
    id: redemptionHistory._id,
    reward: {
      id: reward._id,
      name: reward.name,
      description: reward.description

    },
    createdAt: toLocal(redemptionHistory.createdAt),
    updatedAt: toLocal(redemptionHistory.updatedAt)

  }
}

module.exports = {
  getReward,
  storeReward,
  updateReward,
  deleteReward,
  showReward,
  redeemReward,
  redemtionHistory
}
