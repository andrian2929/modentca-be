const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const env = require('../config/env')

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const authenticatedUser = await UserModel.findOne({
      username
    }).lean()
    if (authenticatedUser) {
      const isPasswordMatch = await bcrypt.compare(
        password,
        authenticatedUser.password
      )
      if (isPasswordMatch) return done(null, { user: authenticatedUser })
      return done(null, false, { name: 'WRONG_CREDENTIALS' })
    }
    return done(null, false, { name: 'NOT_FOUND' })
  } catch (err) {
    return done(err)
  }
}))

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET
}
passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await UserModel.findOne({ _id: payload._id })
      .select('-password')
      .lean()
    if (!user) {
      return done(null, false, { message: 'User not found' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))
