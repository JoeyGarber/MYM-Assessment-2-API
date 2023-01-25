const express = require('express')
const passport = require('passport')
const auth = require('./lib/auth') 
const db = require('./db')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

app.use(cookieParser())
app.use(session({
  secret: 'Shh, this is a secret!',
  resave: false,
  saveUninitialized: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

db.connect()

app.use(auth)

const PORT = 8080

app.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }))

app.get('/google/callback',
  passport.authenticate('google'), (req, res) => {
    res.redirect('/profile')
  })

app.get('/profile', (req, res) => {
  res.send("Welcome " + req.session.passport.user.google.name)
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect(301, 'localhost:3000/')
})

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running. App is listening on port " + PORT)
  } else {
    console.log("Error occured, server can't start", error)
  }
})