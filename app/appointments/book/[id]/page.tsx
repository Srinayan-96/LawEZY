"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { useRouter, useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { CalendarIcon, Clock, MapPin, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Professional {
  id: string
  name: string
  email: string
  designation: string
  appointmentRate: number
  chatRate: number
  experience: string
  degree: string
  photoURL?: string
  bio?: string
  specializations?: string
}

export default function BookAppointmentPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const professionalId = params.id as string

  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [type, setType] = useState<"online" | "in-person">("online")
  const [notes, setNotes] = useState<string>("")
  const [reason, setReason] = useState<string>("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const fetchProfessional = async () => {
      if (!professionalId) return

      try {
        const docRef = doc(db, "users", professionalId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setProfessional({
            id: docSnap.id,
            ...data,
            // Ensure these fields exist with defaults if not present
            appointmentRate: data.appointmentRate || 1500,
            chatRate: data.chatRate || 1000,
            experience: data.experience || "5+ years",
            degree: data.degree || "LLB",
            name: data.name || "Legal Professional",
            email: data.email || "",
            designation: data.designation || "Lawyer",
          } as Professional)
        } else {
          console.error("No such professional!")
          toast({
            variant: "destructive",
            title: "Professional not found",
            description: "We couldn't find the professional you're looking for.",
          })
          router.push("/appointments")
        }
      } catch (error) {
        console.error("Error fetching professional:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load professional details. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user) {
      fetchProfessional()
    }
  }, [professionalId, user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userData || !professional || !date || !time || !reason.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields including the reason for appointment.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate end time (1 hour after start time)
      const [startHour, startMinute] = time.split(":").map(Number)
      const endHour = (startHour + 1) % 24
      const endTime = `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`

      // Add appointment to Firestore
      const appointmentData = {
        professionalId: professional.id,
        userId: user.uid,
        userName: userData.name || user.email?.split("@")[0] || "User",
        userEmail: userData.email || user.email,
        professionalName: professional.name,
        professionalEmail: professional.email,
        professionalPhotoURL: professional.photoURL || null,
        date: date, // This will be converted to a Firestore timestamp
        startTime: time,
        endTime: endTime,
        type: type,
        status: "pending",
        reason: reason.trim(),
        notes: notes.trim() || null,
        rate: professional.appointmentRate,
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "appointments"), appointmentData)

      toast({
        title: "Appointment requested",
        description: "Your appointment request has been sent to the professional.",
      })

      router.push(`/appointments/${docRef.id}`)
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Available time slots
  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load the professional's details</p>
          </div>
        </div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Professional not found</h2>
            <p className="text-sm text-muted-foreground mb-4">The professional you're looking for doesn't exist</p>
            <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
              <a href="/appointments">Back to Appointments</a>
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={professional.photoURL || "/placeholder.svg"} alt={professional.name} />
                    <AvatarFallback className="text-2xl">{professional.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{professional.name}</h3>
                      <p className="text-muted-foreground">{professional.designation}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge className="bg-crimson-deep hover:bg-crimson-deep/90">
                        ₹{professional.appointmentRate}/hr
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Experience</Badge>
                      <span>{professional.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Degree</Badge>
                      <span>{professional.degree}</span>
                    </div>
                    {professional.specializations && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Badge variant="outline">Specializations</Badge>
                        <span>{professional.specializations}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {professional.bio ||
                      "Legal professional specializing in providing expert consultation and services."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Schedule a consultation with {professional.name}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <RadioGroup
                    value={type}
                    onValueChange={(value) => setType(value as "online" | "in-person")}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                        <Video className="h-4 w-4 text-crimson-deep" />
                        Online Consultation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex items-center gap-2 cursor-pointer">
                        <MapPin className="h-4 w-4 text-crimson-deep" />
                        In-Person Meeting
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="flex items-center">
                    Reason for Appointment <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Please specify the legal matter you'd like to discuss"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{slot}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information you'd like to share"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Appointment Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Professional:</span> {professional.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Rate:</span> ₹{professional.appointmentRate}/hour
                    </p>
                    <p>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {type === "online" ? "Online Consultation" : "In-Person Meeting"}
                    </p>
                    {date && (
                      <p>
                        <span className="text-muted-foreground">Date:</span> {format(date, "PPP")}
                      </p>
                    )}
                    {time && (
                      <p>
                        <span className="text-muted-foreground">Time:</span> {time}
                      </p>
                    )}
                    {reason && (
                      <p>
                        <span className="text-muted-foreground">Reason:</span> {reason}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-crimson-deep hover:bg-crimson-deep/90"
                    disabled={isSubmitting || !date || !time || !reason.trim()}
                  >
                    {isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
