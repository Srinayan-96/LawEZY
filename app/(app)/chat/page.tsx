"use client"

import { useState, useEffect, useRef } from "react"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    text: string
    createdAt: Timestamp
    uid: string
    displayName: string
    photoURL: string
}

export default function ChatPage() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user) return

        const q = query(collection(db, "messages"), orderBy("createdAt", "asc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = []
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as Message)
            })
            setMessages(msgs)
            // Scroll to bottom on new message
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        })

        return () => unsubscribe()
    }, [user])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        setIsLoading(true)
        try {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                createdAt: serverTimestamp(),
                uid: user.uid,
                displayName: user.displayName || "User",
                photoURL: user.photoURL || "",
            })
            setNewMessage("")
        } catch (error) {
            toast.error("Failed to send message")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Team Chat</h1>
                    <p className="text-sm text-slate-500">Real-time collaboration</p>
                </div>
                <div className="flex -space-x-2">
                    {/* Placeholder for online users */}
                    <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-950 bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        +3
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => {
                    const isMe = msg.uid === user?.uid
                    return (
                        <div key={msg.id} className={cn("flex w-full gap-3", isMe ? "justify-end" : "justify-start")}>
                            {!isMe && (
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={msg.photoURL} />
                                    <AvatarFallback className="text-xs">{msg.displayName[0]}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "flex flex-col max-w-[70%]",
                                isMe ? "items-end" : "items-start"
                            )}>
                                {!isMe && <span className="text-xs text-slate-500 mb-1 ml-1">{msg.displayName}</span>}
                                <div
                                    className={cn(
                                        "px-4 py-2 rounded-2xl text-sm shadow-sm",
                                        isMe
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700"
                                    )}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 mx-1">
                                    {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sending..."}
                                </span>
                            </div>
                            {isMe && (
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={user?.photoURL || ""} />
                                    <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">{user?.displayName?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !newMessage.trim()}
                        className="h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : <Icons.chat className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}
