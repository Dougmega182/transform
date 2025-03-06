import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, mobile, company, jobSiteId, action, timestamp } = body

    if (!name || !mobile || !company || !jobSiteId || !action || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find or create the user
    let user = await prisma.user.findFirst({
      where: {
        name: name,
        mobile: mobile,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name,
          mobile: mobile,
          company: company,
        },
      })
    }

    // Create the sign in/out record
    const signInRecord = await prisma.signInRecord.create({
      data: {
        userId: user.id,
        jobSiteId: jobSiteId,
        action: action,
        timestamp: new Date(timestamp),
      },
    })

    return NextResponse.json({ success: true, signInRecord }, { status: 200 })
  } catch (error) {
    console.error("Error recording sign in/out:", error)
    return NextResponse.json({ error: "Failed to record sign in/out" }, { status: 500 })
  }
}

