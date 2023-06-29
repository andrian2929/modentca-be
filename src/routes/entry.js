const { Router } = require('express')

const router = Router()

router.get('/', async (req, res) => {
  res.json({
    message: 'OK',
    data: {
      name: 'Modentca API',
      decription: 'Modentca is a web-based online platform for monitoring and managing dental health, with an emphasis on dental caries, through features such as cariogram, electronic medical records, and educational galleries.',
      stage: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      developers: [
        {
          name: 'Andrian Putra Ramadan',
          email: 'ramadanandrian89@gmail.com',
          role: 'Backend Developer'
        },
        {
          name: 'Herzinanda Putra',
          email: 'herzinanda31@gmail.com',
          role: 'Frontend Developer'
        }
      ]
    },
    documentation: 'https://documenter.getpostman.com/view/23794963/2s93zB4MF3'
  })
})

router.get('/ping', (req, res) => {
  res.json({ message: 'PONG' })
})

router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

module.exports = router
