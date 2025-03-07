"use server"

import prisma from "@/lib/prisma"

export type SafetyDocument = {
  id: string
  title: string
  description: string
  pdfUrl: string
  signed: boolean
}

type SignDocumentData = {
  documentId: string
  signature: string
  timestamp: string
}

export async function signDocument(data: SignDocumentData) {
  try {
    // In a real application, you would:
    // 1. Verify the user's identity (e.g., from a session)
    // 2. Check if the document exists
    // 3. Check if the user has already signed this document
    // 4. Create a signature record in the database

    // For this example, we'll just simulate a successful signature
    const signatureRecord = await prisma.documentSignature.create({
      data: {
        documentId: data.documentId,
        userId: "example-user-id", // In a real app, get this from the session
        timestamp: new Date(data.timestamp),
      },
    })

    console.log("Document signed:", signatureRecord)

    return { success: true, signatureRecord }
  } catch (error) {
    console.error("Error signing document:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }
  }
}

export async function getDocuments(): Promise<SafetyDocument[]> {
  try {
    const documents = await prisma.document.findMany({
      include: {
        signatures: true,
      },
    })

    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      pdfUrl: doc.pdfUrl,
      signed: doc.signatures.length > 0,
    }))
  } catch (error) {
    console.error("Error fetching documents:", error)
    throw error
  }
}

