const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')

router.post('/', async (req, res) => {
  const booking = new Booking(req.body)
  try {
    await booking.save()
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room user')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router