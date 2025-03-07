"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getDocuments } from "@/app/actions/document-actions"

type SafetyDocument = {
  id: string
  title: string
  description: string
  pdfUrl: string
  signed: boolean
}

export default function DocumentsPage() {
  const [safetyDocuments, setSafetyDocuments] = useState<SafetyDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      const documents = await getDocuments()
      setSafetyDocuments(documents)
      setLoading(false)
    }
    fetchDocuments()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Documents</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safetyDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {doc.title}
                  {doc.signed && <CheckCircle className="ml-2 h-5 w-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{doc.description}</p>
                <div className="flex justify-between items-center">
                  <Link href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">View PDF</Button>
                  </Link>
                  <Link href={`/documents/${doc.id}`}>
                    <Button variant={doc.signed ? "outline" : "default"}>
                      {doc.signed ? "View Signed" : "Sign Document"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

