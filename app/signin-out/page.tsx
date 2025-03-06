"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInOut } from "@/app/actions/user-actions"

export default function SignInOutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobSiteId = searchParams.get("jobSiteId")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [company, setCompany] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(true)
  const [swmsChecked, setSwmsChecked] = useState(false)
  const [inductionChecked, setInductionChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!jobSiteId) {
      setError("No job site selected. Please go back and select a job site.")
    }
  }, [jobSiteId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!jobSiteId) {
      setError("No job site selected. Please go back and select a job site.")
      setLoading(false)
      return
    }

    try {
      if (isSigningIn && (!swmsChecked || !inductionChecked)) {
        setError("You must confirm you have signed the required documents")
        setLoading(false)
        return
      }

      const result = await signInOut({
        name,
        mobile,
        company,
        jobSiteId,
        action: isSigningIn ? "in" : "out",
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        alert(`Successfully signed ${isSigningIn ? "in" : "out"}!`)
        router.push("/")
      } else {
        setError(result.error || "An error occurred. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
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

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>{isSigningIn ? "Sign In" : "Sign Out"}</CardTitle>
            <CardDescription>
              {isSigningIn
                ? "Sign in to your worksite and confirm safety compliance"
                : "Sign out when leaving the worksite"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>

              {isSigningIn && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="swms"
                      checked={swmsChecked}
                      onCheckedChange={(checked) => setSwmsChecked(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="swms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I confirm I have signed the High Hazard SWMS
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        <Link href="/documents" className="text-primary underline">
                          View SWMS documents
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="induction"
                      checked={inductionChecked}
                      onCheckedChange={(checked) => setInductionChecked(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="induction"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I confirm I have completed the site induction
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        <Link href="/induction" className="text-primary underline">
                          Complete site induction
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : isSigningIn ? "Sign In" : "Sign Out"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setIsSigningIn(!isSigningIn)} className="text-sm">
              {isSigningIn ? "Need to sign out instead?" : "Need to sign in instead?"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

