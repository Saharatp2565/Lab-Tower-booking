const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const rooms = [
  {
    id: 1,
    name: 'Deluxe Room',
    description: 'Spacious room with city view',
    price: 100,
    beds: [
      { id: 1, status: 'available' },
      { id: 2, status: 'available' },
      { id: 3, status: 'maintenance' },
      { id: 4, status: 'occupied' }
    ]
  },
  {
    id: 2,
    name: 'Standard Room',
    description: 'Comfortable room',
    price: 80,
    beds: [
      { id: 1, status: 'available' },
      { id: 2, status: 'occupied' },
      { id: 3, status: 'available' },
      { id: 4, status: 'maintenance' }
    ]
  }
]

const bookings = []

app.get('/api/rooms', (req, res) => res.json(rooms))

app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id == req.params.id)
  if (!room) return res.status(404).json({ error: 'Room not found' })
  res.json(room)
})

app.post('/api/bookings', (req, res) => {
  const { room: roomId, bedId, checkIn, checkOut, studentId, name, email } = req.body
  const room = rooms.find(r => r.id == roomId)
  if (!room) return res.status(400).json({ error: 'Invalid room' })
  const bed = room.beds.find(b => b.id == bedId)
  if (!bed || bed.status !== 'available') {
    return res.status(400).json({ error: 'Bed not available' })
  }
  bed.status = 'occupied'

  const booking = { room: roomId, bedId, checkIn, checkOut, studentId, name, email }
  bookings.push(booking)
  res.json(booking)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))