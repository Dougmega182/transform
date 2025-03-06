"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { JobSiteSelector } from "@/components/job-site-selector"
import { getJobSites } from "@/app/actions/job-site-actions"

export default function Home() {
  const [selectedJobSite, setSelectedJobSite] = useState<{ id: string; name: string } | null>(null)
  const router = useRouter()

  const handleSignInOut = () => {
    if (selectedJobSite) {
      router.push(`/signin-out?jobSiteId=${selectedJobSite.id}`)
    } else {
      alert("Please select a job site before proceeding.")
    }
  }

  const getJobSitesAsync = async () => {
    try {
      return await getJobSites()
    } catch (error) {
      console.error("Error fetching job sites:", error)
      throw error // Re-throw or handle as needed
    }
  }

  const jobSitesPromise = getJobSitesAsync()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">WorkSite Safety</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Job Site</CardTitle>
            <CardDescription>Choose the job site you're working at today</CardDescription>
          </CardHeader>
          <CardContent>
            <JobSiteSelector jobSites={await jobSitesPromise} onSelect={setSelectedJobSite} />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Sign In/Out</CardTitle>
              <CardDescription>Record your worksite attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Sign in or out of your current worksite and confirm safety compliance.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSignInOut}>
                Sign In/Out
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Documents</CardTitle>
              <CardDescription>View and sign SWMS documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access and digitally sign all required Safe Work Method Statements.</p>
            </CardContent>
            <CardFooter>
              <Link href="/documents" className="w-full">
                <Button variant="outline" className="w-full">
                  View Documents
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Induction</CardTitle>
              <CardDescription>Complete site induction forms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Fill out required site induction forms before starting work.</p>
            </CardContent>
            <CardFooter>
              <Link href="/induction" className="w-full">
                <Button variant="outline" className="w-full">
                  Complete Induction
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-slate-100 py-6">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>© {new Date().getFullYear()} WorkSite Safety System</p>
        </div>
      </footer>
    </div>
  )
}

