"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type UserRole = "user" | "professional"

interface UserData {
  uid: string
  email: string | null
  role: UserRole
  name?: string
  designation?: string
  experience?: string
  degree?: string
  photoURL?: string
  bio?: string
  specializations?: string
  languages?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  chatRate?: number
  appointmentRate?: number
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, role: UserRole, userData: Partial<UserData>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<UserData>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, role: UserRole, userData: Partial<UserData>) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const newUserData: UserData = {
        uid: user.uid,
        email: user.email,
        role,
        ...userData,
      }

      await setDoc(doc(db, "users", user.uid), newUserData)
      setUserData(newUserData)

      toast({
        title: "Account created successfully",
        description: "Welcome to LawEzy!",
      })

      router.push(role === "professional" ? "/professional/dashboard" : "/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Fetch user data to determine role for redirection
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        setUserData(userData)

        toast({
          title: "Signed in successfully",
          description: "Welcome back to LawEzy!",
        })

        // Redirect based on user role
        if (userData.role === "professional") {
          router.push("/professional/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
      toast({
        title: "Signed out successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      })
    }
  }

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return

    try {
      const updatedData = { ...userData, ...data }
      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true })
      setUserData(updatedData as UserData)

      toast({
        title: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      })
    }
  }

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    logout,
    updateUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
