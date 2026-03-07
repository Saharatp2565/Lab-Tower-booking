const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const { studentId, name, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ studentId, name, email, password: hashedPassword })
  try {
    await user.save()
    res.json({ message: 'User registered' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { studentId, email, password } = req.body
  const user = await User.findOne({ $or: [{ email }, { studentId }] })
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret')
  res.json({ user, token })
})

module.exports = router