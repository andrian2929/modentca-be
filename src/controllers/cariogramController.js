const checkCariogram = async (req, res) => {
  try {
    const { decay, extracted, filling } = req.query
    const def = Number(decay) + Number(extracted) + Number(filling)

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
  checkCariogram
}
