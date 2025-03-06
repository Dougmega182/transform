"use server"

import prisma from "@/lib/prisma"

type SignInOutData = {
  name: string
  mobile: string
  company: string
  jobSiteId: string
  action: "in" | "out"
  timestamp: string
}

export async function signInOut(data: SignInOutData) {
  try {
    // First, find or create the user
    let user = await prisma.user.findFirst({
      where: {
        name: data.name,
        mobile: data.mobile,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          mobile: data.mobile,
          company: data.company,
        },
      })
    }

    // Create the sign in/out record
    const signInRecord = await prisma.signInRecord.create({
      data: {
        userId: user.id,
        jobSiteId: data.jobSiteId,
        action: data.action,
        timestamp: new Date(data.timestamp),
      },
    })

    return { success: true, signInRecord }
  } catch (error) {
    console.error("Error recording sign in/out:", error)
    throw new Error("Failed to record sign in/out")
  }
}

