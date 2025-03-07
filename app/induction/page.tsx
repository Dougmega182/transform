"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Layout from "@/components/layout"
import { submitInduction } from "@/app/actions/induction-actions"
import { Checkbox } from "@/components/ui/checkbox"

const projectManagers = ["Oliver Trifunovski", "Matt Reid"]

const highRiskWorkLicences = [
  "SB - Basic Scaffolding",
  "SI - Intermediate Scaffolding",
  "SA - Advanced Scaffolding",
  "PB - Concrete Placing Boom Operator",
  "CT, CV, CN, C2, C6, C1, C0 - Crane Operator",
  "Other",
]

const formSchema = z.object({
  project: z.string().min(2, {
    message: "Project must be at least 2 characters.",
  }),
  manager: z.string().min(2, {
    message: "Manager must be at least 2 characters.",
  }),
  date: z.date(),
  company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  plant: z.string(),
  plantInduction: z.string().optional(),
  highRiskLicence: z.string().optional(),
  hotWorks: z.string(),
  materials: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

export default function InductionPage() {
  const [date, setDate] = useState<Date>(new Date())
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      manager: "",
      date: new Date(),
      company: "",
      name: "",
      description: "",
      plant: "no",
      plantInduction: "",
      highRiskLicence: "",
      hotWorks: "no",
      materials: "no",
      terms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await submitInduction(values)
      if (result.success) {
        toast({
          title: "Induction Completed",
          description: "You have successfully completed the site induction.",
        })
        router.push("/") // Navigate back to home page
      } else {
        throw new Error(result.error || "Failed to submit induction")
      }
    } catch (error) {
      console.error("Error submitting induction:", error)
      toast({
        title: "Error",
        description: "Failed to submit the induction. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="mb-6 inline-block">
            <Button variant="outline" size="sm">
              ← Back to Home
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Site Induction Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Your existing form fields go here */}
                  {/* ... */}
                  <div className="grid gap-8 max-w-4xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="project">Project Name</Label>
                            <FormField
                              control={form.control}
                              name="project"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select project..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {/* Job sites will be populated from database */}
                                      <SelectItem value="project1">Project 1</SelectItem>
                                      <SelectItem value="project2">Project 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="manager">Project Manager</Label>
                            <FormField
                              control={form.control}
                              name="manager"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select manager..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {projectManagers.map((manager) => (
                                        <SelectItem key={manager} value={manager}>
                                          {manager}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Date</Label>
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date > new Date() || date < new Date("01/01/2023")}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contractor Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Contractor Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="company">Contractor Company Name</Label>
                            <FormField
                              control={form.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input id="company" placeholder="Company name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Contractor Name</Label>
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input id="name" placeholder="Contractor name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description of Job</Label>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    id="description"
                                    placeholder="Brief description of the required outcome..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plant and Equipment */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Plant and Equipment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Does the contractor's job involve the use of any plant?</Label>
                          <FormField
                            control={form.control}
                            name="plant"
                            render={({ field }) => (
                              <FormItem>
                                <RadioGroup
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="plant-yes" />
                                    <Label htmlFor="plant-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="plant-no" />
                                    <Label htmlFor="plant-no">No</Label>
                                  </div>
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="plant-induction">Plant Induction Form Details</Label>
                          <FormField
                            control={form.control}
                            name="plantInduction"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    id="plant-induction"
                                    placeholder="Details about plant induction form completion..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>High Risk Work Licence Type</Label>
                          <FormField
                            control={form.control}
                            name="highRiskLicence"
                            render={({ field }) => (
                              <FormItem>
                                <RadioGroup
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  {highRiskWorkLicences.map((licence) => (
                                    <div key={licence} className="flex items-center space-x-2">
                                      <RadioGroupItem value={licence} id={`licence-${licence}`} />
                                      <Label htmlFor={`licence-${licence}`}>{licence}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Hot Works */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Hot Works</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Does the contractor's job involve hot works?</Label>
                          <FormField
                            control={form.control}
                            name="hotWorks"
                            render={({ field }) => (
                              <FormItem>
                                <RadioGroup
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="hot-works-yes" />
                                    <Label htmlFor="hot-works-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="hot-works-no" />
                                    <Label htmlFor="hot-works-no">No</Label>
                                  </div>
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Materials */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Materials</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Will the contractor be bringing any materials onsite?</Label>
                          <FormField
                            control={form.control}
                            name="materials"
                            render={({ field }) => (
                              <FormItem>
                                <RadioGroup
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="materials-yes" />
                                    <Label htmlFor="materials-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="materials-no" />
                                    <Label htmlFor="materials-no">No</Label>
                                  </div>
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Terms and Conditions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Terms and Conditions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the{" "}
                                  <Link href="/terms" className="underline underline-offset-2">
                                    terms and conditions
                                  </Link>
                                </FormLabel>
                                <FormDescription>
                                  You must agree to the terms and conditions before submitting the induction form.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <Button type="submit">Submit Induction</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

