const { Settings, DateTime, Interval } = require('luxon')
const env = require('./env')

Settings.defaultZone = env.APP_TIMEZONE

module.exports = {
  Settings, DateTime, Interval
}
