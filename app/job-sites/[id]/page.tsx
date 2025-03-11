"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ClipboardList, FileText, LogIn } from "lucide-react"

type JobSite = {
  id: string
  name: string
  address: string
}

export default function JobSitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [jobSite, setJobSite] = useState<JobSite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("swms")

  useEffect(() => {
    const fetchJobSite = async () => {
      try {
        const response = await fetch(`/api/job-sites/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setJobSite(data.jobSite)
        }
      } catch (error) {
        console.error("Error fetching job site:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job site information",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchJobSite()
    }
  }, [params.id, toast])

  if (isLoading) {
    return <div>Loading job site information...</div>
  }

  if (!jobSite) {
    return <div>Job site not found</div>
  }

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">{jobSite.name}</h1>
      <p className="mb-8 text-muted-foreground">{jobSite.address}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="swms">SWMS</TabsTrigger>
          <TabsTrigger value="induction">Site Induction</TabsTrigger>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
        </TabsList>

        <TabsContent value="swms">
          <Card>
            <CardHeader>
              <CardTitle>Safe Work Method Statement</CardTitle>
              <CardDescription>Review and sign off on the SWMS for this job site</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add SWMS review and sign-off functionality here */}
              <Button className="mt-4">
                <FileText className="mr-2 h-4 w-4" /> Review and Sign SWMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="induction">
          <Card>
            <CardHeader>
              <CardTitle>Site Induction</CardTitle>
              <CardDescription>Complete the required site induction</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add site induction form and process here */}
              <Button className="mt-4">
                <ClipboardList className="mr-2 h-4 w-4" /> Start Site Induction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In to Job Site</CardTitle>
              <CardDescription>Complete the sign-in process for this job site</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add sign-in functionality here */}
              <Button className="mt-4">
                <LogIn className="mr-2 h-4 w-4" /> Sign In to Site
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

