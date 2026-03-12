"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, FileText, Home, LogOut, MessageSquare, User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function MainNav() {
  const { user, userData, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  const isProfessional = userData?.role === "professional"
  const dashboardPath = isProfessional ? "/professional/dashboard" : "/dashboard"

  const navItems = [
    {
      name: "Home",
      href: dashboardPath,
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Blogs",
      href: "/blogs",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Resources",
      href: "/resources",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "AI Chat",
      href: "/ai-chat",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
  ]

  const userInitials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const mobileNav = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4 py-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setOpen(false)}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3">
      <div className="flex items-center gap-6">
        <Link href={dashboardPath} className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="LawEzy Logo" className="h-12 w-8 object-cover" />
          <span className="text-xl font-bold text-crimson-deep">LawEzy</span>
        </Link>

        {mobileNav}

        <nav className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.photoURL || ""} alt={userData?.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
