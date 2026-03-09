import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAQLAQvw9V7imLh8qA2UJxBFJFbdNZVsfE",
  authDomain: "lab-tower-booking.firebaseapp.com",
  projectId: "lab-tower-booking",
  storageBucket: "lab-tower-booking.firebasestorage.app",
  messagingSenderId: "331888285825",
  appId: "1:331888285825:web:5ff07bbbc5a42d9efbd580"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
