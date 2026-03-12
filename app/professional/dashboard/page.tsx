"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, FileText, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Appointment {
  id: string
  userId: string
  userName: string
  date: any
  startTime: string
  endTime: string
  type: "online" | "in-person"
  status: "pending" | "confirmed" | "rejected" | "completed"
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: any
  read: boolean
  senderName?: string
}

export default function ProfessionalDashboardPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    upcomingAppointments: 0,
    newMessages: 0,
    resources: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && userData?.role === "user") {
      router.push("/dashboard")
    }

    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch appointments
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("professionalId", "==", user.uid),
          orderBy("date", "asc"),
          limit(5),
        )

        const appointmentsSnapshot = await getDocs(appointmentsQuery)
        const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[]

        setAppointments(appointmentsData)

        // Fetch messages - MODIFIED QUERY to avoid composite index requirement
        // Instead of filtering by receiverId and ordering by timestamp,
        // we'll just filter by receiverId and handle sorting in JavaScript
        const messagesQuery = query(
          collection(db, "messages"),
          where("receiverId", "==", user.uid),
          limit(10), // Fetch more messages since we'll filter them client-side
        )

        const messagesSnapshot = await getDocs(messagesQuery)
        let messagesData = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]

        // Sort messages by timestamp in JavaScript
        messagesData = messagesData
          .sort((a, b) => {
            const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0
            const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0
            return timeB - timeA // Sort in descending order (newest first)
          })
          .slice(0, 4) // Take only the 4 most recent messages

        // Fetch sender names for messages
        const userIds = [...new Set(messagesData.map((msg) => msg.senderId))]
        const userPromises = userIds.map((id) => getDoc(doc(db, "users", id)))
        const userDocs = await Promise.all(userPromises)
        const userMap = new Map()

        userDocs.forEach((userDoc) => {
          if (userDoc.exists()) {
            userMap.set(userDoc.id, userDoc.data().name)
          }
        })

        // Add sender names to messages
        const messagesWithNames = messagesData.map((msg) => ({
          ...msg,
          senderName: userMap.get(msg.senderId) || "Unknown User",
        }))

        setMessages(messagesWithNames)

        // Calculate stats
        const pendingCount = appointmentsData.filter((app) => app.status === "pending").length
        const upcomingCount = appointmentsData.filter((app) => app.status === "confirmed").length
        const unreadCount = messagesData.filter((msg) => !msg.read).length

        // Count resources
        const resourcesQuery = query(collection(db, "resources"), where("uploadedBy.id", "==", user.uid))
        const resourcesSnapshot = await getDocs(resourcesQuery)

        setStats({
          pendingAppointments: pendingCount,
          upcomingAppointments: upcomingCount,
          newMessages: unreadCount,
          resources: resourcesSnapshot.size,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user) {
      fetchData()
    }
  }, [user, userData, loading, router])

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null // Will redirect in useEffect
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return "N/A"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    return formatDate(timestamp)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Pending Appointments"
          value={stats.pendingAppointments.toString()}
          description="Awaiting your confirmation"
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
        />
        <StatsCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments.toString()}
          description="Scheduled for this week"
          icon={<Calendar className="h-8 w-8 text-green-600" />}
        />
        <StatsCard
          title="New Messages"
          value={stats.newMessages.toString()}
          description="From potential clients"
          icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
        />
        <StatsCard
          title="Your Resources"
          value={stats.resources.toString()}
          description="Documents you've shared"
          icon={<FileText className="h-8 w-8 text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <Card className="h-full glass-card">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your schedule for the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <AppointmentItem
                      key={appointment.id}
                      id={appointment.id}
                      name={appointment.userName}
                      date={formatDate(appointment.date)}
                      time={`${appointment.startTime} - ${appointment.endTime}`}
                      type={appointment.type}
                      status={appointment.status}
                      userId={appointment.userId}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No appointments scheduled yet.</p>
                </div>
              )}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/appointments">View All Appointments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full glass-card">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest client inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageItem
                      key={message.id}
                      name={message.senderName || "Client"}
                      message={message.content}
                      time={formatTimeAgo(message.timestamp)}
                      userId={message.senderId}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No messages received yet.</p>
                </div>
              )}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/chat">View All Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL || "/placeholder.svg"}
                      alt={userData.name || "Profile"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Designation</p>
                  <p className="font-medium">{userData.designation || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointment Rate</p>
                  <p className="font-medium">₹{userData.appointmentRate || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chat Rate</p>
                  <p className="font-medium">₹{userData.chatRate || "Not specified"}</p>
                </div>
                <Button asChild className="mt-2 bg-blue-600 hover:bg-blue-500">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your professional services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Link href="/resources/upload">
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Upload Resource</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Link href="/blogs/create">
                  <BookOpen className="h-8 w-8 mb-2" />
                  <span>Write Blog Post</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Link href="/appointments/availability">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Set Availability</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Link href="/chat">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <span>View Messages</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function AppointmentItem({
  id,
  name,
  date,
  time,
  type,
  status,
  userId,
}: {
  id: string
  name: string
  date: string
  time: string
  type: "online" | "in-person"
  status: "confirmed" | "pending" | "rejected" | "completed"
  userId: string
}) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {date} • {time}
        </p>
        <p className="text-sm text-muted-foreground">{type === "online" ? "Online" : "In-person"}</p>
      </div>
      <div>
        {status === "pending" ? (
          <div className="flex gap-2">
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500">
              <Link href={`/appointments/${id}`}>Accept</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/appointments/${id}`}>View</Link>
            </Button>
          </div>
        ) : (
          <span className="text-sm font-medium text-green-600">Confirmed</span>
        )}
      </div>
    </div>
  )
}

function MessageItem({
  name,
  message,
  time,
  userId,
}: {
  name: string
  message: string
  time: string
  userId: string
}) {
  return (
    <div className="border-b pb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium">{name}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
      <Button asChild variant="link" className="p-0 h-auto mt-1 text-blue-600">
        <Link href={`/chat/${userId}`}>Reply</Link>
      </Button>
    </div>
  )
}
