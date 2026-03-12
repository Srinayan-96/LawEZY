"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { ExternalLink, Users, Calendar, MessageSquare, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

interface UserRow {
  id: string
  email: string
  name?: string
  role: string
  designation?: string
}

interface AppointmentRow {
  id: string
  professionalName: string
  userName: string
  date: any
  startTime: string
  status: string
  type: string
}

const FIREBASE_CONSOLE_URL = "https://console.firebase.google.com/project/lawezy-83e32/firestore"

export default function AdminPage() {
  const { userData } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [messagesCount, setMessagesCount] = useState<number | null>(null)
  const [blogsCount, setBlogsCount] = useState<number | null>(null)
  const [resourcesCount, setResourcesCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"))
        const usersData: UserRow[] = usersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<UserRow, "id">),
        }))
        setUsers(usersData)

        const appointmentsSnap = await getDocs(
          query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(50))
        )
        const appointmentsData: AppointmentRow[] = appointmentsSnap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            professionalName: data.professionalName ?? "",
            userName: data.userName ?? "",
            date: data.date,
            startTime: data.startTime ?? "",
            status: data.status ?? "",
            type: data.type ?? "",
          }
        })
        setAppointments(appointmentsData)

        const messagesSnap = await getDocs(collection(db, "messages"))
        setMessagesCount(messagesSnap.size)

        const blogsSnap = await getDocs(collection(db, "blogs"))
        setBlogsCount(blogsSnap.size)

        const resourcesSnap = await getDocs(collection(db, "resources"))
        setResourcesCount(resourcesSnap.size)
      } catch (e) {
        console.error("Admin fetch error:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—"
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return d.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container py-10">
        <p className="text-muted-foreground">Loading database view...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin – Database View</h1>
          <p className="text-muted-foreground">
            View app data and open Firebase Console to edit the database directly.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 shrink-0">
          <a href={FIREBASE_CONSOLE_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Firebase Console (Firestore)
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Clients + Professionals + Admins</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">Last 50 in list below</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesCount ?? "—"}</div>
            <p className="text-xs text-muted-foreground">Chat messages</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blogs & Resources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {blogsCount ?? "—"} / {resourcesCount ?? "—"}
            </div>
            <p className="text-xs text-muted-foreground">Blogs / Resources</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Users (from Firestore)</CardTitle>
            <CardDescription>All users. To make someone Admin: open Firebase Console → users → their doc → set role to &quot;admin&quot;.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users yet.</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{u.name || u.email || u.id}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant={u.role === "admin" ? "default" : u.role === "professional" ? "secondary" : "outline"}>
                      {u.role}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Appointments (last 50)</CardTitle>
            <CardDescription>From Firestore appointments collection.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments yet.</p>
              ) : (
                appointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{a.professionalName} → {a.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(a.date)} · {a.startTime} · {a.type}
                      </p>
                    </div>
                    <Badge variant={a.status === "confirmed" ? "default" : a.status === "pending" ? "secondary" : "outline"}>
                      {a.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 glass-card">
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
          <CardDescription>AI Chat (chatbot), Chat (messaging), and dashboards.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/ai-chat">AI Chat (Legal Q&A)</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/chat">Chat (Messages)</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Client Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/professional/dashboard">Professional Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
