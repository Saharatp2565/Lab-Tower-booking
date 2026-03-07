const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  available: { type: Boolean, default: true }
})

module.exports = mongoose.model('Room', roomSchema)