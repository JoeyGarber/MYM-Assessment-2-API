require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

// This is the part where I need to persist things
// const User = require('../app/user')

const strategy = new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/google/callback',
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log('===== GOOGLE PROFILE =====')
    console.log(profile)
    console.log('======== END ========')
    return done(null, profile)
  }
)

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

passport.use(strategy)

module.exports = passport.initialize()