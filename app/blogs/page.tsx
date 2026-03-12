"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { BookOpen, Heart, MessageSquare, Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    photoURL?: string
  }
  createdAt: any
  likes: number
  comments: number
  tags: string[]
  imageUrl?: string
}

export default function BlogsPage() {
  const { user, userData } = useAuth()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(20))

        const snapshot = await getDocs(blogsQuery)
        const blogData: BlogPost[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          // Ensure all blog posts have the required fields with defaults
          return {
            id: doc.id,
            title: data.title || "Untitled",
            content: data.content || "",
            excerpt: data.excerpt || "",
            author: {
              id: data.author?.id || "unknown",
              name: data.author?.name || "Unknown Author",
              photoURL: data.author?.photoURL,
            },
            createdAt: data.createdAt || { toDate: () => new Date() },
            likes: data.likes || 0,
            comments: data.comments || 0,
            tags: Array.isArray(data.tags) ? data.tags : [],
            imageUrl: data.imageUrl,
          } as BlogPost
        })

        setBlogs(blogData)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(blog.tags) && blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const featuredBlogs = blogs.slice(0, 3)
  const popularTags = ["Criminal Law", "Family Law", "Corporate Law", "Real Estate", "Immigration", "Tax Law"]

  // Helper function to check if a blog has a specific tag
  const hasTag = (blog: BlogPost, tag: string) => {
    return Array.isArray(blog.tags) && blog.tags.includes(tag)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Legal Blogs</h1>
            <p className="text-muted-foreground">Insights and updates from legal professionals</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blogs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {user && (
              <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href="/blogs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Featured Blogs */}
        {!searchQuery && !loading && featuredBlogs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <FeaturedBlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="criminal">Criminal Law</TabsTrigger>
                <TabsTrigger value="family">Family Law</TabsTrigger>
                <TabsTrigger value="corporate">Corporate Law</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading blog posts...</p>
                  </div>
                ) : filteredBlogs.length > 0 ? (
                  <div className="space-y-6">
                    {filteredBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No blog posts found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery
                        ? `No results for "${searchQuery}". Try a different search term.`
                        : "There are no blog posts yet."}
                    </p>
                    {user && (
                      <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                        <Link href="/blogs/create">Create Your First Post</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Other tabs would filter by category */}
              <TabsContent value="criminal">
                <div className="space-y-6">
                  {filteredBlogs
                    .filter((blog) => hasTag(blog, "Criminal Law"))
                    .map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="family">
                <div className="space-y-6">
                  {filteredBlogs
                    .filter((blog) => hasTag(blog, "Family Law"))
                    .map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="corporate">
                <div className="space-y-6">
                  {filteredBlogs
                    .filter((blog) => hasTag(blog, "Corporate Law"))
                    .map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">About Our Blog</h3>
                <p className="text-muted-foreground mb-4">
                  Our legal blog features insights from experienced professionals across various legal domains. Stay
                  informed with the latest legal news and expert analysis.
                </p>
                {!user && (
                  <CardFooter className="px-0 pt-4 pb-0">
                    <Button asChild className="w-full bg-crimson-deep hover:bg-crimson-deep/90">
                      <Link href="/signup">Join LawEzy</Link>
                    </Button>
                  </CardFooter>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogCard({ blog }: { blog: BlogPost }) {
  // Ensure we have valid data with fallbacks
  const authorName = blog.author?.name || "Unknown Author"
  const authorPhotoURL = blog.author?.photoURL
  const createdAt = blog.createdAt?.toDate ? new Date(blog.createdAt.toDate()).toLocaleDateString() : "Unknown date"
  const tags = Array.isArray(blog.tags) ? blog.tags : []

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {blog.imageUrl && (
          <div className="md:w-1/3">
            <img
              src={blog.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(blog.title)}`}
              alt={blog.title}
              className="h-48 md:h-full w-full object-cover"
            />
          </div>
        )}
        <div className={`p-6 ${blog.imageUrl ? "md:w-2/3" : "w-full"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorPhotoURL || "/placeholder.svg"} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{authorName}</p>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
          </div>

          <Link href={`/blogs/${blog.id}`} className="hover:underline">
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
          </Link>

          <p className="text-muted-foreground mb-4 line-clamp-2">{blog.excerpt || "No excerpt available"}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center text-sm text-muted-foreground">
                <Heart className="h-4 w-4 mr-1" />
                {blog.likes || 0}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                {blog.comments || 0}
              </span>
            </div>

            <Button asChild variant="link" className="p-0 h-auto text-crimson-deep">
              <Link href={`/blogs/${blog.id}`}>Read More</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function FeaturedBlogCard({ blog }: { blog: BlogPost }) {
  // Ensure we have valid data with fallbacks
  const authorName = blog.author?.name || "Unknown Author"
  const authorPhotoURL = blog.author?.photoURL

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 bg-muted">
        <img
          src={blog.imageUrl || `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(blog.title)}`}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorPhotoURL || "/placeholder.svg"} alt={authorName} />
            <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{authorName}</p>
        </div>

        <Link href={`/blogs/${blog.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
        </Link>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{blog.excerpt || "No excerpt available"}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center text-sm text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              {blog.likes || 0}
            </span>
            <span className="flex items-center text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-1" />
              {blog.comments || 0}
            </span>
          </div>

          <Button asChild variant="link" className="p-0 h-auto text-crimson-deep">
            <Link href={`/blogs/${blog.id}`}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
