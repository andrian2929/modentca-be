const cariogramHistoryModel = require('../models/CariogramHistory')
const { toUTC, createDateTime } = require('../utils/timeUtils')

/**
 * @description Get cariogram histories of the current authenticated user
 * @param req - Express request object
 * @param res - Express response object
 * @returns {Promise<void>}
 */
const getCariogramHistory = async (req, res) => {
  try {
    const { _id: userId } = req.user
    const filter = { userId }
    const { startDate, endDate } = req.query

    if (startDate && endDate) {
      const [startYear, startMonth, startDay] = startDate.split('-')
      const [endYear, endMonth, endDay] = endDate.split('-')
      filter.createdAt = {
        $gte: createDateTime({ year: startYear, month: startMonth, day: startDay }).toJSDate(),
        $lte: createDateTime({ year: endYear, month: endMonth, day: endDay }).toJSDate()
      }
    } else if (startDate) {
      const [startYear, startMonth, startDay] = startDate.split('-')
      console.log(createDateTime({ year: startYear, month: startMonth, day: startDay }).toJSDate())
      filter.createdAt = {
        $gte: createDateTime({ year: startYear, month: startMonth, day: startDay }).toJSDate()
      }
    } else if (endDate) {
      const [endYear, endMonth, endDay] = endDate.split('-')
      filter.createdAt = {
        $lte: createDateTime({ year: endYear, month: endMonth, day: endDay }).toJSDate()
      }
    }

    const cariogramHistory = await cariogramHistoryModel.find(filter).lean()
    if (cariogramHistory.length < 1) {
      res.status(404).json({
        error: {
          message: 'NOT_FOUND'
        }
      })
    }

    res.status(200).json({
      message: 'OK',
      data: cariogramHistory
    })
  } catch (err) {

  }
}

/**
 * @description Check cariogram based on decayed, extracted, and filled (deft)
 * @see https://en.wikipedia.org/wiki/Cariogram
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response object with deft value and deft scale
 */
const checkCariogram = async (req, res) => {
  try {
    const { decayed, extracted, filled } = req.query
    const { _id: userId } = req.user
    const def = Number(decayed) + Number(extracted) + Number(filled)

    let deftScale

    if (def >= 6.6) {
      deftScale = 'Sangat Tinggi'
    } else if (def >= 4.5 && def <= 6.5) {
      deftScale = 'Tinggi'
    } else if (def >= 2.7 && def <= 4.4) {
      deftScale = 'Sedang'
    } else if (def >= 1.2 && def <= 2.6) {
      deftScale = 'Rendah'
    } else if (def <= 1.1) {
      deftScale = 'Sangat Rendah'
    }

    await cariogramHistoryModel.create({
      userId,
      def,
      result: deftScale
    })

    return res.status(200).json({
      message: 'OK',
      data: {
        def,
        deftScale
      }
    })
  } catch (err) {
    return res
      .status(500)
      .json({ error: err })
  }
}

module.exports = {
  checkCariogram,
  getCariogramHistory
}
