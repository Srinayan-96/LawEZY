"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useAuth } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { toast } from "sonner"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useAuth()
    const [collapsed, setCollapsed] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut(auth)
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Failed to log out")
        }
    }

    const routes = [
        {
            label: "Dashboard",
            icon: Icons.dashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Projects",
            icon: Icons.projects,
            href: "/projects",
            color: "text-violet-500",
        },
        {
            label: "Messages",
            icon: Icons.chat,
            href: "/chat",
            color: "text-pink-700",
        },
        {
            label: "Team",
            icon: Icons.users,
            href: "/team",
            color: "text-orange-700",
        },
        {
            label: "Settings",
            icon: Icons.settings,
            href: "/settings",
        },
    ]

    return (
        <div
            className={cn(
                "relative flex flex-col h-full bg-slate-50 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300",
                collapsed ? "w-20" : "w-72",
                className
            )}
        >
            <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="bg-indigo-600 rounded-lg p-1">
                        <Icons.briefcase className="h-6 w-6 text-white" />
                    </div>
                    {!collapsed && <span className="font-heading tracking-tight">LawEzy</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto hidden lg:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <Icons.sidebarOpen className="h-4 w-4" /> : <Icons.sidebarClose className="h-4 w-4" />}
                </Button>
            </div>

            <ScrollArea className="flex-1 py-4">
                <div className="px-3 py-2">
                    {!collapsed && <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-slate-500 uppercase">Platform</h2>}
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 group",
                                    pathname === route.href
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                                        : "text-slate-600 dark:text-slate-400",
                                    collapsed ? "justify-center" : "justify-start"
                                )}
                            >
                                <route.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", route.color, pathname === route.href ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-900", collapsed ? "mr-0" : "mr-3")} />
                                {!collapsed && <span>{route.label}</span>}
                                {!collapsed && pathname === route.href && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-full pl-0 hover:bg-slate-100 dark:hover:bg-slate-800", collapsed ? "justify-center px-0" : "justify-start px-2")}>
                            <Avatar className="h-9 w-9 border border-indigo-100 dark:border-indigo-900">
                                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
                                    {user?.displayName?.[0] || user?.email?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="ml-3 text-left overflow-hidden">
                                    <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{user?.displayName || "User"}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            )}
                            {!collapsed && <Icons.moreVertical className="ml-auto h-4 w-4 text-slate-400" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Icons.user className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Icons.settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                            <Icons.logout className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
