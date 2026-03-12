import type * as FirebaseFirestore from "@firebase/firestore"

// This file defines the schema for our Firestore collections
// It's not used directly by Firebase but serves as documentation

// Users collection
interface User {
  uid: string
  email: string
  name?: string
  role: "user" | "professional"
  designation?: string // For professionals
  rate?: number // For professionals
  experience?: string // For professionals
  degree?: string // For professionals
  photoURL?: string
  bio?: string
  createdAt: FirebaseFirestore.Timestamp
}

// Blogs collection
interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    photoURL?: string
  }
  createdAt: FirebaseFirestore.Timestamp
  likes: number
  comments: number
  tags: string[]
  imageUrl?: string
}

// Comments collection
interface Comment {
  id: string
  blogId: string
  userId: string
  userName: string
  userPhotoURL?: string
  content: string
  createdAt: FirebaseFirestore.Timestamp
}

// Likes collection
interface Like {
  blogId: string
  userId: string
  createdAt: FirebaseFirestore.Timestamp
}

// Messages collection
interface Message {
  senderId: string
  receiverId: string
  content: string
  timestamp: FirebaseFirestore.Timestamp
  read: boolean
  participants: string[] // Array containing both senderId and receiverId for easier querying
}

// Appointments collection
interface Appointment {
  professionalId: string
  userId: string
  professionalName: string
  userName: string
  professionalEmail: string
  userEmail: string
  date: FirebaseFirestore.Timestamp
  startTime: string
  endTime: string
  type: "online" | "in-person"
  status: "pending" | "confirmed" | "rejected" | "completed"
  notes?: string
  meetingLink?: string
  professionalNotes?: string
  createdAt: FirebaseFirestore.Timestamp
}

// Availability collection
interface AvailabilitySlot {
  professionalId: string
  date: FirebaseFirestore.Timestamp
  startTime: string
  endTime: string
  isRecurring: boolean
  createdAt: FirebaseFirestore.Timestamp
}

// Resources collection
interface Resource {
  title: string
  description: string
  category: string
  tags: string[]
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: string
  uploadedBy: {
    id: string
    name: string
    photoURL?: string
  }
  createdAt: FirebaseFirestore.Timestamp
  downloads: number
}

// Export these types for use in the application
export type { User, Blog, Comment, Like, Message, Appointment, AvailabilitySlot, Resource }
