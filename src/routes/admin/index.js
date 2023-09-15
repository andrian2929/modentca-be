const { Router } = require('express')

const router = Router()

router.use('/user', require('./user'))

module.exports = router
