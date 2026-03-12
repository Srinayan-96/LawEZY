"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignUpPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // User form state
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userConfirmPassword, setUserConfirmPassword] = useState("")

  // Professional form state
  const [proEmail, setProEmail] = useState("")
  const [proName, setProName] = useState("")
  const [proPassword, setProPassword] = useState("")
  const [proConfirmPassword, setProConfirmPassword] = useState("")
  const [proDesignation, setProDesignation] = useState("")
  const [proRate, setProRate] = useState("")
  const [proExperience, setProExperience] = useState("")
  const [proDegree, setProDegree] = useState("")

  const handleUserSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userPassword !== userConfirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await signUp(userEmail, userPassword, "user", {
        name: userName,
      })
    } catch (error) {
      console.error("Error during user signup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (proPassword !== proConfirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await signUp(proEmail, proPassword, "professional", {
        name: proName,
        designation: proDesignation,
        rate: Number.parseFloat(proRate),
        experience: proExperience,
        degree: proDegree,
      })
    } catch (error) {
      console.error("Error during professional signup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Link 
        href="/" 
        className="absolute left-4 top-4 sm:left-8 sm:top-8 text-lg font-bold text-crimson-deep"
      >
        LawEzy
      </Link>

      <div className="w-full max-w-md space-y-6">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Regular User</TabsTrigger>
            <TabsTrigger value="professional">Legal Professional</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create User Account</CardTitle>
                <CardDescription className="text-center text-sm">
                  Sign up as a regular user to access legal services
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUserSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input
                      id="user-name"
                      placeholder="John Doe"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="john@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-confirm-password">Confirm Password</Label>
                    <Input
                      id="user-confirm-password"
                      type="password"
                      value={userConfirmPassword}
                      onChange={(e) => setUserConfirmPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-crimson-deep hover:bg-crimson-deep/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create Professional Account</CardTitle>
                <CardDescription className="text-center text-sm">
                  Sign up as a legal professional to offer your services
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pro-name">Full Name</Label>
                    <Input
                      id="pro-name"
                      placeholder="Jane Smith"
                      value={proName}
                      onChange={(e) => setProName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-email">Email</Label>
                    <Input
                      id="pro-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={proEmail}
                      onChange={(e) => setProEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-designation">Designation</Label>
                    <Input
                      id="pro-designation"
                      placeholder="Attorney, Paralegal, etc."
                      value={proDesignation}
                      onChange={(e) => setProDesignation(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-degree">Degree/Qualification</Label>
                    <Input
                      id="pro-degree"
                      placeholder="J.D., LL.B., etc."
                      value={proDegree}
                      onChange={(e) => setProDegree(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-experience">Years of Experience</Label>
                    <Input
                      id="pro-experience"
                      placeholder="5 years"
                      value={proExperience}
                      onChange={(e) => setProExperience(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-rate">Hourly Rate ($)</Label>
                    <Input
                      id="pro-rate"
                      type="number"
                      placeholder="150"
                      value={proRate}
                      onChange={(e) => setProRate(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-password">Password</Label>
                    <Input
                      id="pro-password"
                      type="password"
                      value={proPassword}
                      onChange={(e) => setProPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-confirm-password">Confirm Password</Label>
                    <Input
                      id="pro-confirm-password"
                      type="password"
                      value={proConfirmPassword}
                      onChange={(e) => setProConfirmPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-crimson-deep hover:bg-crimson-deep/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-crimson-deep">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}