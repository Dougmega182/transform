"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PDFViewer from "@/components/pdf-viewer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { signDocument } from "@/app/actions/document-actions"

// Assume this comes from your API or state management
const safetyDocuments = [
  {
    id: "1",
    title: "High Hazard SWMS",
    description: "Safe Work Method Statement for high hazard activities",
    pdfUrl: "/pdfs/SWMS-High-Hazard.pdf",
    signed: false,
  },
  // ... other documents
]

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string
  const document = safetyDocuments.find((doc) => doc.id === documentId)
  const [signature, setSignature] = useState("")
  const [loading, setLoading] = useState(false)

  if (!document) {
    return <div>Document not found</div>
  }

  const handleSign = async () => {
    setLoading(true)
    try {
      const result = await signDocument({
        documentId,
        signature,
        timestamp: new Date().toISOString(),
      })

      if (result.success) {
        toast({
          title: "Document Signed",
          description: "You have successfully signed the document.",
        })
        router.push("/documents")
      } else {
        throw new Error(result.error || "Failed to sign document")
      }
    } catch (error) {
      console.error("Error signing document:", error)
      toast({
        title: "Error",
        description: "Failed to sign the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{document.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <PDFViewer pdfUrl={document.pdfUrl} />
            </div>
            <div className="mt-6">
              <Label htmlFor="signature">Sign with your full name</Label>
              <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} className="mt-1" />
              <Button onClick={handleSign} className="mt-4" disabled={!signature || loading}>
                {loading ? "Signing..." : "Sign Document"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

