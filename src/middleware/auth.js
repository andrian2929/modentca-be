const passport = require('passport')

const authenticateLogin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err)
    switch (info?.name) {
      case 'WRONG_CREDENTIALS':
        return res.status(401).json({ error: { message: info.name } })
      case 'NOT_FOUND':
        return res.status(404).json({ error: { message: info.name } })
    }
    req.user = user
    next()
  })(req, res, next)
}

const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    switch (info?.name) {
      case 'JsonWebTokenError':
      case 'TokenExpiredError':
        return res.status(401).json({ error: { message: info.name } })
    }
    if (!user) return res.status(401).json({ error: info })
    req.user = user
    next()
  })(req, res, next)
}

module.exports = { authenticateLogin, authenticateToken }
