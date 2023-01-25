const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  }
}, {
  timestamps: true,
  toObject: {
    // remove 'hashedPassword' field when calling '.toObject'
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)