const { Router } = require('express')
const { checkCariogram, getCariogramHistory } = require('../controllers/cariogramController')
const cariogramValidation = require('../validation/cariogramValidation')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.get('/', authenticateToken, cariogramValidation.checkCariogram, checkCariogram)
router.get('/history', authenticateToken, cariogramValidation.getCariogramHistory, getCariogramHistory)

module.exports = router
