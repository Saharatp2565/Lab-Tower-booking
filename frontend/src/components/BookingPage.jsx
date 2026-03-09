import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const toDateStr = (d) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

const BookingPage = ({ rooms, bookings, onBook }) => {
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
  const [showConfirm, setShowConfirm] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const today = new Date()

  // compute week dates Monday–Sunday
  const getWeekDates = () => {
    const day = today.getDay() // 0=Sun,1=Mon
    const diffToMon = (day + 6) % 7 // days since last Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() - diffToMon)
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(d)
    }
    return dates
  }
  const weekDates = getWeekDates()

  const isBookedOn = (bedId, date) => {
    const dateStr = toDateStr(date)
    return bookings.some(b =>
      String(b.room) === String(roomId) &&
      String(b.bedId) === String(bedId) &&
      b.checkIn <= dateStr &&
      (b.checkOut || b.checkIn) >= dateStr
    )
  }

  const getAvailabilityForBed = bedId =>
    weekDates.map(d => (isBookedOn(bedId, d) ? 'ไม่ว่าง' : 'ว่าง'))

  const getAvailableDatesForBed = bedId =>
    weekDates.filter(d => !isBookedOn(bedId, d))

  const handleSubmit = (e) => {
    e.preventDefault()
    // removed, now on bed click
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!selectedBed || !checkIn || !studentId || !name || !email) return alert('กรุณากรอกข้อมูลให้ครบ')
    if (!/^\d{10}$/.test(studentId)) return alert('รหัสนักศึกษาต้องเป็นเลข 10 ตัวเท่านั้น')
    const bookingData = {
      room: parseInt(roomId),
      bedId: selectedBed,
      checkIn,
      checkOut: checkIn,
      studentId,
      name,
      email,
      createdAt: new Date().toISOString()
    }

    try {
      // Save booking to Firestore
      await addDoc(collection(db, 'bookings'), bookingData)

      // Update bed status in Firestore room document
      if (room.docId) {
        const updatedBeds = room.beds.map(b =>
          b.id === selectedBed ? { ...b, status: 'occupied' } : b
        )
        await updateDoc(doc(db, 'rooms', room.docId), { beds: updatedBeds })
      }

      // Update local state
      if (onBook) onBook(bookingData)
      setShowConfirm(true)
      setShowModal(false)
      setSelectedBed('')
      setCheckIn('')
      setStudentId('')
      setName('')
      setEmail('')
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message)
    }
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
      <Link to="/" className="back-button">← กลับสู่หน้าหลัก</Link>
      <h2> {room.name} - Rack</h2>
      
      <div className="bed-status-list">
        <h3>เลือก Rack</h3>
        <div className="beds-grid">
          {room.beds.map(b => {
            const availability = getAvailabilityForBed(b.id)
            return (
              <div 
                key={b.id} 
                className="bed-card"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedBed(b.id)
                  setShowModal(true)
                }}
              >
                <div className="bed-number">Rack {b.id}</div>
                <div className="bed-calendar">
                  {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((label, i) => (
                    <div key={i} className={`day ${availability[i] === 'ว่าง' ? 'status-available' : 'status-occupied'}`}>
                      {label}: {availability[i]}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>จองRack {selectedBed}</h3>
            <form onSubmit={handleBookingSubmit}>
              <label>เลือกวันที่ต้องการจอง:</label>
              <select 
                value={checkIn} 
                onChange={e => setCheckIn(e.target.value)}
                required
              >
                <option value="">-- กรุณาเลือกวันที่ --</option>
                {selectedBed && getAvailableDatesForBed(selectedBed).map(d => (
                  <option key={toDateStr(d)} value={toDateStr(d)}>
                    {d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </option>
                ))}
              </select>
              <input 
                type="text" 
                value={studentId} 
                onChange={e => setStudentId(e.target.value)} 
                placeholder="รหัสนักศึกษา (10 หลัก)" 
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

      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>✅ การจองสำเร็จแล้ว</h3>
            <p>การจองของคุณได้รับการยืนยันเรียบร้อยแล้ว!</p>
            <button onClick={() => {
              setShowConfirm(false)
              setStudentId('')
              setName('')
              setEmail('')
              setCheckIn('')
            }}>ตกลง</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage