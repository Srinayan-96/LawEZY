"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageSquare, Share } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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

interface Comment {
  id: string
  blogId: string
  userId: string
  userName: string
  userPhotoURL?: string
  content: string
  createdAt: any
}

export default function BlogDetailPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      if (!blogId) return

      try {
        // Fetch blog post
        const blogDoc = await getDoc(doc(db, "blogs", blogId))

        if (!blogDoc.exists()) {
          setError("Blog post not found")
          router.push("/blogs")
          return
        }

        const blogData = blogDoc.data()

        // Ensure all required fields exist with fallbacks
        const formattedBlog: BlogPost = {
          id: blogDoc.id,
          title: blogData.title || "Untitled",
          content: blogData.content || "",
          excerpt: blogData.excerpt || "",
          author: {
            id: blogData.author?.id || "unknown",
            name: blogData.author?.name || "Unknown Author",
            photoURL: blogData.author?.photoURL,
          },
          createdAt: blogData.createdAt || { toDate: () => new Date() },
          likes: blogData.likes || 0,
          comments: blogData.comments || 0,
          tags: Array.isArray(blogData.tags) ? blogData.tags : [],
          imageUrl: blogData.imageUrl,
        }

        setBlog(formattedBlog)

        // Fetch comments
        try {
          const commentsQuery = query(
            collection(db, "comments"),
            where("blogId", "==", blogId),
            orderBy("createdAt", "desc"),
          )

          const commentsSnapshot = await getDocs(commentsQuery)
          const commentsData = commentsSnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              blogId: data.blogId || blogId,
              userId: data.userId || "unknown",
              userName: data.userName || "Anonymous",
              userPhotoURL: data.userPhotoURL,
              content: data.content || "",
              createdAt: data.createdAt || { toDate: () => new Date() },
            }
          }) as Comment[]

          setComments(commentsData)
        } catch (commentError) {
          console.error("Error fetching comments:", commentError)
          // Don't fail the whole page if comments can't be loaded
          setComments([])
        }

        // Check if user has liked this post
        if (user) {
          try {
            const likesQuery = query(
              collection(db, "likes"),
              where("blogId", "==", blogId),
              where("userId", "==", user.uid),
            )

            const likesSnapshot = await getDocs(likesQuery)
            setHasLiked(!likesSnapshot.empty)
          } catch (likesError) {
            console.error("Error checking likes:", likesError)
            // Don't fail if likes check fails
            setHasLiked(false)
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setError("Failed to load the blog post")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the blog post. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogAndComments()
  }, [blogId, router, user])

  const handleLike = async () => {
    if (!user || !blog) return

    try {
      const likesQuery = query(collection(db, "likes"), where("blogId", "==", blogId), where("userId", "==", user.uid))

      const likesSnapshot = await getDocs(likesQuery)

      if (likesSnapshot.empty) {
        // User hasn't liked this post yet, so add a like
        await addDoc(collection(db, "likes"), {
          blogId,
          userId: user.uid,
          createdAt: serverTimestamp(),
        })

        // Update blog post like count
        await updateDoc(doc(db, "blogs", blogId), {
          likes: increment(1),
        })

        setBlog({
          ...blog,
          likes: blog.likes + 1,
        })

        setHasLiked(true)

        toast({
          title: "Post liked",
          description: "You've liked this blog post.",
        })
      } else {
        // User has already liked this post, so remove the like
        const likeDoc = likesSnapshot.docs[0]
        await likeDoc.ref.delete()

        // Update blog post like count
        await updateDoc(doc(db, "blogs", blogId), {
          likes: increment(-1),
        })

        setBlog({
          ...blog,
          likes: blog.likes - 1,
        })

        setHasLiked(false)

        toast({
          title: "Like removed",
          description: "You've removed your like from this blog post.",
        })
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like the post. Please try again.",
      })
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userData || !blog || !newComment.trim()) return

    setIsSubmitting(true)

    try {
      // Add comment to Firestore
      const commentRef = await addDoc(collection(db, "comments"), {
        blogId,
        userId: user.uid,
        userName: userData.name || user.email?.split("@")[0] || "Anonymous",
        userPhotoURL: userData.photoURL,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
      })

      // Update blog post comment count
      await updateDoc(doc(db, "blogs", blogId), {
        comments: increment(1),
      })

      // Add comment to local state with temporary timestamp
      const newCommentObj: Comment = {
        id: commentRef.id,
        blogId,
        userId: user.uid,
        userName: userData.name || user.email?.split("@")[0] || "Anonymous",
        userPhotoURL: userData.photoURL,
        content: newComment.trim(),
        createdAt: new Date(),
      }

      setComments([newCommentObj, ...comments])
      setNewComment("")

      // Update blog comment count in local state
      setBlog({
        ...blog,
        comments: blog.comments + 1,
      })

      toast({
        title: "Comment added",
        description: "Your comment has been added to the post.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add your comment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load the blog post</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Blog post not found</h2>
            <p className="text-sm text-muted-foreground mb-4">The blog post you're looking for doesn't exist</p>
            <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
              <a href="/blogs">Back to Blogs</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Back to blogs</span>
          </div>

          {blog.imageUrl && (
            <div className="w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <img src={blog.imageUrl || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags && blog.tags.length > 0 ? (
                blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Uncategorized</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={blog.author?.photoURL || "/placeholder.svg"} alt={blog.author?.name || "Author"} />
                  <AvatarFallback>{(blog.author?.name || "A").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{blog.author?.name || "Unknown Author"}</p>
                  <p className="text-sm text-muted-foreground">
                    {blog.createdAt && blog.createdAt.toDate
                      ? formatDate(new Date(blog.createdAt.toDate()))
                      : "Unknown date"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLike}>
                  <Heart className={`h-5 w-5 ${hasLiked ? "fill-crimson-deep text-crimson-deep" : ""}`} />
                  <span>{blog.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{blog.comments}</span>
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>

          <Card className="mb-10">
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {blog.content ? (
                  blog.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="mb-4">No content available for this blog post.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div id="comments-section" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Comments ({blog.comments || 0})</h2>

            {user ? (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <form onSubmit={handleAddComment}>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userData?.photoURL || "/placeholder.svg"} alt={userData?.name} />
                        <AvatarFallback>{(userData?.name || "U").charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-2"
                          rows={3}
                        />
                        <Button
                          type="submit"
                          className="bg-crimson-deep hover:bg-crimson-deep/90"
                          disabled={isSubmitting || !newComment.trim()}
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <p className="mb-4">Please sign in to leave a comment.</p>
                  <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                    <a href="/login">Sign In</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {comments && comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.userPhotoURL || "/placeholder.svg"} alt={comment.userName} />
                          <AvatarFallback>{comment.userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{comment.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {comment.createdAt &&
                                (comment.createdAt.toDate
                                  ? formatDate(new Date(comment.createdAt.toDate()))
                                  : formatDate(new Date(comment.createdAt)))}
                            </p>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No comments yet</h3>
                  <p className="text-muted-foreground">Be the first to share your thoughts on this post.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">About the Author</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={blog.author?.photoURL || "/placeholder.svg"}
                      alt={blog.author?.name || "Author"}
                    />
                    <AvatarFallback>{(blog.author?.name || "A").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{blog.author?.name || "Unknown Author"}</h3>
                    <p className="text-muted-foreground mb-4">
                      Legal professional with expertise in various aspects of law. Passionate about sharing knowledge
                      and helping others navigate legal challenges.
                    </p>
                    <Button asChild variant="outline">
                      <a href={`/chat/${blog.author?.id || "#"}`}>Message Author</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
