"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Calendar, Clock, MapPin, Search, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface Professional {
  id: string
  name: string
  email: string
  designation: string
  rate: number
  experience: string
  degree: string
  photoURL?: string
  bio?: string
}

interface Appointment {
  id: string
  professionalId: string
  userId: string
  date: any
  startTime: string
  endTime: string
  type: "online" | "in-person"
  status: "pending" | "confirmed" | "rejected" | "completed"
  notes?: string
  meetingLink?: string
}

export default function AppointmentsPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    const fetchData = async () => {
      try {
        // Fetch professionals
        const professionalsQuery = query(collection(db, "users"), where("role", "==", "professional"))

        const professionalsSnapshot = await getDocs(professionalsQuery)
        const professionalsData: Professional[] = professionalsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Professional,
        )

        setProfessionals(professionalsData)

        // Fetch appointments if user is logged in
        if (user) {
          try {
            // Modified query - remove the orderBy to avoid requiring the composite index
            const appointmentsQuery =
              userData?.role === "professional"
                ? query(collection(db, "appointments"), where("professionalId", "==", user.uid))
                : query(collection(db, "appointments"), where("userId", "==", user.uid))

            const appointmentsSnapshot = await getDocs(appointmentsQuery)
            let appointmentsData: Appointment[] = appointmentsSnapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                }) as Appointment,
            )

            // Sort the appointments in memory instead of in the query
            appointmentsData = appointmentsData.sort((a, b) => {
              const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date)
              const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date)
              return dateA.getTime() - dateB.getTime()
            })

            setAppointments(appointmentsData)
          } catch (error) {
            console.error("Error fetching appointments:", error)
            // Show a more user-friendly error message
            alert("There was an issue loading your appointments. Please try again later.")
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)

        // Check if it's an index error and provide helpful information
        if (error instanceof Error && error.message.includes("requires an index")) {
          console.log("This application requires a Firestore index. Please contact the administrator.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      fetchData()
    }
  }, [user, userData, loading, router])

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.degree.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isProfessional = userData?.role === "professional"

  // Filter appointments by status
  const pendingAppointments = appointments.filter((app) => app.status === "pending")
  const upcomingAppointments = appointments.filter((app) => app.status === "confirmed")
  const pastAppointments = appointments.filter((app) => app.status === "completed")

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{isProfessional ? "Manage Appointments" : "Book Appointments"}</h1>
            <p className="text-muted-foreground">
              {isProfessional
                ? "View and manage your client appointments"
                : "Schedule consultations with legal professionals"}
            </p>
          </div>

          {!isProfessional && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search professionals..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {isProfessional ? (
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending
                {pendingAppointments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingAppointments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading appointments...</p>
                </div>
              ) : pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} isProfessional={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No pending appointments</h3>
                  <p className="text-muted-foreground">
                    You don't have any appointment requests waiting for your approval.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading appointments...</p>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} isProfessional={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No upcoming appointments</h3>
                  <p className="text-muted-foreground">You don't have any confirmed appointments scheduled.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading appointments...</p>
                </div>
              ) : pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} isProfessional={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No past appointments</h3>
                  <p className="text-muted-foreground">You don't have any completed appointments.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Set Your Availability</CardTitle>
                  <CardDescription>Define when you're available for appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure your working hours and appointment slots to let clients know when they can book time with
                    you.
                  </p>
                  <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                    <Link href="/appointments/availability">Manage Availability</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="professionals">
                <TabsList className="mb-6">
                  <TabsTrigger value="professionals">Find Professionals</TabsTrigger>
                  <TabsTrigger value="upcoming">
                    My Appointments
                    {appointments.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {appointments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="professionals">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p>Loading professionals...</p>
                    </div>
                  ) : filteredProfessionals.length > 0 ? (
                    <div className="space-y-4">
                      {filteredProfessionals.map((professional) => (
                        <ProfessionalCard key={professional.id} professional={professional} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No professionals found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery
                          ? `No results for "${searchQuery}". Try a different search term.`
                          : "There are no legal professionals available at the moment."}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p>Loading appointments...</p>
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} isProfessional={false} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No appointments</h3>
                      <p className="text-muted-foreground mb-6">You haven't booked any appointments yet.</p>
                      <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                        <Link href="/appointments?tab=professionals">Find a Professional</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Types</CardTitle>
                  <CardDescription>Choose the consultation format that works for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted p-2 rounded-md">
                        <Video className="h-5 w-5 text-crimson-deep" />
                      </div>
                      <div>
                        <h4 className="font-medium">Online Consultation</h4>
                        <p className="text-sm text-muted-foreground">
                          Meet with a legal professional via video call from the comfort of your home.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-muted p-2 rounded-md">
                        <MapPin className="h-5 w-5 text-crimson-deep" />
                      </div>
                      <div>
                        <h4 className="font-medium">In-Person Meeting</h4>
                        <p className="text-sm text-muted-foreground">
                          Schedule a face-to-face meeting at the professional's office.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Booking Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-crimson-deep font-bold">•</span>
                      <span>Compare rates and expertise before booking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-crimson-deep font-bold">•</span>
                      <span>Prepare your questions in advance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-crimson-deep font-bold">•</span>
                      <span>Have relevant documents ready for your consultation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-crimson-deep font-bold">•</span>
                      <span>Be on time for your appointment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-crimson-deep font-bold">•</span>
                      <span>Follow up with any additional questions via chat</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={professional.photoURL} alt={professional.name} />
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
                <Badge className="bg-crimson-deep hover:bg-crimson-deep/90">${professional.rate}/hr</Badge>
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
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">
              {professional.bio || "Legal professional specializing in providing expert consultation and services."}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button asChild variant="outline">
                <Link href={`/chat/${professional.id}`}>Message</Link>
              </Button>
              <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href={`/appointments/book/${professional.id}`}>Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AppointmentCard({
  appointment,
  isProfessional,
}: {
  appointment: Appointment
  isProfessional: boolean
}) {
  // In a real app, we would fetch the user or professional details
  // For now, we'll just use placeholder data
  const otherParty = {
    name: isProfessional ? "John Doe" : "Jane Smith, Esq.",
    photoURL: undefined,
  }

  const formatDate = (date: any) => {
    return new Date(date.toDate()).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Confirmed
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejected
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={otherParty.photoURL} alt={otherParty.name} />
              <AvatarFallback>{otherParty.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {isProfessional ? "Appointment with " : "Consultation with "}
                  {otherParty.name}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(appointment.date)}
                </p>
              </div>
              <div className="mt-2 md:mt-0">{getStatusBadge(appointment.status)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {appointment.type === "online" ? (
                  <>
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span>Online Consultation</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>In-Person Meeting</span>
                  </>
                )}
              </div>
            </div>

            {appointment.notes && (
              <p className="text-muted-foreground mb-4 border-l-2 border-muted pl-3">{appointment.notes}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              {isProfessional && appointment.status === "pending" && (
                <>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    Decline
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">Accept</Button>
                </>
              )}

              {appointment.status === "confirmed" && appointment.type === "online" && (
                <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                  <a href={appointment.meetingLink || "#"} target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </Button>
              )}

              {!isProfessional && (
                <Button asChild variant="outline">
                  <Link href={`/chat/${appointment.professionalId}`}>Message</Link>
                </Button>
              )}

              <Button asChild variant="outline">
                <Link href={`/appointments/${appointment.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
