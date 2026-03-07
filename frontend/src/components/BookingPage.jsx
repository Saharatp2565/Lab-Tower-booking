import { useParams } from 'react-router-dom'
import { useState } from 'react'

const BookingPage = ({ rooms }) => {
  const { roomId } = useParams()
  const numRoomId = parseInt(roomId, 10)
  const room = rooms.find(r => r.id === numRoomId) || {
    id: numRoomId,
    name: 'Room ' + numRoomId,
    beds: [
      { id: 1, status: 'available' },
      { id: 2, status: 'available' },
      { id: 3, status: 'maintenance' },
      { id: 4, status: 'available' }
    ]
  }
  const [selectedBed, setSelectedBed] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedBed) return alert('Select a bed')
    setShowModal(true)
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!studentId || !name || !email) return alert('กรุณากรอกข้อมูลให้ครบ')
    if (!/^\d{10}$/.test(studentId)) return alert('รหัสนักศึกษาต้องเป็นเลข 10 ตัวเท่านั้น')
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: roomId, bedId: selectedBed, checkIn, checkOut, studentId, name, email })
    })
      .then(res => res.json())
      .then(data => {
        alert('Booking successful')
        setShowModal(false)
        setStudentId('')
        setName('')
        setEmail('')
      })
  }

  const getStatusColor = (status) => {
    if (status === 'available') return '#4CAF50'
    if (status === 'occupied') return '#f44336'
    if (status === 'maintenance') return '#FF9800'
    return '#999'
  }

  const getStatusLabel = (status) => {
    if (status === 'available') return 'ว่าง'
    if (status === 'occupied') return 'กำลังใช้งาน'
    if (status === 'maintenance') return 'กำลังปรับปรุง'
    return status
  }

  return (
    <div>
      <h2>Book {room.name}</h2>
      
      <div className="bed-status-list">
        <h3>สถานะเตียง</h3>
        <div className="beds-grid">
          {room.beds.map(b => (
            <div 
              key={b.id} 
              className="bed-card"
              style={{ borderColor: getStatusColor(b.status) }}
            >
              <div className="bed-number">เตียง {b.id}</div>
              <div 
                className="bed-status"
                style={{ color: getStatusColor(b.status) }}
              >
                {getStatusLabel(b.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>เลือกเตียง:</label>
        <select 
          value={selectedBed} 
          onChange={e => setSelectedBed(e.target.value)}
        >
          <option value="">-- เลือกเตียง --</option>
          {room.beds
            .filter(b => b.status === 'available')
            .map(b => (
              <option key={b.id} value={b.id}>
                เตียง {b.id} - ว่าง
              </option>
            ))}
        </select>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="Check-in" required />
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="Check-out" required />
        <button type="submit">จองเตียง</button>
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>กรุณากรอกข้อมูลส่วนตัว</h3>
            <form onSubmit={handleBookingSubmit}>
              <input 
                type="text" 
                value={studentId} 
                onChange={e => setStudentId(e.target.value)} 
                placeholder="รหัสนักศึกษา (10 ตัว)" 
                maxLength="10" 
                pattern="\d{10}" 
                required 
              />
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="ชื่อ-นามสกุล" 
                required 
              />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="อีเมล" 
                required 
              />
              <button type="submit">ยืนยันการจอง</button>
              <button type="button" onClick={() => setShowModal(false)}>ยกเลิก</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage