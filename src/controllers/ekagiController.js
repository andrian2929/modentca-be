const ekagiModel = require('../models/Ekagi')
const { handleCloudinaryDelete } = require('../helpers/cloudinary')
const { toLocal } = require('../utils/timeUtils')

const getEkagi = async (req, res) => {
  try {
    const { type } = req.query
    const filter = {}
    if (type) {
      filter.type = type
    }

    const ekagi = await ekagiModel.find(filter).lean()
    const formattedResponse = ekagi.map((ekagi) => (responseFormatter(ekagi)))
    if (ekagi.length < 1) {
      res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    res.status(200).json({
      message: 'OK',
      data: formattedResponse
    })
  } catch (err) {}
}

const storeEkagi = async (req, res) => {
  try {
    const { title, type, content } = req.body
    let thumbnail = null

    if (req.uploadResult) {
      const { public_id: publicId, secure_url: url } = req.uploadResult
      thumbnail = { publicId, url }
    }
    const ekagi = await ekagiModel.create({
      title,
      type,
      content,
      thumbnail
    })

    const formattedResponse = responseFormatter(ekagi)

    res.status(201).json({
      message: 'CREATED',
      data: formattedResponse
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: {
        message: 'INTERNAL_SERVER_ERROR'
      }
    })
  }
}

const updateEkagi = async (req, res) => {
  try {
    const { id } = req.params
    const { title, type, content } = req.body
    let thumbnail = null

    const ekagi = await ekagiModel.findById(id).lean()

    if (req.uploadResult) {
      const { public_id: publicId, secure_url: url } = req.uploadResult
      thumbnail = { publicId, url }

      if (ekagi.thumbnail) {
        await handleCloudinaryDelete(ekagi.thumbnail.publicId)
      }
    }

    if (ekagi.length === 0) {
      res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    const updatedEkagi = await ekagiModel.findByIdAndUpdate(id, {
      title: title || ekagi.title,
      type: type || ekagi.type,
      content: content || ekagi.content,
      thumbnail: thumbnail || ekagi.thumbnail
    }, {
      new: true
    })

    const formattedResponse = responseFormatter(updatedEkagi)

    res.status(200).json({
      message: 'OK',
      data: formattedResponse
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'INTERNAL_SERVER_ERROR'
    })
  }
}

const deleteEkagi = async (req, res) => {
  try {
    const { id } = req.params

    const ekagi = await ekagiModel.findById(id).lean()
    if (!ekagi) {
      res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    await ekagiModel.findByIdAndDelete(id).lean()
    res.status(204).end()
  } catch (err) {
    console.log(err)
    res.status(500)
      .json({
        error: {
          message: 'INTERNAL_SERVER_ERROR'
        }
      })
  }
}

const showEkagi = async (req, res) => {
  try {
    const { id } = req.params
    const ekagi = await ekagiModel.findById(id).lean()
    if (!ekagi) {
      res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }
    const formattedResponse = responseFormatter(ekagi)
    res.status(200).json({
      message: 'OK',
      data: formattedResponse
    })
  } catch (err) {
    console.log(err)
    res.status(500)
      .json({
        error: {
          message: 'INTERNAL_SERVER_ERROR'
        }
      })
  }
}

const responseFormatter = (ekagi) => {
  return {
    id: ekagi._id,
    title: ekagi.title,
    thumbnail: ekagi.thumbnail,
    type: ekagi.type,
    content: ekagi.content,
    createdAt: toLocal(ekagi.createdAt)
  }
}

module.exports = { getEkagi, storeEkagi, updateEkagi, deleteEkagi, showEkagi }
