import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Layout from "@/components/layout"
import { FileText, Bell, Briefcase, FileCheck } from "lucide-react"

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            name="Moore St Project M"
            address="ACT Health Building, Level 5/1 Moore St, Canberra ACT 2601"
            weather="35° Sunny"
          />
          {/* Add more ProjectCard components for other projects */}
        </div>
      </div>
    </Layout>
  )
}

function ProjectCard({ name, address, weather }: { name: string; address: string; weather: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gray-300 relative">
        <img src="/placeholder.svg?height=160&width=320" alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
          Sign off
        </div>
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-gray-500">{address}</p>
        <p className="text-sm font-medium">{weather}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <IconButton icon={<FileText size={20} />} label="Inductions" />
          <IconButton icon={<Bell size={20} />} label="SWMS" />
          <IconButton icon={<Briefcase size={20} />} label="Permits" />
          <IconButton icon={<FileCheck size={20} />} label="Forms" />
        </div>
        <div className="space-y-2">
          <Link href={`/projects/${encodeURIComponent(name)}`} className="block">
            <Button variant="outline" className="w-full justify-start">
              Complete Site Induction
            </Button>
          </Link>
          <Link href={`/projects/${encodeURIComponent(name)}/swms`} className="block">
            <Button variant="outline" className="w-full justify-start">
              Acknowledge SWMS
            </Button>
          </Link>
          <Link href={`/projects/${encodeURIComponent(name)}/briefing`} className="block">
            <Button variant="outline" className="w-full justify-start">
              Acknowledge Daily Briefing
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <Button variant="ghost" size="sm" className="h-12 w-12">
        {icon}
      </Button>
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}

