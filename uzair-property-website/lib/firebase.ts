import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6AhoI3os4-W03hQTnSDoj6W52CT93KtU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "uzair-property.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "uzair-property",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "uzair-property.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "138091413126",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:138091413126:web:72b698f9a1382d9f99db07",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-L65T1ZBQ2G",
}

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore
let db: any = null

try {
  db = getFirestore(app)

  // Connect to Firestore emulator in development if needed
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    // Only connect to emulator if we're using default config (no custom project)
    // connectFirestoreEmulator(db, 'localhost', 8080)
  }
} catch (error) {
  console.error("Error initializing Firestore:", error)
}

export { db }
