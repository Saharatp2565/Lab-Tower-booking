import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RoomSelection from './components/RoomSelection'
import BookingPage from './components/BookingPage'

function App() {
  const [rooms] = useState([
    {
      id: 1,
      name: 'Deluxe Room',
      description: 'Spacious room with city view',
      price: 100,
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
  ])

  return (
    <Router>
      <div className="container">
        <h1>Room Booking System</h1>
        <Routes>
          <Route path="/" element={<RoomSelection rooms={rooms} />} />
          <Route path="/book/:roomId" element={<BookingPage rooms={rooms} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App