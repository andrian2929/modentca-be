const { Router } = require('express')
const ekagiController = require('../controllers/ekagiController')
const ekagiValidation = require('../validation/ekagiValidation')
const { authenticateToken } = require('../middleware/auth')
const uploadEkagiThumbnail = require('../middleware/upload/ekagiThumbnail')
const router = Router()

router.post('/', authenticateToken, uploadEkagiThumbnail, ekagiValidation.storeEkagi, ekagiController.storeEkagi)
router.get('/', authenticateToken, ekagiController.getEkagi)
router.get('/:id', authenticateToken, ekagiController.showEkagi)
router.put('/:id', authenticateToken, uploadEkagiThumbnail, ekagiValidation.updateEkagi, ekagiController.updateEkagi)
router.delete('/:id', authenticateToken, ekagiController.deleteEkagi)
module.exports = router
