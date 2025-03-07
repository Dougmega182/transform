"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Bell, Briefcase, FileCheck } from "lucide-react"

export default function ProjectPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{params.name}</h2>
          <p className="text-sm text-gray-500">ACT Health Building, Level 5/1 Moore St, Canberra ACT 2601</p>
          <p className="text-sm font-medium">35° Sunny</p>
        </div>

        <div className="flex justify-between mb-6">
          <IconButton icon={<FileText size={20} />} label="Inductions" />
          <IconButton icon={<Bell size={20} />} label="SWMS" />
          <IconButton icon={<Briefcase size={20} />} label="Permits" />
          <IconButton icon={<FileCheck size={20} />} label="Forms" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Tasks due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Complete Site Induction
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Acknowledge SWMS
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Acknowledge Daily Briefing
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Briefings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pre-start briefing</p>
                    <p className="text-sm text-gray-500">7:38am, 15 Sep 2023 • Jane Maizin</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            {/* Add project details content here */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Project details content goes here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
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

