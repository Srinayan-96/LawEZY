"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { Download, FileText, Plus, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
  uploadedBy: {
    id: string
    name: string
    photoURL?: string
  }
  createdAt: any
  downloads: number
  category: string
  tags: string[]
}

export default function ResourcesPage() {
  const { user, userData } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesQuery = query(collection(db, "resources"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(resourcesQuery)
        const resourceData: Resource[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Resource,
        )
        setResources(resourceData)
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const filteredResources = resources.filter((resource) =>
    [resource.title, resource.description, resource.uploadedBy.name, resource.category, ...resource.tags]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const isProfessional = userData?.role === "professional"
  const categories = ["Legal Forms", "Case Studies", "Legal Guides", "Templates", "Research Papers"]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Legal Resources</h1>
            <p className="text-muted-foreground">Access legal documents, templates, and guides</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {user && isProfessional && (
              <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href="/resources/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between cursor-pointer hover:text-crimson-deep"
                      onClick={() => setSearchQuery(category)}
                    >
                      <span>{category}</span>
                      <Badge variant="outline">{resources.filter((r) => r.category === category).length}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">About Resources</h3>
                <p className="text-muted-foreground mb-4">
                  Our legal resources section provides access to valuable documents, templates, and guides created by
                  legal professionals to help you navigate various legal matters.
                </p>
                <CardFooter className="px-0 pt-4 pb-0">
                  <Button asChild className="w-full bg-crimson-deep hover:bg-crimson-deep/90">
                    <Link href={user && isProfessional ? "/resources/upload" : "/signup"}>
                      {user ? "Upload Resource" : "Join LawEzy"}
                    </Link>
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="forms">Legal Forms</TabsTrigger>
                <TabsTrigger value="guides">Legal Guides</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ResourceList
                  loading={loading}
                  resources={filteredResources}
                  isProfessional={isProfessional}
                  user={user}
                  searchQuery={searchQuery}
                />
              </TabsContent>

              <TabsContent value="forms">
                <ResourceList
                  loading={loading}
                  resources={filteredResources.filter((r) => r.category === "Legal Forms")}
                />
              </TabsContent>

              <TabsContent value="guides">
                <ResourceList
                  loading={loading}
                  resources={filteredResources.filter((r) => r.category === "Legal Guides")}
                />
              </TabsContent>

              <TabsContent value="templates">
                <ResourceList
                  loading={loading}
                  resources={filteredResources.filter((r) => r.category === "Templates")}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceList({
  loading,
  resources,
  isProfessional,
  user,
  searchQuery,
}: {
  loading: boolean
  resources: Resource[]
  isProfessional?: boolean
  user?: any
  searchQuery?: string
}) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading resources...</p>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No resources found</h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "There are no resources yet."}
        </p>
        {user && isProfessional && (
          <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
            <Link href="/resources/upload">Upload First Resource</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-10 w-10 text-crimson-deep" />
      case "doc":
      case "docx":
        return <FileText className="h-10 w-10 text-blue-600" />
      case "xls":
      case "xlsx":
        return <FileText className="h-10 w-10 text-green-600" />
      default:
        return <FileText className="h-10 w-10 text-gray-600" />
    }
  }

  const formattedDate = resource.createdAt?.toDate
    ? new Date(resource.createdAt.toDate()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getFileIcon(resource.fileType)}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold">{resource.title}</h3>
              <Badge>{resource.fileType.toUpperCase()}</Badge>
            </div>
            <p className="text-muted-foreground mb-3">{resource.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={resource.uploadedBy.photoURL} alt={resource.uploadedBy.name} />
                  <AvatarFallback>{resource.uploadedBy.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="text-muted-foreground">By </span>
                  <span>{resource.uploadedBy.name}</span>
                  <span className="text-muted-foreground"> • {formattedDate}</span>
                </div>
              </div>

              <Button asChild variant="outline" size="sm" className="gap-1">
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                  <span className="text-xs text-muted-foreground ml-1">({resource.fileSize})</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
