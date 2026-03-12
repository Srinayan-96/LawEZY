import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatWidget } from "@/components/ai-chat/chat-widget"
// import { FloatingChat } from "@/components/floating-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LawEzy - Legal Services Platform",
  description: "Connect with legal professionals and access legal resources",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <ChatWidget />
            {/* <FloatingChat /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
