"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { useRouter, useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Calendar, Clock, MapPin, Video, MessageSquare, Check, X, ArrowLeft, Link as LinkIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Appointment {
  id: string
  professionalId: string
  userId: string
  professionalName: string
  userName: string
  professionalEmail: string
  userEmail: string
  date: any
  startTime: string
  endTime: string
  type: "online" | "in-person"
  status: "pending" | "confirmed" | "rejected" | "completed"
  reason?: string
  notes?: string
  meetingLink?: string
  professionalNotes?: string
  rejectionReason?: string
}

export default function AppointmentDetailsPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [professionalNotes, setProfessionalNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [meetingLink, setMeetingLink] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    const fetchAppointment = async () => {
      if (!appointmentId) return

      try {
        const docRef = doc(db, "appointments", appointmentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const appointmentData = { id: docSnap.id, ...docSnap.data() } as Appointment
          setAppointment(appointmentData)
          setProfessionalNotes(appointmentData.professionalNotes || "")
          setMeetingLink(appointmentData.meetingLink || "")
        } else {
          console.error("No such appointment!")
          router.push("/appointments")
        }
      } catch (error) {
        console.error("Error fetching appointment:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      fetchAppointment()
    }
  }, [appointmentId, user, loading, router])

  const handleUpdateStatus = async (newStatus: "confirmed" | "completed") => {
    if (!user || !appointment) return

    if (newStatus === "confirmed" && appointment.type === "online" && !meetingLink.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Meeting Link",
        description: "Please provide a meeting link for online appointments.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const appointmentRef = doc(db, "appointments", appointment.id)

      const updateData: any = {
        status: newStatus,
      }

      if (newStatus === "confirmed" && appointment.type === "online") {
        updateData.meetingLink = meetingLink.trim()
      }

      if (professionalNotes.trim()) {
        updateData.professionalNotes = professionalNotes
      }

      await updateDoc(appointmentRef, updateData)

      setAppointment({
        ...appointment,
        status: newStatus,
        meetingLink: updateData.meetingLink || appointment.meetingLink,
        professionalNotes: updateData.professionalNotes || appointment.professionalNotes,
      })

      toast({
        title: `Appointment ${newStatus}`,
        description: `The appointment has been ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        variant: "destructive",
        title: "Error updating appointment",
        description: "Failed to update appointment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejectAppointment = async () => {
    if (!user || !appointment || !rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a reason for rejecting the appointment.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const appointmentRef = doc(db, "appointments", appointment.id)

      await updateDoc(appointmentRef, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        professionalNotes: professionalNotes.trim() || null,
      })

      setAppointment({
        ...appointment,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        professionalNotes: professionalNotes.trim() || appointment.professionalNotes,
      })

      setRejectionDialogOpen(false)

      toast({
        title: "Appointment rejected",
        description: "The appointment has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting appointment:", error)
      toast({
        variant: "destructive",
        title: "Error rejecting appointment",
        description: "Failed to reject appointment. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isProfessional = userData?.role === "professional"

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we load the appointment details</p>
          </div>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-10 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium">Appointment not found</h2>
            <p className="text-sm text-muted-foreground mb-4">The appointment you're looking for doesn't exist</p>
            <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
              <a href="/appointments">Back to Appointments</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <MainNav />
      <div className="container py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Appointment Details</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {isProfessional ? "Appointment with " : "Consultation with "}
                    {isProfessional ? appointment.userName : appointment.professionalName}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {format(new Date(appointment.date.toDate()), "EEEE, MMMM d, yyyy")} • {appointment.startTime} -{" "}
                    {appointment.endTime}
                  </CardDescription>
                </div>
                <div>
                  {appointment.status === "pending" && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Pending
                    </Badge>
                  )}
                  {appointment.status === "confirmed" && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Confirmed
                    </Badge>
                  )}
                  {appointment.status === "rejected" && (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Rejected
                    </Badge>
                  )}
                  {appointment.status === "completed" && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 flex justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={isProfessional ? undefined : appointment.professionalPhotoURL}
                      alt={isProfessional ? appointment.userName : appointment.professionalName}
                    />
                    <AvatarFallback>
                      {isProfessional
                        ? appointment.userName.charAt(0).toUpperCase()
                        : appointment.professionalName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {isProfessional ? "Client" : "Professional"}
                      </h3>
                      <p className="font-medium">
                        {isProfessional ? appointment.userName : appointment.professionalName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="font-medium">
                        {isProfessional ? appointment.userEmail : appointment.professionalEmail}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(appointment.date.toDate()), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                      <p className="font-medium flex items-center gap-1">
                        {appointment.type === "online" ? (
                          <>
                            <Video className="h-4 w-4 text-muted-foreground" />
                            Online Consultation
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            In-Person Meeting
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="font-medium capitalize">{appointment.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {appointment.reason && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Reason for Appointment</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{appointment.reason}</p>
                  </div>
                </div>
              )}

              {appointment.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{appointment.notes}</p>
                  </div>
                </div>
              )}

              {appointment.professionalNotes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Professional Notes</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{appointment.professionalNotes}</p>
                  </div>
                </div>
              )}

              {appointment.rejectionReason && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Reason for Rejection</h3>
                  <div className="bg-muted p-3 rounded-md text-red-600">
                    <p>{appointment.rejectionReason}</p>
                  </div>
                </div>
              )}

              {appointment.type === "online" && appointment.status === "confirmed" && appointment.meetingLink && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Meeting Link</h3>
                  <div className="bg-muted p-3 rounded-md flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={appointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-crimson-deep hover:underline truncate"
                    >
                      {appointment.meetingLink}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              {isProfessional && appointment.status === "pending" && (
                <>
                  {appointment.type === "online" && (
                    <div className="space-y-2">
                      <Label htmlFor="meeting-link">Meeting Link</Label>
                      <Input
                        id="meeting-link"
                        placeholder="https://meet.example.com/..."
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="professional-notes">Add Notes (Optional)</Label>
                    <Textarea
                      id="professional-notes"
                      placeholder="Add any notes or instructions for the client"
                      value={professionalNotes}
                      onChange={(e) => setProfessionalNotes(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Appointment</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for rejecting this appointment request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="rejection-reason" className="text-right">
                              Reason for rejection
                            </Label>
                            <Textarea
                              id="rejection-reason"
                              placeholder="Please explain why you're rejecting this appointment"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setRejectionDialogOpen(false)}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleRejectAppointment}
                            disabled={isSubmitting || !rejectionReason.trim()}
                          >
                            {isSubmitting ? "Rejecting..." : "Reject Appointment"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus("confirmed")}
                      disabled={isSubmitting}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                </>
              )}

              {appointment.status === "confirmed" && (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/chat/${isProfessional ? appointment.userId : appointment.professionalId}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Link>
                  </Button>

                  {appointment.type === "online" && appointment.meetingLink && (
                    <Button asChild className="flex-1 bg-crimson-deep hover:bg-crimson-deep/90">
                      <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </Button>
                  )}

                  {isProfessional && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleUpdateStatus("completed")}
                      disabled={isSubmitting}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Appointments
            </Button>

            {!isProfessional && appointment.status !== "rejected" && (
              <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href={`/appointments/book/${appointment.professionalId}`}>Book Another Appointment</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}