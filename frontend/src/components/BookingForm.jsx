import { useState } from 'react'

const BookingForm = ({ rooms }) => {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: selectedRoom, checkIn, checkOut })
    })
      .then(res => res.json())
      .then(data => alert('Booking successful'))
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
        <option value="">Select Room</option>
        {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
      </select>
      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
      <button type="submit">Book</button>
    </form>
  )
}

export default BookingForm