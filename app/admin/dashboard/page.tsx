"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, ClipboardList, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"

type SiteOverview = {
  id: string
  name: string
  address: string
  activeWorkers: number
  totalWorkers: number
  completedInductions: number
  totalInductions: number
  signedSwms: number
  totalSwms: number
}

type WorkerAttendance = {
  id: string
  name: string
  email: string
  currentSite: string | null
  signInTime: string | null
  totalHoursThisWeek: number
  completedInductions: number
  signedSwms: number
}

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<SiteOverview[]>([])
  const [workers, setWorkers] = useState<WorkerAttendance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("sites")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (!loading && user && user.role !== "CEO" && user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch site overviews
        const sitesResponse = await fetch("/api/admin/sites")
        if (!sitesResponse.ok) {
          throw new Error("Failed to fetch site data")
        }
        const sitesData = await sitesResponse.json()
        setSites(sitesData.sites)

        // Fetch worker attendance
        const workersResponse = await fetch("/api/admin/workers")
        if (!workersResponse.ok) {
          throw new Error("Failed to fetch worker data")
        }
        const workersData = await workersResponse.json()
        setWorkers(workersData.workers)
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && (user.role === "CEO" || user.role === "ADMIN")) {
      fetchAdminData()
    }
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor site activity and worker compliance</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.reduce((total, site) => total + site.activeWorkers, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Induction Completion</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (sites.reduce((total, site) => total + site.completedInductions, 0) /
                  Math.max(
                    sites.reduce((total, site) => total + site.totalInductions, 0),
                    1,
                  )) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SWMS Compliance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (sites.reduce((total, site) => total + site.signedSwms, 0) /
                  Math.max(
                    sites.reduce((total, site) => total + site.totalSwms, 0),
                    1,
                  )) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Site Overview</CardTitle>
              <CardDescription>Monitor activity and compliance across all job sites</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Active Workers</TableHead>
                    <TableHead>Induction Completion</TableHead>
                    <TableHead>SWMS Compliance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-muted-foreground">{site.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.activeWorkers} / {site.totalWorkers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.completedInductions} / {site.totalInductions}
                          <span className="ml-2">
                            ({Math.round((site.completedInductions / Math.max(site.totalInductions, 1)) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {site.signedSwms} / {site.totalSwms}
                          <span className="ml-2">
                            ({Math.round((site.signedSwms / Math.max(site.totalSwms, 1)) * 100)}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/job-sites/${site.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Attendance</CardTitle>
              <CardDescription>Monitor worker attendance and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Hours This Week</TableHead>
                    <TableHead>Inductions</TableHead>
                    <TableHead>SWMS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {worker.currentSite ? (
                          <Badge className="bg-green-500">On Site: {worker.currentSite}</Badge>
                        ) : (
                          <Badge variant="outline">Not On Site</Badge>
                        )}
                      </TableCell>
                      <TableCell>{worker.totalHoursThisWeek.toFixed(1)} hrs</TableCell>
                      <TableCell>{worker.completedInductions}</TableCell>
                      <TableCell>{worker.signedSwms}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

