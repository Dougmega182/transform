import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Fetch job sites (runs on the server)
async function getJobSites() {
  return await prisma.jobSite.findMany() // Fetch all job sites from database
}

export default async function Home() {
  const jobSites = await getJobSites() // Fetch job sites on page load

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold">Transform Homes - Safety First Platform</h1>
            <p className="mb-8 text-xl">
              Streamline site safety, inductions, and compliance with our comprehensive Safety First platform.
            </p>
          </div>
        </div>
      </section>

      {/* Job Sites Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Please Select Your Jobsite from Below</h2>

          {/* Dynamically Render All Job Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobSites.map((site) => (
              <Card key={site.id} className="overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={site.imageUrl || `/placeholder.svg?height=200&width=400`}
                    alt={site.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{site.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> {site.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/job-sites/${site.id}`}>Enter Site {site.id}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
