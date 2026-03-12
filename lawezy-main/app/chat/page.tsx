"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare } from "lucide-react"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"

interface ChatUser {
  id: string
  name: string
  photoURL?: string
  email: string
  role: "user" | "professional"
  designation?: string
  chatRate?: number
  lastMessage?: string
  lastMessageTime?: any
  unreadCount?: number
}

export default function ChatPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    const fetchChatUsers = async () => {
      if (!user) return

      try {
        // Get all messages where the current user is a participant
        const messagesQuery = query(collection(db, "messages"), where("participants", "array-contains", user.uid))

        const messagesSnapshot = await getDocs(messagesQuery)
        const messages = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Extract unique user IDs from messages
        const userIds = new Set<string>()
        messages.forEach((message) => {
          if (message.senderId === user.uid) {
            userIds.add(message.receiverId)
          } else if (message.receiverId === user.uid) {
            userIds.add(message.senderId)
          }
        })

        // Fetch user data for each unique user ID
        const userPromises = Array.from(userIds).map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId))

          if (!userDoc.exists()) return null

          const userData = userDoc.data()

          // Find the last message between current user and this user
          const userMessages = messages.filter(
            (message) =>
              (message.senderId === user.uid && message.receiverId === userId) ||
              (message.senderId === userId && message.receiverId === user.uid),
          )

          // Sort messages by timestamp (newest first)
          userMessages.sort((a, b) => {
            const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0
            const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0
            return timeB - timeA
          })

          const lastMessage = userMessages[0]

          // Count unread messages
          const unreadCount = userMessages.filter((message) => message.senderId === userId && !message.read).length

          return {
            id: userId,
            name: userData.name || userData.email?.split("@")[0] || "User",
            photoURL: userData.photoURL,
            email: userData.email,
            role: userData.role || "user",
            designation: userData.designation,
            chatRate: userData.chatRate || userData.rate,
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessage?.timestamp,
            unreadCount,
          } as ChatUser
        })

        const users = (await Promise.all(userPromises)).filter(Boolean) as ChatUser[]

        // Sort users by last message time (newest first)
        users.sort((a, b) => {
          const timeA = a.lastMessageTime?.toMillis ? a.lastMessageTime.toMillis() : 0
          const timeB = b.lastMessageTime?.toMillis ? b.lastMessageTime.toMillis() : 0
          return timeB - timeA
        })

        setChatUsers(users)
      } catch (error) {
        console.error("Error fetching chat users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user) {
      fetchChatUsers()
    }
  }, [user, loading, router])

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return ""

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredUsers = chatUsers.filter((chatUser) => chatUser.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load your messages</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>

          <Card>
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">Loading conversations...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="divide-y">
                  {filteredUsers.map((chatUser) => (
                    <div
                      key={chatUser.id}
                      className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/chat/${chatUser.id}`)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chatUser.photoURL || "/placeholder.svg"} alt={chatUser.name} />
                          <AvatarFallback>{chatUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{chatUser.name}</h3>
                              {chatUser.unreadCount > 0 && (
                                <Badge className="bg-crimson-deep hover:bg-crimson-deep/90">
                                  {chatUser.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(chatUser.lastMessageTime)}
                            </span>
                          </div>
                          {chatUser.designation && (
                            <p className="text-xs text-muted-foreground">{chatUser.designation}</p>
                          )}
                          <p className="text-sm text-muted-foreground truncate mt-1">{chatUser.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm
                      ? "No conversations match your search"
                      : "Start chatting with legal professionals to get help"}
                  </p>
                  {userData?.role !== "professional" && (
                    <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                      <a href="/appointments">Find Professionals</a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
