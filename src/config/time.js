const { Settings, DateTime } = require('luxon')
const env = require('./env')

const { APP_TIMEZONE } = env

Settings.defaultZone = APP_TIMEZONE

console.log(DateTime.local().toISO())

module.exports = DateTime
