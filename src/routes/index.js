const { Router } = require('express')
const authRoutes = require('./auth')
const addressRoutes = require('./address')
const profileRoutes = require('./userProfile')
const entryRoutes = require('./entry')

const router = Router()

router.use('/auth', authRoutes)
router.use('/user-profile', profileRoutes)
router.use('/address', addressRoutes)
router.use('/', entryRoutes)

module.exports = router
