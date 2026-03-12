"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Minimize2, Maximize2, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-provider"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

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

export function FloatingChat() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [recentChats, setRecentChats] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch recent chats when the component mounts
  useEffect(() => {
    if (!user) return

    const fetchRecentChats = async () => {
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

          return {
            id: userId,
            name: userData.name || userData.email?.split("@")[0] || "User",
            photoURL: userData.photoURL,
            email: userData.email,
            role: userData.role || "user",
            designation: userData.designation,
            chatRate: userData.chatRate || userData.rate,
          } as ChatUser
        })

        const users = (await Promise.all(userPromises)).filter(Boolean) as ChatUser[]
        setRecentChats(users)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching recent chats:", error)
        setIsLoading(false)
      }
    }

    fetchRecentChats()
  }, [user])

  // Set up real-time listener for messages when a user is selected
  useEffect(() => {
    if (!user || !selectedUser) return

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
            (message.senderId === user.uid && message.receiverId === selectedUser.id) ||
            (message.senderId === selectedUser.id && message.receiverId === user.uid),
        )

        setMessages(filteredMessages)

        // Scroll to bottom of messages
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      },
      (error) => {
        console.error("Error fetching messages:", error)
      },
    )

    return () => unsubscribe()
  }, [user, selectedUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUser || !message.trim() || isSending) return

    setIsSending(true)

    try {
      // Create a new message document in Firestore
      const messageData = {
        senderId: user.uid,
        receiverId: selectedUser.id,
        content: message.trim(),
        timestamp: serverTimestamp(),
        read: false,
        participants: [user.uid, selectedUser.id], // Add this array for easier querying
      }

      // Add the message to Firestore
      await addDoc(collection(db, "messages"), messageData)

      // Clear the input
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleUserSelect = (chatUser: ChatUser) => {
    setSelectedUser(chatUser)
    setMessages([])
  }

  const handleViewFullChat = () => {
    if (selectedUser) {
      router.push(`/chat/${selectedUser.id}`)
    }
  }

  if (!user) return null // Only show for logged-in users

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && !isMinimized && (
        <Card className="w-80 md:w-96 mb-2 shadow-lg">
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/logo.png" alt="Chat" />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{selectedUser ? selectedUser.name : "Recent Chats"}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {selectedUser ? (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-3 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      if (!msg.timestamp) return null
                      const timestamp = msg.timestamp.toDate ? msg.timestamp.toDate() : msg.timestamp

                      return (
                        <div
                          key={msg.id}
                          className={cn("flex", msg.senderId === user.uid ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-3",
                              msg.senderId === user.uid ? "bg-crimson-deep text-white" : "bg-muted",
                            )}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">{formatMessageTime(new Date(timestamp))}</p>
                          </div>
                        </div>
                      )
                    })
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
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-crimson-deep hover:bg-crimson-deep/90"
                      disabled={!message.trim() || isSending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* View full chat button */}
                <div className="p-2 border-t text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleViewFullChat}
                    className="text-xs text-muted-foreground"
                  >
                    View full conversation
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Recent chats list */}
                <div className="h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Loading chats...</p>
                    </div>
                  ) : recentChats.length > 0 ? (
                    <div className="divide-y">
                      {recentChats.map((chatUser) => (
                        <div
                          key={chatUser.id}
                          className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => handleUserSelect(chatUser)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={chatUser.photoURL || "/placeholder.svg"} alt={chatUser.name} />
                            <AvatarFallback>{chatUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{chatUser.name}</h3>
                              {chatUser.role === "professional" && chatUser.chatRate && (
                                <Badge variant="outline" className="text-xs">
                                  ₹{chatUser.chatRate}/hr
                                </Badge>
                              )}
                            </div>
                            {chatUser.designation && (
                              <p className="text-xs text-muted-foreground truncate">{chatUser.designation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-4">
                        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                        <p className="text-muted-foreground mb-4">
                          {userData?.role === "professional"
                            ? "You haven't received any messages from clients yet."
                            : "Start a conversation with a legal professional to get help."}
                        </p>
                        {userData?.role !== "professional" && (
                          <Button
                            onClick={() => router.push("/appointments")}
                            className="bg-crimson-deep hover:bg-crimson-deep/90"
                          >
                            Find a Professional
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isOpen && isMinimized && (
        <Card className="mb-2 shadow-lg">
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/logo.png" alt="Chat" />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">
                  {selectedUser ? `Chat with ${selectedUser.name}` : "Recent Chats"}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(false)} className="h-7 w-7">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      <Button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setIsMinimized(false)
            setSelectedUser(null)
          }
        }}
        className={cn(
          "rounded-full h-14 w-14 shadow-lg",
          isOpen ? "bg-gray-500 hover:bg-gray-600" : "bg-crimson-deep hover:bg-crimson-deep/90",
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  )
}
