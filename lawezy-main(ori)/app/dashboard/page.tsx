"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, orderBy, limit, where, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
  }
  createdAt: any
  imageUrl?: string
}

export default function DashboardPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState({
    professionals: 0,
    resources: 0,
    blogs: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && userData?.role === "professional") {
      router.push("/professional/dashboard")
    }

    const fetchData = async () => {
      try {
        // Fetch recent blog posts
        const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(3))
        const snapshot = await getDocs(blogsQuery)
        const blogData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[]
        setBlogPosts(blogData)

        // Fetch stats
        const professionalCountQuery = query(collection(db, "users"), where("role", "==", "professional"))
        const professionalCount = await getCountFromServer(professionalCountQuery)

        const resourcesCountQuery = query(collection(db, "resources"))
        const resourcesCount = await getCountFromServer(resourcesCountQuery)

        const blogsCountQuery = query(collection(db, "blogs"))
        const blogsCount = await getCountFromServer(blogsCountQuery)

        setStats({
          professionals: professionalCount.data().count,
          resources: resourcesCount.data().count,
          blogs: blogsCount.data().count,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      fetchData()
    }
  }, [user, userData, loading, router])

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return null // Will redirect in useEffect
  }

  // Get user's display name - use email or "User" as fallback if name is not available
  const displayName = userData.name || (user.email ? user.email.split("@")[0] : "User")

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {displayName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Legal Professionals"
          value={stats.professionals > 0 ? `${stats.professionals}+` : "Loading..."}
          description="Available for consultation"
          icon={<Calendar className="h-8 w-8 text-crimson-deep" />}
        />
        <StatsCard
          title="Resources"
          value={stats.resources > 0 ? `${stats.resources}+` : "Loading..."}
          description="Legal documents and guides"
          icon={<FileText className="h-8 w-8 text-crimson-deep" />}
        />
        <StatsCard
          title="Blog Articles"
          value={stats.blogs > 0 ? `${stats.blogs}+` : "Loading..."}
          description="Expert legal insights"
          icon={<BookOpen className="h-8 w-8 text-crimson-deep" />}
        />
        <StatsCard
          title="AI Responses"
          value="24/7"
          description="Instant legal assistance"
          icon={<MessageSquare className="h-8 w-8 text-crimson-deep" />}
        />
      </div>

      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ActionCard
          title="Find a Legal Professional"
          description="Browse and connect with experienced legal professionals"
          icon={<Calendar className="h-12 w-12 text-crimson-deep" />}
          href="/appointments"
        />
        <ActionCard
          title="Ask Legal Questions"
          description="Get instant answers from our AI legal assistant"
          icon={<MessageSquare className="h-12 w-12 text-crimson-deep" />}
          href="/ai-chat"
        />
        <ActionCard
          title="Browse Resources"
          description="Access legal documents, templates, and guides"
          icon={<FileText className="h-12 w-12 text-crimson-deep" />}
          href="/resources"
        />
      </div>

      <h2 className="text-2xl font-bold mb-6">Recent Blog Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.length > 0 ? (
          blogPosts.map((blog) => (
            <BlogPreview
              key={blog.id}
              title={blog.title}
              excerpt={blog.excerpt || "No excerpt available"}
              author={blog.author?.name || "Unknown Author"}
              date={blog.createdAt?.toDate ? new Date(blog.createdAt.toDate()).toLocaleDateString() : "Unknown date"}
              href={`/blogs/${blog.id}`}
              imageUrl={blog.imageUrl}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function ActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6 pb-0 flex justify-center">{icon}</CardHeader>
      <CardContent className="p-6 text-center">
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
          <Link href={href}>Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function BlogPreview({
  title,
  excerpt,
  author,
  date,
  href,
  imageUrl,
}: {
  title: string
  excerpt: string
  author: string
  date: string
  href: string
  imageUrl?: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted">
        <img
          src={imageUrl || `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(title)}`}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{author}</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <Button asChild variant="link" className="p-0 h-auto mt-2 text-crimson-deep">
          <Link href={href}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
