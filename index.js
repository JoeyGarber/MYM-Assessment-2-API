const express = require('express')

const app = express()
const PORT = 8080


app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running. App is listening on port " + PORT)
  } else {
    console.log("Error occured, server can't start", error)
  }
})