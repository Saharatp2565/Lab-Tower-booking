import { Link } from 'react-router-dom'

const RoomSelection = ({ rooms }) => {
  return (
    <div>
      <h2>Select a Room</h2>
      {rooms.map(room => (
        <Link key={room.id} to={`/book/${room.id}`}>
          <div className="room-card">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <p>Price: ${room.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default RoomSelection