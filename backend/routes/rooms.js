const express = require('express')
const router = express.Router()
const Room = require('../models/Room')

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find()
    res.json(rooms)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const room = new Room(req.body)
  try {
    await room.save()
    res.json(room)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router