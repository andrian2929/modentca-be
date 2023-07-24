const DateTime = require('../config/time')

const getCurrentTime = () => {
  // log days in month
  return DateTime.now()
}

const toUTC = (time) => {
  return DateTime.utc(time)
}

const toLocal = (time) => {
  return DateTime.fromJSDate(time)
}

const checkInTime = (type) => {
  if (type === 'morning') {
    const morningStart = DateTime.now().set({
      hour: 4,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    const morningEnd = DateTime.now().set({
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
    const eveningStart = DateTime.now().set({
      hour: 16,
      minute: 0,
      second: 0,
      millisecond: 0
    })

    const eveningEnd = DateTime.now().set({
      hour: 22,
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

module.exports = {
  getCurrentTime,
  toUTC,
  toLocal,
  checkInTime
}
