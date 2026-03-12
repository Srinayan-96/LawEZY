import type React from "react"
import { MainNav } from "@/components/main-nav"
import { cookies } from "next/headers"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, we would check the session cookie here
  // For now, we'll just simulate this check
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  // This is just a placeholder - in a real app, you'd verify the session
  // If no valid session, redirect to login
  // if (!sessionCookie) {
  //   redirect("/login")
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
