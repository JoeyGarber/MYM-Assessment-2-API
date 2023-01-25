const mongoose = require('mongoose')

const dbUri = "mongodb://localhost:27017"

const connect = async () => {
  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection
  db.on("error", () => {
    console.log('Mongoose could not connect.')
  })
  db.once("open", () => {
    console.log("Successful connection to database")
  })
}

module.exports = { connect }