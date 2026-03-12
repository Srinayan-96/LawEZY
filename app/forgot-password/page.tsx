"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSent(false)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (error) {
      console.error("Error sending reset email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 text-lg font-bold text-crimson-deep">
        LawEzy
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        {sent ? (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link. Check your
              inbox and spam folder.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-crimson-deep hover:bg-crimson-deep/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-crimson-deep">
          Sign in
        </Link>
      </p>
    </div>
  )
}
