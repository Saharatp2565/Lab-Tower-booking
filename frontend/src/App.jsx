import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RoomSelection from './components/RoomSelection'
import BookingPage from './components/BookingPage'

function App() {
  const [rooms] = useState([
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
  ])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(() => {})
  }, [])

  return (
    <Router>
      <div className="container">
        <h1>Booking Lab Tower</h1>
        <Routes>
          <Route path="/" element={<RoomSelection rooms={rooms} bookings={bookings} />} />
          <Route path="/book/:roomId" element={<BookingPage rooms={rooms} bookings={bookings} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App