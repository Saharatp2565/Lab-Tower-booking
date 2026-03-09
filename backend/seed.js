/**
 * Seed script to populate Firestore with initial room data.
 * Run: cd backend && node seed.js
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your Firebase service account key.
 */
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

const rooms = [
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

async function seed() {
  const batch = db.batch()
  for (const room of rooms) {
    const ref = db.collection('rooms').doc(`room-${room.id}`)
    batch.set(ref, room)
  }
  await batch.commit()
  console.log('Seeded', rooms.length, 'rooms to Firestore')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
