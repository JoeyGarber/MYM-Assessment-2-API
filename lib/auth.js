require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../app/user')

const strategy = new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/google/callback',
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    console.log('===== GOOGLE PROFILE =====')
    console.log(profile)
    console.log('======== END ========')

    try {
      let existingUser = await User.findOne({ 'google.id': profile.id })
      if (existingUser) {
        console.log('User found in DB')
        return done(null, existingUser)
      }
      console.log('Creating new user...')
      const newUser = new User({
        method: 'google',
        google: {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }
      })
      await newUser.save()
      return done(null, newUser)
    } catch (error) {
      console.log('Error Finding or Creating User')
      return done(error, false)
    }
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