const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String
})

module.exports = mongoose.model('User', userSchema)