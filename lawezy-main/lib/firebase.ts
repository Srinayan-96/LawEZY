import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDYzfounUrGwl2ljQ0Ke3KxJu5yvoPftVs",
  authDomain: "lawezy-83e32.firebaseapp.com",
  projectId: "lawezy-83e32",
  storageBucket: "lawezy-83e32.firebasestorage.app",
  messagingSenderId: "407342424530",
  appId: "1:407342424530:web:582e6f0cfe77ff892ee80b",
  measurementId: "G-1HBKX012FG",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
