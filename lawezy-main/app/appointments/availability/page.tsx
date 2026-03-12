"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AvailabilitySlot {
  id: string
  professionalId: string
  date: any
  startTime: string
  endTime: string
  isRecurring: boolean
  createdAt: any
}

export default function AvailabilityPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && userData?.role !== "professional") {
      router.push("/appointments")
    }

    const fetchAvailability = async () => {
      if (!user) return

      try {
        const availabilityQuery = query(collection(db, "availability"), where("professionalId", "==", user.uid))

        const snapshot = await getDocs(availabilityQuery)
        const slotsData: AvailabilitySlot[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            professionalId: data.professionalId,
            date: data.date, // This is a Firestore timestamp
            startTime: data.startTime,
            endTime: data.endTime,
            isRecurring: data.isRecurring,
            createdAt: data.createdAt,
          } as AvailabilitySlot
        })

        setAvailabilitySlots(slotsData)
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading && user) {
      fetchAvailability()
    }
  }, [user, userData, loading, router])

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !date || !startTime || !endTime) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Add availability to Firestore
      const newSlot = await addDoc(collection(db, "availability"), {
        professionalId: user.uid,
        date: date,
        startTime: startTime,
        endTime: endTime,
        isRecurring: isRecurring,
        createdAt: serverTimestamp(),
      })

      // Update local state
      setAvailabilitySlots([
        ...availabilitySlots,
        {
          id: newSlot.id,
          professionalId: user.uid,
          date: date,
          startTime: startTime,
          endTime: endTime,
          isRecurring: isRecurring,
          createdAt: new Date(),
        },
      ])

      // Reset form
      setDate(undefined)
      setStartTime("")
      setEndTime("")
      setIsRecurring(false)
    } catch (error) {
      console.error("Error adding availability:", error)
      alert("Failed to add availability. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    if (!user) return

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "availability", slotId))

      // Update local state
      setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== slotId))
    } catch (error) {
      console.error("Error deleting availability slot:", error)
      alert("Failed to delete availability slot. Please try again.")
    }
  }

  // Available time slots
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load your availability</p>
          </div>
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
        <h1 className="text-3xl font-bold mb-6">Manage Your Availability</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add Availability</CardTitle>
                <CardDescription>Set times when you're available for appointments</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddAvailability}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
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
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={`start-${slot}`} value={slot}>
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
                    <Label>End Time</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={`end-${slot}`} value={slot} disabled={slot <= startTime}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{slot}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked === true)}
                    />
                    <Label htmlFor="recurring" className="cursor-pointer">
                      Repeat weekly
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-crimson-deep hover:bg-crimson-deep/90"
                    disabled={isSubmitting || !date || !startTime || !endTime}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Adding..." : "Add Availability"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Availability</CardTitle>
                <CardDescription>These are the times you've set as available for appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading availability...</p>
                  </div>
                ) : availabilitySlots.length > 0 ? (
                  <div className="space-y-4">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted p-2 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-crimson-deep" />
                          </div>
                          <div>
                            <p className="font-medium">{format(new Date(slot.date.toDate()), "EEEE, MMMM d, yyyy")}</p>
                            <p className="text-sm text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                              {slot.isRecurring && " (Repeats weekly)"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSlot(slot.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No availability set</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't set any available time slots yet. Add some to start receiving appointment requests.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
