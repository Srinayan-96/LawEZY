"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/main-nav"
import { useRouter } from "next/navigation"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadResourcePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resourceData, setResourceData] = useState({
    title: "",
    description: "",
    category: "",
    tag: "",
    tags: [] as string[],
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && userData?.role !== "professional") {
      router.push("/resources")
    }
  }, [user, userData, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setResourceData((prev) => ({ ...prev, category: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const addTag = () => {
    if (resourceData.tag.trim() && !resourceData.tags.includes(resourceData.tag.trim())) {
      setResourceData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tag.trim()],
        tag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setResourceData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileType = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "unknown"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userData) return

    if (!resourceData.title.trim() || !resourceData.description.trim() || !resourceData.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      let fileUrl = ""
      let fileName = ""
      let fileType = ""
      let fileSize = ""

      // Upload file to storage if provided
      if (file) {
        const fileRef = ref(storage, `resources/${Date.now()}-${file.name}`)
        await uploadBytes(fileRef, file)
        fileUrl = await getDownloadURL(fileRef)
        fileName = file.name
        fileType = getFileType(file.name)
        fileSize = formatFileSize(file.size)
      }

      // Add resource to Firestore
      await addDoc(collection(db, "resources"), {
        title: resourceData.title,
        description: resourceData.description,
        category: resourceData.category,
        tags: resourceData.tags.length > 0 ? resourceData.tags : ["General"],
        fileUrl,
        fileName,
        fileType,
        fileSize,
        uploadedBy: {
          id: user.uid,
          name: userData.name || "Anonymous",
          photoURL: userData.photoURL || null,
        },
        createdAt: serverTimestamp(),
        downloads: 0,
      })

      router.push("/resources")
    } catch (error) {
      console.error("Error uploading resource:", error)
      alert("Failed to upload resource. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (!user || userData?.role !== "professional") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resource</CardTitle>
            <CardDescription>Share legal documents, templates, and guides with the community</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={resourceData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={resourceData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this resource contains and how it can be used"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={resourceData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legal Forms">Legal Forms</SelectItem>
                    <SelectItem value="Case Studies">Case Studies</SelectItem>
                    <SelectItem value="Legal Guides">Legal Guides</SelectItem>
                    <SelectItem value="Templates">Templates</SelectItem>
                    <SelectItem value="Research Papers">Research Papers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  {file ? (
                    <div className="text-center">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-crimson-deep" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatFileSize(file.size)} • {getFileType(file.name).toUpperCase()}
                      </p>
                      <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="mb-1 font-medium">Drag and drop your file here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                      </p>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" onClick={() => document.getElementById("file")?.click()}>
                        Browse Files
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tag"
                    name="tag"
                    value={resourceData.tag}
                    onChange={handleInputChange}
                    placeholder="Add tags (e.g., Contract, Employment, Property)"
                    onKeyDown={handleTagKeyDown}
                  />
                  <Button type="button" onClick={addTag} className="bg-crimson-deep hover:bg-crimson-deep/90">
                    Add
                  </Button>
                </div>
                {resourceData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resourceData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-crimson-deep hover:bg-crimson-deep/90" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload Resource"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
