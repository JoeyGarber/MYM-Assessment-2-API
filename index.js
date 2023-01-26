const express = require('express')
const session = require('express-session')
const cors = require('cors')

// read environment variables
require('dotenv').config()

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const db = require('./db')
const User = require('./app/user')

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000'
const PORT = 8080
const clientDevPort = 3000

// initialize app
const app = express()

// initialize cors
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` || 'http://localhost:3000' ,
credentials: true}))

// create session, attach it to req
app.use(session({
  secret: 'Shh, this is a secret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// initialize passport, sets req.session.passport.user = req.session['passport']
// it does this every request, I believe
// basically, it takes info from the store, or allocates a chunk of store for itself, and puts it in the cookie
app.use(passport.initialize())
// session() looks for a user object in req.session.passport.user, and puts it in req.user by deserializing
app.use(passport.session())

// parse JSON requests into JS objects as they reach route files
app.use(express.json())
// parses requests sent by '$.ajax', which use a different content type
app.use(express.urlencoded({ extended: true }))

// connect to the database
db.connect()

// Google Strategy Callback
authUser = async (request, accessToken, refreshToken, profile, done) => {
  console.log('===== GOOGLE PROFILE =====')
  console.log(profile)
  console.log('======== END ========')
  // See if that user is already in the database
  try {
    let existingUser = await User.findOne({ 'google.id': profile.id })
    // If so, return the user on a success, and null on an error
    if (existingUser) {
      return done(null, existingUser)
    }
    // Otherwise, create a new user
    console.log('Creating new user...')
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      }
    })
    // Save and return new user on success, and null on an error
    await newUser.save()
    return done(null, newUser)
  } catch (error) {
    console.log('Error Finding or Creating User')
    return done(error, false)
  }
}

// Google handles a lot of this bit
// Get back a user profile
passport.use(new GoogleStrategy(
  
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/google/callback',
    passReqToCallback: true
  }, authUser))


// If I were going to add non-OAuth2.0 logins in the future, I would create a new Local Strategy here
// It would authenticate the user, then send it to the serializers
// I would use it on a separate login route, but one that would work the same way:
// Before a user logged in, /user will return an empty string. After it'll have a user object
// And my React app will show you the image when it queries /user, gets a user, and puts it in its state

// Serialize the user
// That attaches them to req.session.passport.user.{authenticated_user}
passport.serializeUser(function(user, done) {
  done(null, user)
})

// Deserialize the user
// That attaches them from req.session.passport.user.{authenticated_user} to req.user.{authenticated_user}
passport.deserializeUser(function(user, done) {
  done(null, user)
})


const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  console.log('Not authenticated')
  res.redirect(CLIENT_HOME_PAGE_URL)
}

// Login route 
app.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }))

// Login callback
app.get('/google/callback',
  passport.authenticate('google'), (req, res) => {
    res.redirect(CLIENT_HOME_PAGE_URL)
  })

app.get('/user', checkAuthenticated, (req, res) => {
  res.json(req.user)
})

// This is not working. Can still hit /user, and receive a req.user obj after logging out
// Causes error if I add req.session.destroy()
app.post('/logout', passport.session(), checkAuthenticated, (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err)}
    
  })
  res.redirect(CLIENT_HOME_PAGE_URL)
  console.log(`--------> User Logged Out`)
})

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running. App is listening on port " + PORT)
  } else {
    console.log("Error occured, server can't start", error)
  }
})