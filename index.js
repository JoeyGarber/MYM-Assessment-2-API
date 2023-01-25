const express = require('express')
const passport = require('passport')
const session = require('express-session')
const auth = require('./lib/auth')

const app = express()

app.use(session({
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

const PORT = 8080
app.use(auth)
app.use(passport.session())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "You are not logged in"})
})

app.get('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }))

app.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure'
  }),
  function (req, res) {
    console.log(req.user)
    res.redirect('/success')
  })
  
  app.get('/failure', (req, res) => {
    res.send("Failed.")
  })

  app.get('/success', (req, res) => {
    res.send(req.user)
  })

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running. App is listening on port " + PORT)
  } else {
    console.log("Error occured, server can't start", error)
  }
})