const {
  DateTime,
  Interval
} = require('../config/time')

const getCurrentTime = () => {
  return DateTime.now()
}

const toUTC = (time) => {
  return DateTime.utc(time)
}

const toLocal = (time) => {
  return DateTime.fromJSDate(time)
}

const toLocalFromIso = (time) => {
  return DateTime.fromISO(time)
}

const createDateTime = (config) => {
  return DateTime.fromObject(config)
}

const checkInTime = (type, time) => {
  if (type === 'morning') {
    const morningStart = time.set({
      hour: 4,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    const morningEnd = time.set({
      hour: 13,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    return {
      start: morningStart.toJSDate(),
      end: morningEnd.toJSDate()
    }
  }

  if (type === 'evening') {
    const eveningStart = time.set({
      hour: 16,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    const eveningEnd = time.set({
      hour: 23,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    return {
      start: eveningStart.toJSDate(),
      end: eveningEnd.toJSDate()
    }
  }
}

const getInterval = (start, end) => {
  return Interval.fromDateTimes(start, end)
}

module.exports = {
  getCurrentTime,
  createDateTime,
  toUTC,
  toLocal,
  checkInTime,
  getInterval,
  toLocalFromIso
}
