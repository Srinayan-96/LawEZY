"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, AlertTriangle, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isError?: boolean
}

const GEMINI_API_KEY = "AIzaSyCO7vPere2D1laCK44W3UT3uSaWJ642-AA" // WARNING: Store this in environment variables (e.g., process.env.GEMINI_API_KEY) in production
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a legal assistant providing general legal information, not legal advice. Answer the following question clearly and concisely, and include a disclaimer that this is not a substitute for consulting a qualified attorney: ${prompt}`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error("No response text received from Gemini API")
    }

    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}

export default function AIChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI legal assistant. How can I help you with your legal questions today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    setError(null)

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateGeminiResponse(input)

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error in chat interaction:", error)

      const errorMessage: Message = {
        role: "system",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
        isError: true,
      }

      setMessages((prev) => [...prev, errorMessage])
      setError("There was a problem with the AI service. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <MainNav />
      <div className="container py-4 md:py-10 flex-1 flex flex-col px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive" className="mb-4 max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 flex-1">
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-180px)] md:h-auto">
            <Card className="flex-1 flex flex-col shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">AI Legal Assistant</CardTitle>
                    <CardDescription className="text-sm">
                      Ask any legal questions and get instant answers
                    </CardDescription>
                  </div>
                  <Avatar className="h-10 w-10 bg-crimson-deep text-primary-foreground">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pb-0">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {message.role === "assistant" || message.role === "system" ? (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                              <AvatarFallback
                                className={`${message.isError ? "bg-destructive" : "bg-crimson-deep"} text-primary-foreground`}
                              >
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                              <AvatarFallback className="bg-muted">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="space-y-1">
                          <div
                            className={`rounded-lg p-3 text-sm md:text-base ${
                              message.role === "user"
                                ? "bg-crimson-deep text-primary-foreground"
                                : message.isError
                                  ? "bg-destructive/10 border border-destructive/20"
                                  : "bg-muted"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className={`text-xs text-muted-foreground ${message.role === "user" ? "text-right" : ""}`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-crimson-deep text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1 bg-muted p-3 rounded-lg">
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <form onSubmit={handleSubmit} className="w-full flex gap-2">
                  <Input
                    placeholder="Type your legal question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-crimson-deep hover:bg-crimson-deep/90"
                  >
                    <Send className="h-4 w-4 md:mr-2" />
                    <span className="sr-only md:not-sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>

          <div className="order-first lg:order-last lg:col-span-1">
            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Suggested Topics</CardTitle>
                  <CardDescription className="text-sm">Common legal questions you can ask</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <SuggestedQuestion
                      question="What are my rights as a tenant?"
                      onClick={() => setInput("What are my rights as a tenant?")}
                    />
                    <SuggestedQuestion
                      question="How do I file for divorce?"
                      onClick={() => setInput("How do I file for divorce?")}
                    />
                    <SuggestedQuestion
                      question="What is the process for creating a will?"
                      onClick={() => setInput("What is the process for creating a will?")}
                    />
                    <SuggestedQuestion
                      question="What should I do after a car accident?"
                      onClick={() => setInput("What should I do after a car accident?")}
                    />
                    <SuggestedQuestion
                      question="How can I start a small business?"
                      onClick={() => setInput("How can I start a small business?")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This AI assistant provides general legal information and not legal advice. The information provided
                    is not a substitute for consultation with a qualified attorney. For specific legal advice, please
                    consult with a legal professional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestedQuestion({ question, onClick }: { question: string; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
      onClick={onClick}
    >
      {question}
    </Button>
  )
}