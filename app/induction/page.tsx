"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { submitInduction } from "@/app/actions/induction-actions"

export default function InductionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    company: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
    acknowledgements: {
      siteRules: false,
      emergencyProcedures: false,
      hazards: false,
      ppe: false,
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (field: keyof typeof formData.acknowledgements, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acknowledgements: {
        ...prev.acknowledgements,
        [field]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if all acknowledgements are checked
      const allAcknowledged = Object.values(formData.acknowledgements).every(Boolean)
      if (!allAcknowledged) {
        alert("You must acknowledge all site safety requirements")
        setLoading(false)
        return
      }

      // Submit the induction form
      await submitInduction({
        ...formData,
        timestamp: new Date().toISOString(),
      })

      alert("Site induction completed successfully!")
      router.push("/")
    } catch (error) {
      console.error("Error submitting induction:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="mb-6 inline-block">
          <Button variant="outline" size="sm">
            ← Back to Home
          </Button>
        </Link>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Site Induction Form</CardTitle>
            <CardDescription>Complete this form before starting work on site</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions (relevant to work)</Label>
                <Textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="List any medical conditions that may be relevant to your work on site"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium">Site Safety Acknowledgements</h3>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="siteRules"
                    checked={formData.acknowledgements.siteRules}
                    onCheckedChange={(checked) => handleCheckboxChange("siteRules", checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="siteRules"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read and understood the site rules
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="emergencyProcedures"
                    checked={formData.acknowledgements.emergencyProcedures}
                    onCheckedChange={(checked) => handleCheckboxChange("emergencyProcedures", checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="emergencyProcedures"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand the emergency procedures and assembly points
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="hazards"
                    checked={formData.acknowledgements.hazards}
                    onCheckedChange={(checked) => handleCheckboxChange("hazards", checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="hazards"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I am aware of the site hazards and control measures
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="ppe"
                    checked={formData.acknowledgements.ppe}
                    onCheckedChange={(checked) => handleCheckboxChange("ppe", checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="ppe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I will wear appropriate PPE at all times on site
                    </Label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Complete Induction"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

