const { Router } = require('express')
const authRoutes = require('./auth')
const addressRoutes = require('./address')
const profileRoutes = require('./userProfile')
const checkinRoutes = require('./checkin')
const entryRoutes = require('./entry')
const cariogramRoutes = require('./cariogram')
const rewardRoutes = require('./reward')

const router = Router()

router.use('/cariogram', cariogramRoutes)
router.use('/auth', authRoutes)
router.use('/user-profile', profileRoutes)
router.use('/address', addressRoutes)
router.use('/checkin', checkinRoutes)
router.use('/reward', rewardRoutes)
router.use('/', entryRoutes)

module.exports = router
