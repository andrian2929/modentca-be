const { Router } = require('express')
const router = Router()
const dentalTrackerController = require('../controllers/dentalTrackerController')
const uploadDentalTrackerPhoto = require('../middleware/upload/dentalTrackerPhoto')

router.get('/', dentalTrackerController.getDentalTracker)
router.post('/', uploadDentalTrackerPhoto, dentalTrackerController.storeDentalTracker)

module.exports = router
