"use client"

import type React from "react"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (userData?.role !== "admin") {
      router.push(userData?.role === "professional" ? "/professional/dashboard" : "/dashboard")
    }
  }, [user, userData, loading, router])

  if (loading || !user || userData?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
