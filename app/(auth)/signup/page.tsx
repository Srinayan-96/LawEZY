"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, {
                displayName: name,
            })
            toast.success("Account created successfully!")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Failed to create account")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        const provider = new GoogleAuthProvider()

        try {
            await signInWithPopup(auth, provider)
            toast.success("Welcome!")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message || "Failed to sign up with Google")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
            <Card className="w-full max-w-md border-0 shadow-xl ring-1 ring-slate-900/5 sm:rounded-xl sm:border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-11">
                            {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4" />
                            )}
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground dark:bg-slate-950">Or continue with</span>
                        </div>
                    </div>
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    autoCapitalize="words"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={isLoading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <Button disabled={isLoading} className="h-11 w-full bg-indigo-600 hover:bg-indigo-700">
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Account
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
