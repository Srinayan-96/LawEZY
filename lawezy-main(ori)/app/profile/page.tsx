"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User, MapPin, IndianRupee } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ProfilePage() {
  const { user, userData, loading, updateUserData } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    email: "",
    bio: "",
    photoURL: "",

    // Professional Details
    designation: "",
    experience: "",
    degree: "",
    specializations: "",
    languages: "",

    // Location & Rates
    address: "",
    city: "",
    state: "",
    pincode: "",
    chatRate: "",
    appointmentRate: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        photoURL: userData.photoURL || "",
        designation: userData.designation || "",
        experience: userData.experience || "",
        degree: userData.degree || "",
        specializations: userData.specializations || "",
        languages: userData.languages || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        pincode: userData.pincode || "",
        chatRate: userData.chatRate?.toString() || userData.rate?.toString() || "",
        appointmentRate: userData.appointmentRate?.toString() || userData.rate?.toString() || "",
      })
    }
  }, [user, userData, loading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    try {
      let photoURL = formData.photoURL

      // Upload photo if a new one was selected
      if (photoFile) {
        const storage = getStorage()
        const storageRef = ref(storage, `profile-photos/${user.uid}`)
        await uploadBytes(storageRef, photoFile)
        photoURL = await getDownloadURL(storageRef)
      }

      // Prepare data for update
      const updatedData = {
        ...formData,
        photoURL,
        chatRate: formData.chatRate ? Number.parseFloat(formData.chatRate) : null,
        appointmentRate: formData.appointmentRate ? Number.parseFloat(formData.appointmentRate) : null,
      }

      // Update in Firestore
      await updateDoc(doc(db, "users", user.uid), updatedData)

      // Update in auth context
      await updateUserData(updatedData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update your profile. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load your profile</p>
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
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Professional Details</span>
                <span className="sm:hidden">Professional</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Location & Rates</span>
                <span className="sm:hidden">Location</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile photo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-32 w-32">
                          <AvatarImage
                            src={photoPreview || formData.photoURL || "/placeholder.svg"}
                            alt={formData.name}
                          />
                          <AvatarFallback className="text-2xl">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-center">
                          <Label
                            htmlFor="photo"
                            className="cursor-pointer bg-muted hover:bg-muted/80 px-3 py-2 rounded-md flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Photo
                          </Label>
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF, max 2MB</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              disabled
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              placeholder="Tell us about yourself"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                    <CardDescription>Add your professional information to help clients find you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Senior Advocate"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g. 5 years"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree/Qualification</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        placeholder="e.g. LLB, National Law School"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specializations">Specializations</Label>
                      <Textarea
                        id="specializations"
                        name="specializations"
                        value={formData.specializations}
                        onChange={handleInputChange}
                        placeholder="e.g. Corporate Law, Family Law, etc."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g. English, Hindi, Tamil"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Rates</CardTitle>
                    <CardDescription>Add your location details and consultation rates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chatRate" className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          Chat Rate (per hour)
                        </Label>
                        <Input
                          id="chatRate"
                          name="chatRate"
                          type="number"
                          value={formData.chatRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 1000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appointmentRate" className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          Appointment Rate (per hour)
                        </Label>
                        <Input
                          id="appointmentRate"
                          name="appointmentRate"
                          type="number"
                          value={formData.appointmentRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 2000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="mt-6 flex justify-end">
                <Button type="submit" className="bg-crimson-deep hover:bg-crimson-deep/90" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
