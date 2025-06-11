import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Property {
  id: string
  title: string
  location: string
  price: string
  images: string[]
  status: string
  features: string[]
  description: string
  createdAt?: any
  updatedAt?: any
}

const COLLECTION_NAME = "properties"

// Mock data for when Firebase is not available
const mockProperties: Property[] = []

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return db !== null && db !== undefined
}

// Get all properties with real-time updates
export const subscribeToProperties = (callback: (properties: Property[]) => void): Promise<Unsubscribe> => {
  return new Promise((resolve) => {
    if (!isFirebaseAvailable()) {
      console.warn("Firebase not available, using mock data")
      // Return mock data immediately
      setTimeout(() => callback(mockProperties), 100)
      // Return a dummy unsubscribe function
      resolve(() => {})
      return
    }

    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const properties: Property[] = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Property,
          )
          callback(properties)
        },
        (error) => {
          console.error("Error fetching properties:", error)
          // Fallback to mock data on error
          callback(mockProperties)
        },
      )

      resolve(unsubscribe)
    } catch (error) {
      console.error("Error setting up Firestore listener:", error)
      // Fallback to mock data
      setTimeout(() => callback(mockProperties), 100)
      resolve(() => {})
    }
  })
}

// Add new property
export const addProperty = async (property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, simulating add operation")
    // Simulate adding to mock data
    const newId = Date.now().toString()
    const newProperty: Property = {
      ...property,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockProperties.unshift(newProperty)
    return newId
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...property,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding property:", error)
    throw error
  }
}

// Update property
export const updateProperty = async (id: string, property: Partial<Property>): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, simulating update operation")
    // Simulate updating mock data
    const index = mockProperties.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockProperties[index] = { ...mockProperties[index], ...property, updatedAt: new Date() }
    }
    return
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...property,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating property:", error)
    throw error
  }
}

// Delete property
export const deleteProperty = async (id: string): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, simulating delete operation")
    // Simulate deleting from mock data
    const index = mockProperties.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockProperties.splice(index, 1)
    }
    return
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error("Error deleting property:", error)
    throw error
  }
}

// Initialize with sample data if collection is empty
export const initializeSampleData = async (): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, using mock data")
    return
  }

  try {
    // Don't add any sample data - let user add properties manually
    console.log("Firebase initialized successfully - ready for manual property addition")
  } catch (error) {
    console.error("Error initializing Firebase:", error)
  }
}
