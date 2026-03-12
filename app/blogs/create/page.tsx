"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { AlertCircle, FileImage, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateBlogPage() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Force render the navbar
  useState(() => {
    // This will force a re-render on client side
    const timer = setTimeout(() => {}, 0)
    return () => clearTimeout(timer)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to create a blog post")
      return
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      console.log("Starting blog creation process...")

      let imageUrl = ""

      // Upload image if provided
      if (coverImage) {
        console.log("Uploading cover image...")
        const imageRef = ref(storage, `blogs/${user.uid}/${Date.now()}-${coverImage.name}`)
        await uploadBytes(imageRef, coverImage)
        imageUrl = await getDownloadURL(imageRef)
        console.log("Image uploaded successfully:", imageUrl)
      }

      // Create blog post document
      console.log("Creating blog document...")
      const blogData = {
        title,
        content,
        imageUrl,
        authorId: user.uid,
        authorName: userData?.name || "Anonymous",
        authorPhotoURL: userData?.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "blogs"), blogData)
      console.log("Blog created successfully with ID:", docRef.id)

      toast({
        title: "Blog post created!",
        description: "Your blog post has been published successfully.",
      })

      router.push(`/blogs/${docRef.id}`)
    } catch (err) {
      console.error("Error creating blog:", err)
      setError("Failed to create blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Add MainNav directly to ensure it's visible */}
      <MainNav />

      <div className="container py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Blog Post</CardTitle>
            <CardDescription>Share your legal knowledge and insights with the community</CardDescription>
          </CardHeader>

          {error && (
            <CardContent className="pt-0">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileImage className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {coverImage && <span className="text-sm text-muted-foreground">{coverImage.name}</span>}
                </div>

                {imagePreview && (
                  <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Publishing..." : "Publish Blog Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
