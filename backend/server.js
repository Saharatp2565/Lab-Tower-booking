const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// GET all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const snapshot = await db.collection('rooms').orderBy('id').get()
    const rooms = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
    res.json(rooms)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single room
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const snapshot = await db.collection('rooms').where('id', '==', parseInt(req.params.id)).get()
    if (snapshot.empty) return res.status(404).json({ error: 'Room not found' })
    const doc = snapshot.docs[0]
    res.json({ docId: doc.id, ...doc.data() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { room: roomId, bedId, checkIn, checkOut, studentId, name, email } = req.body

    // Validate required fields
    if (!roomId || !bedId || !checkIn || !studentId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Find room
    const roomSnapshot = await db.collection('rooms').where('id', '==', parseInt(roomId)).get()
    if (roomSnapshot.empty) return res.status(400).json({ error: 'Invalid room' })

    const roomDoc = roomSnapshot.docs[0]
    const roomData = roomDoc.data()
    const bed = roomData.beds.find(b => b.id == bedId)
    if (!bed || bed.status !== 'available') {
      return res.status(400).json({ error: 'Bed not available' })
    }

    // Update bed status in room
    const updatedBeds = roomData.beds.map(b =>
      b.id == bedId ? { ...b, status: 'occupied' } : b
    )
    await roomDoc.ref.update({ beds: updatedBeds })

    // Create booking document
    const booking = {
      room: parseInt(roomId),
      bedId: parseInt(bedId),
      checkIn,
      checkOut: checkOut || checkIn,
      studentId,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
    const bookingRef = await db.collection('bookings').add(booking)

    res.json({ id: bookingRef.id, ...booking })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const snapshot = await db.collection('bookings').get()
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app)