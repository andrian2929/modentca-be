const cloudinary = require('../config/cloudinary')

const handleUpload = async (file) => {
  return await cloudinary.uploader.upload(file, {
    resource_type: 'auto'
  })
}

const handleDelete = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

module.exports = { handleCloudinaryUpload: handleUpload, handleCloudinaryDelete: handleDelete }
