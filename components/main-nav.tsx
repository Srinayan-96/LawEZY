"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Home, LogOut, MessageSquare, User, Menu, LayoutDashboard } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Icons } from "@/components/icons"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export function MainNav() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Optional: redirect to home handled by auth state change usually, or manual:
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      hidden: !user
    },
    {
      name: "Services",
      href: "/#services",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "AI Chat",
      href: "/chat",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      hidden: !user
    },
  ]

  const mobileNav = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 py-8">
          <div className="px-4 mb-4">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <div className="bg-indigo-600 rounded-lg p-1">
                <Icons.briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">LawEzy</span>
            </Link>
          </div>
          {navItems.filter(item => !item.hidden).map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "default" : "ghost"}
              className={cn("justify-start text-base h-12", isActive(item.href) ? "bg-indigo-600 text-white" : "")}
              onClick={() => setOpen(false)}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
          {!user && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" asChild onClick={() => setOpen(false)}>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled || pathname !== "/" ? "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm dark:bg-slate-950/80 dark:border-slate-800" : "bg-transparent text-slate-900 dark:text-white"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 rounded-lg p-1">
              <Icons.briefcase className="h-6 w-6 text-white" />
            </div>
            <span className={cn("text-xl font-bold", scrolled || pathname !== "/" ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white")}>LawEzy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.filter(item => !item.hidden).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                  <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-indigo-900">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-indigo-600 text-white">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  "text-sm font-medium px-4 py-2 transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
              >
                Log in
              </Link>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
          {mobileNav}
        </div>
      </div>
    </motion.header>
  )
}
