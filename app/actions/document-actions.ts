"use server"

import prisma from "@/lib/prisma"

type SignDocumentData = {
  documentId: string
  name: string
  mobile: string
  timestamp: string
}

export async function signDocument(data: SignDocumentData) {
  try {
    // Find the user
    const user = await prisma.user.findFirst({
      where: {
        name: data.name,
        mobile: data.mobile,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Create the document signature
    const signature = await prisma.documentSignature.create({
      data: {
        documentId: data.documentId,
        userId: user.id,
        timestamp: new Date(data.timestamp),
      },
    })

    return { success: true, signature }
  } catch (error) {
    console.error("Error recording document signature:", error)
    throw new Error("Failed to sign document")
  }
}

