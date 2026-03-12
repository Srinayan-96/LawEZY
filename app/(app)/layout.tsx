"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Icons } from "@/components/icons"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Icons.spinner className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
            <Sidebar className="hidden md:flex" />
            <main className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-950/50">
                {children}
            </main>
        </div>
    )
}
