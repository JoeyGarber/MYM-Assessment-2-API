const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  google: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    }
  }
})

module.exports = mongoose.model('User', UserSchema)