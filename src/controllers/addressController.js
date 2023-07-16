const axios = require('axios')
const https = require('https')
const crypto = require('crypto')

const options = {
  request: axios.create({
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
    })
  })
}

/**
 * Retrieves a list of provinces from an external API.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing a list of provinces.
 *
*/
const getProvince = async (req, res) => {
  try {
    const response = await options.request.get(
      'https://sig.bps.go.id/rest-bridging/getwilayah?level=provinsi'
    )
    const provinces = responseFormatter(response)
    return res.status(200)
      .json({ message: 'OK', data: provinces })
  } catch (err) {
    return res.status(500)
      .json({ error: err })
  }
}

/**
 * Retrieves a list of cities based on the provided province ID from an external API.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing a list of cities.
 */
const getCity = async (req, res) => {
  const { provinceId } = req.params

  try {
    const response = await options.request.get(
      `https://sig.bps.go.id/rest-bridging/getwilayah?level=kabupaten&parent=${provinceId}`
    )
    const cities = responseFormatter(response)
    return res.status(200).json({ message: 'OK', data: cities })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Retrieves a list of districts based on the provided city ID from an external API.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing a list of districts.
 */
const getDistrict = async (req, res) => {
  const { cityId } = req.params
  try {
    const response = await options.request.get(
      `https://sig.bps.go.id/rest-bridging/getwilayah?level=kecamatan&parent=${cityId}`
    )

    const districts = responseFormatter(response)
    return res.status(200).json({ message: 'OK', data: districts })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Retrieves a list of sub-districts based on the provided district ID from an external API.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing a list of sub-districts.
*/
const getSubDistrict = async (req, res) => {
  const { districtId } = req.params
  try {
    const response = await options.request.get(
      `https://sig.bps.go.id/rest-bridging/getwilayah?level=desa&parent=${districtId}`
    )

    const subDistricts = responseFormatter(response)

    return res.status(200).json({ message: 'OK', data: subDistricts })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

/**
 * Formats the response data from the external API to include only the required fields.
 *
 * @param {Object} response - The response object from the external API.
 * @returns {Array} - An array of formatted objects containing ID and name fields.
 */
function responseFormatter (response) {
  return response.data.map((item) => {
    return {
      id: item.kode_bps,
      name: item.nama_dagri
    }
  })
}

module.exports = { getProvince, getCity, getDistrict, getSubDistrict }
