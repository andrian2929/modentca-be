const { Router } = require('express')
const ekagiController = require('../controllers/ekagiController')
const ekagiValidation = require('../validation/ekagiValidation')
const uploadEkagiThumbnail = require('../middleware/upload/ekagiThumbnail')
const router = Router()

router.post('/', uploadEkagiThumbnail, ekagiValidation.storeEkagi, ekagiController.storeEkagi)
router.get('/', ekagiController.getEkagi)
router.put('/:id', uploadEkagiThumbnail, ekagiValidation.updateEkagi, ekagiController.updateEkagi)
router.delete('/:id', ekagiController.deleteEkagi)
module.exports = router
