const { Settings, DateTime } = require('luxon')
const env = require('./env')

Settings.defaultZone = env.APP_TIMEZONE

module.exports = DateTime
