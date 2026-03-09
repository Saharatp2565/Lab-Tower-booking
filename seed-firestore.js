const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Use Application Default Credentials (firebase login sets this)
process.env.GOOGLE_CLOUD_PROJECT = 'lab-tower-booking';
process.env.GCLOUD_PROJECT = 'lab-tower-booking';

initializeApp({ projectId: 'lab-tower-booking' });
const db = getFirestore();

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
];

async function seed() {
  const batch = db.batch();
  for (const room of rooms) {
    const ref = db.collection('rooms').doc('room-' + room.id);
    batch.set(ref, room);
  }
  await batch.commit();
  console.log('Seeded', rooms.length, 'rooms to Firestore');
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
