const { Settings, DateTime } = require("luxon");
const env = require("./env");

const { APP_TIMEZONE } = env;

Settings.defaultZone = APP_TIMEZONE;

module.exports = DateTime;
