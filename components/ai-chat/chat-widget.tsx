"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, X, Send, Sparkles, User, Bot, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your LawEzy AI assistant. I can help you find lawyers, answer questions about our services, or guide you through the platform. How can I help you today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            })

            const data = await response.json()

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "I'm sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error("Chat error:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting to the server. Please check your internet connection.",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickPrompt = (prompt: string) => {
        setInputValue(prompt)
        // Optional: auto-send
        // handleSendMessage() 
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto w-[350px] sm:w-[400px] h-[500px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border/50 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">LawEzy AI Assistant</h3>
                                    <p className="text-xs text-muted-foreground">Ask me anything</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-black/5"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full gap-2",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted/80 dark:bg-muted/50 backdrop-blur-sm rounded-tl-none border border-border/50"
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                                            <User className="h-4 w-4 text-secondary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex w-full gap-2 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                                        <motion.div
                                            className="w-2 h-2 bg-primary/50 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-primary/50 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-primary/50 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Prompts */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                                <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap bg-background/50 backdrop-blur-sm" onClick={() => handleQuickPrompt("Find me a lawyer")}>
                                    Find a Lawyer
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap bg-background/50 backdrop-blur-sm" onClick={() => handleQuickPrompt("Services offered")}>
                                    Services
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full text-xs whitespace-nowrap bg-background/50 backdrop-blur-sm" onClick={() => handleQuickPrompt("Contact info")}>
                                    Contact
                                </Button>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 pt-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="pr-12 rounded-full border-border/50 bg-white/80 dark:bg-slate-800/80 focus-visible:ring-primary shadow-sm"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 active:scale-95"
                                    disabled={!inputValue.trim() || isLoading}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "pointer-events-auto h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50",
                    isOpen ? "bg-secondary text-secondary-foreground rotate-90" : "bg-primary text-primary-foreground hover:scale-110"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </motion.button>
        </div>
    )
}
