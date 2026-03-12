"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, addDoc, serverTimestamp, doc, getDoc, onSnapshot } from "firebase/firestore"
import { useRouter, useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface ChatUser {
  id: string
  name: string
  photoURL?: string
  email: string
  role: "user" | "professional"
  designation?: string
  chatRate?: number
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: any
  read: boolean
}

export default function ChatDetailPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const otherUserId = params.id as string

  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const fetchOtherUser = async () => {
      if (!otherUserId) return

      try {
        const userDoc = await getDoc(doc(db, "users", otherUserId))

        if (!userDoc.exists()) {
          toast({
            variant: "destructive",
            title: "User not found",
            description: "The user you're trying to chat with doesn't exist.",
          })
          router.push("/chat")
          return
        }

        const userData = {
          id: userDoc.id,
          ...userDoc.data(),
          // Ensure these fields exist with defaults if not present
          name: userDoc.data().name || userDoc.data().email?.split("@")[0] || "User",
          role: userDoc.data().role || "user",
        } as ChatUser

        setOtherUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user details. Please try again.",
        })
      }
    }

    if (!loading && user) {
      fetchOtherUser()
    }
  }, [user, otherUserId, loading, router])

  useEffect(() => {
    if (!user || !otherUser) return

    // Set up real-time listener for messages
    const messagesQuery = query(
      collection(db, "messages"),
      where("participants", "array-contains", user.uid),
      orderBy("timestamp", "asc"),
    )

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]

        // Filter messages that are between the current user and the selected user
        const filteredMessages = allMessages.filter(
          (message) =>
            (message.senderId === user.uid && message.receiverId === otherUserId) ||
            (message.senderId === otherUserId && message.receiverId === user.uid),
        )

        setMessages(filteredMessages)
        setIsLoading(false)

        // Scroll to bottom of messages
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      },
      (error) => {
        console.error("Error fetching messages:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user, otherUser, otherUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !otherUser || !newMessage.trim() || isSending) return

    setIsSending(true)

    try {
      // Create a new message document in Firestore
      const messageData = {
        senderId: user.uid,
        receiverId: otherUser.id,
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false,
        participants: [user.uid, otherUser.id], // Add this array for easier querying
      }

      // Add the message to Firestore
      await addDoc(collection(db, "messages"), messageData)

      // Clear the input
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send your message. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000

    if (diff < oneDay) {
      return "Today"
    } else if (diff < 2 * oneDay) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    }
  }

  const handleBookAppointment = () => {
    if (otherUser && otherUser.role === "professional") {
      router.push(`/appointments/book/${otherUser.id}`)
    }
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {}
  messages.forEach((message) => {
    if (!message.timestamp) return

    const timestamp = message.timestamp.toDate ? message.timestamp.toDate() : message.timestamp
    const dateStr = formatMessageDate(new Date(timestamp))

    if (!groupedMessages[dateStr]) {
      groupedMessages[dateStr] = []
    }
    groupedMessages[dateStr].push(message)
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load the conversation</p>
          </div>
        </div>
      </div>
    )
  }

  if (!otherUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">User not found</h2>
            <p className="text-sm text-muted-foreground mb-4">The user you're trying to chat with doesn't exist</p>
            <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
              <a href="/chat">Back to Messages</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-6 md:py-10 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="px-4 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button variant="outline" size="icon" onClick={() => router.push("/chat")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser.photoURL || "/placeholder.svg"} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{otherUser.name}</h3>
                      {otherUser.role === "professional" && otherUser.chatRate && (
                        <Badge variant="outline" className="text-xs">
                          ₹{otherUser.chatRate}/hr
                        </Badge>
                      )}
                    </div>
                    {otherUser.designation && <p className="text-xs text-muted-foreground">{otherUser.designation}</p>}
                  </div>
                </div>
              </div>

              {/* Book appointment button - only show if the other user is a professional and current user is not */}
              {otherUser.role === "professional" && userData?.role !== "professional" && (
                <Button
                  onClick={handleBookAppointment}
                  className="bg-crimson-deep hover:bg-crimson-deep/90 flex items-center gap-2 w-full sm:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {Object.entries(groupedMessages).length > 0 ? (
                  Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-3">
                      <div className="flex justify-center">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{date}</span>
                      </div>

                      {dateMessages.map((message) => {
                        if (!message.timestamp) return null

                        const timestamp = message.timestamp.toDate ? message.timestamp.toDate() : message.timestamp

                        return (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.uid ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex gap-2 max-w-[80%] ${message.senderId === user?.uid ? "flex-row-reverse" : ""}`}
                            >
                              {message.senderId !== user?.uid && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={otherUser.photoURL || "/placeholder.svg"} alt={otherUser.name} />
                                  <AvatarFallback>{otherUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div
                                  className={`rounded-lg p-3 ${
                                    message.senderId === user?.uid ? "bg-crimson-deep text-white" : "bg-muted"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p
                                  className={`text-xs text-muted-foreground mt-1 ${
                                    message.senderId === user?.uid ? "text-right" : ""
                                  }`}
                                >
                                  {formatMessageTime(new Date(timestamp))}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No messages yet</p>
                      <p className="text-sm">Start the conversation by sending a message below</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                  />
                  <Button
                    type="submit"
                    className="bg-crimson-deep hover:bg-crimson-deep/90"
                    disabled={!newMessage.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
