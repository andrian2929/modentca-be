const { Router } = require('express')
const { checkCariogram } = require('../controllers/cariogramController')
const cariogramValidation = require('../validation/cariogramValidation')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.get('/', authenticateToken, cariogramValidation.cariogram, checkCariogram)

module.exports = router
