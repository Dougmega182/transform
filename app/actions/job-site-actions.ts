"use server"

import prisma from "@/lib/prisma"

export async function getJobSites() {
  try {
    const jobSites = await prisma.jobSite.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })
    return jobSites
  } catch (error) {
    console.error("Error fetching job sites:", error)
    throw new Error("Failed to fetch job sites")
  }
}

