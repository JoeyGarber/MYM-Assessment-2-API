const mongoose = require('mongoose')

const localDb = "mongodb://localhost:27017"

const currentDb = process.env.DB_URI || localDb

const connect = async () => {
  mongoose.connect(currentDb, {
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