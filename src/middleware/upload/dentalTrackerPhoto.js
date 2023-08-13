const multer = require('multer')
const { handleCloudinaryUpload } = require('../../helpers/cloudinary')
const { MulterError } = multer

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new MulterError('UNSUPPORTED_FILE_TYPE', 'Only supported jpg, jpeg, and png'), false)
  }
  cb(null, true)
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
}).single('photo')

/**
 * @description Middleware to upload profile picture.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @returns {Promise<void>}
 */
const uploadDentalTrackerPhoto = async (req, res, next) => {
  try {
    upload(req, res, handleUpload(req, res, next))
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * @description Handle file upload process to Cloudinary.
 * @param req - Express request object.
 * @param res - Express res object.
 * @param next - Express next middleware function.
 * @returns {Promise<void>}
 */
const handleUpload = (req, res, next) => async (err) => {
  try {
    if (err) {
      handleError(err, res)
      return
    }
    console.log(req.file)
    if (!req.file) {
      return res.status(422).json({
        error: {
          code: 'MISSING_FILE',
          message: 'File is missing'
        }
      })
    }
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const datauri = 'data:' + req.file.mimetype + ';base64,' + b64

    req.uploadResult = await handleCloudinaryUpload(datauri)
    next()
  } catch (err) {
    return res.status(500)
      .json({
        error: { message: err.message || 'SOMETHING_WENT_WRONG' }
      })
  }
}

/**
 * @description Handle error during file upload process.
 * @param err - Multer error object.
 * @param res - Express response object.
 * @returns {Object} - The response containing error details.
 */
const handleError = (err, res) => {
  if (err instanceof MulterError) {
    return res
      .status(400)
      .json({
        error: {
          code: err.code,
          message: err.message || err.field
        }
      })
  } else {
    return res
      .status(500)
      .json({
        error: { message: err.message || 'SOMETHING_WENT_WRONG' }
      })
  }
}

module.exports = uploadDentalTrackerPhoto
