const express = require('express')
const passport = require('passport')
const auth = require('./lib/auth') 
const db = require('./db')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const CLIENT_HOME_PAGE_URL = 'http://localhost:3000'

const app = express()

app.use(cookieParser())
app.use(session({
  secret: 'Shh, this is a secret!',
  resave: false,
  saveUninitialized: true
}))

app.use(auth)
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.connect()



const PORT = 8080

app.get('/login/succeeded', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'User has successfully been authenticated',
      user: req.session.passport.user.google
    })
  }
})

app.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'User failed to Log In'
  })
})

app.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }))

app.get('/google/callback',
  passport.authenticate('google'), (req, res) => {
    res.redirect(301, 'http://localhost:3000/')
  })

app.get('/profile', (req, res) => {
  res.send("Welcome " + req.session.passport.user.google.name)
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect(301, 'http://localhost:3000/')
})

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running. App is listening on port " + PORT)
  } else {
    console.log("Error occured, server can't start", error)
  }
})