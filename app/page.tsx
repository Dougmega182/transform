import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Create a new instance of PrismaClient

async function getJobSites() {
  return await prisma.jobSite.findMany();
}

export default async function Home() {
  const jobSites: any[] = await getJobSites(); // Add type annotation for jobSites
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
            {jobSites.map((site: any) => ( // Add type annotation for site
              <Card key={site.id} className="bg-blue-600 hover:bg-blue-700 shadow-md rounded-lg overflow-hidden p-4">
                <CardContent>
                  <CardTitle className="text-white text-2xl font-bold mb-2">{site.name}</CardTitle>
                  <CardDescription className="text-gray-100 text-sm mb-4">
                    {site.address}
                  </CardDescription>
                  <Button asChild className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg">
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
