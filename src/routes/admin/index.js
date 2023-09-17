const { Router } = require('express')

const router = Router()

router.use('/user', require('./user'))
router.use(require('./checkin'))

module.exports = router
