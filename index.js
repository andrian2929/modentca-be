const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')
const routes = require('./src/routes')

require('./src/config/firebase/firebase')
require('./src/config/db')
require('./src/config/time')
require('./src/config/cron')

const PORT = process.env.PORT || 3000

const app = express()

app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))
app.use(routes)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON payload' })
  } else {
    next()
  }
})

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
