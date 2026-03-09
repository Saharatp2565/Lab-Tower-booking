import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import RoomSelection from './components/RoomSelection'
import BookingPage from './components/BookingPage'

const defaultRooms = [
  {
    id: 1,
    name: 'CP9527',
    description: 'Spacious room with city view',
    beds: [
      { id: 1, status: 'available' },
      { id: 2, status: 'available' },
      { id: 3, status: 'maintenance' },
      { id: 4, status: 'occupied' },
      { id: 5, status: 'occupied' },
      { id: 6, status: 'available' }
    ]
  },
  {
    id: 2,
    name: 'CP9603',
    description: 'Comfortable room',
    beds: [
      { id: 1, status: 'available' },
      { id: 2, status: 'occupied' },
      { id: 3, status: 'available' },
      { id: 4, status: 'maintenance' }
    ]
  }
]

function App() {
  const [rooms, setRooms] = useState(defaultRooms)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // Load rooms from Firestore
    getDocs(query(collection(db, 'rooms'), orderBy('id')))
      .then(snapshot => {
        const data = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
        if (data.length) setRooms(data)
      })
      .catch(() => {})
    // Load bookings from Firestore
    getDocs(collection(db, 'bookings'))
      .then(snapshot => {
        setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      })
      .catch(() => {})
  }, [])

  const handleBook = (booking) => {
    // Add booking to local state
    setBookings(prev => [...prev, booking])
    // Update bed status in rooms
    setRooms(prev => prev.map(room => {
      if (String(room.id) !== String(booking.room)) return room
      return {
        ...room,
        beds: room.beds.map(bed =>
          bed.id === booking.bedId ? { ...bed, status: 'occupied' } : bed
        )
      }
    }))
  }

  return (
    <Router>
      <div className="container">
        <h1>Booking Lab Rack</h1>
        <Routes>
          <Route path="/" element={<RoomSelection rooms={rooms} bookings={bookings} />} />
          <Route path="/book/:roomId" element={<BookingPage rooms={rooms} bookings={bookings} onBook={handleBook} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App