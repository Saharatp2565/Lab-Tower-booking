import { Link } from 'react-router-dom'

const toDateStr = (d) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

const RoomSelection = ({ rooms, bookings }) => {
  // compute week dates Monday–Sunday
  const getWeekDates = () => {
    const today = new Date()
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

  const isBookedOn = (roomId, bedId, date) => {
    const dateStr = toDateStr(date)
    return bookings.some(b =>
      String(b.room) === String(roomId) &&
      String(b.bedId) === String(bedId) &&
      b.checkIn <= dateStr &&
      (b.checkOut || b.checkIn) >= dateStr
    )
  }

  const getAvailabilityForBed = (roomId, bedId) =>
    weekDates.map(d => (isBookedOn(roomId, bedId, d) ? 'ไม่ว่าง' : 'ว่าง'))

  return (
    <div>
      <h2>Select Tower</h2>
      {rooms.map(room => (
        <Link key={room.id} to={`/book/${room.id}`}>
          <div className="room-card">
            <h3>{room.name}</h3>
            <div className="room-beds-status">
              <h4>(จันทร์-อาทิตย์):</h4>
              {room.beds.map(bed => {
                const availability = getAvailabilityForBed(room.id, bed.id)
                return (
                  <div key={bed.id} className="bed-summary">
                    <span>Tower {bed.id}: </span>
                    {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((label, i) => (
                      <span key={i} className={`day ${availability[i] === 'ว่าง' ? 'status-available' : 'status-occupied'}`}>
                        {label}: {availability[i]}
                      </span>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default RoomSelection