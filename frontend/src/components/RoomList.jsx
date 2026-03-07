import React from 'react'

const RoomList = ({ rooms }) => {
  return (
    <div>
      <h2>Available Rooms</h2>
      {rooms.map(room => (
        <div key={room.id} className="room-card">
          <h3>{room.name}</h3>
          <p>{room.description}</p>
          <p>Price: ${room.price}</p>
        </div>
      ))}
    </div>
  )
}

export default RoomList