import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth-utils"
import { startOfWeek } from "date-fns"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "CEO" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the start of the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday as start of week

    // Fetch all workers (users with role USER)
    const workers = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      include: {
        attendances: {
          include: {
            jobSite: true,
          },
        },
        inductions: true,
        swmsSignoffs: true,
      },
    })

    // Transform data for the frontend
    const transformedWorkers = workers.map((worker) => {
      // Find current active attendance (if any)
      const activeAttendance = worker.attendances.find((a) => a.signOutTime === null)

      // Calculate total hours this week
      const weeklyAttendances = worker.attendances.filter((a) => {
        const signInDate = new Date(a.signInTime)
        return signInDate >= weekStart && a.signOutTime !== null
      })

      const totalHoursThisWeek = weeklyAttendances.reduce((total, attendance) => {
        if (!attendance.signOutTime) return total

        const signInTime = new Date(attendance.signInTime).getTime()
        const signOutTime = new Date(attendance.signOutTime).getTime()
        const durationHours = (signOutTime - signInTime) / (1000 * 60 * 60)

        return total + durationHours
      }, 0)

      return {
        id: worker.id,
        name: worker.name || "Unknown",
        email: worker.email,
        currentSite: activeAttendance ? activeAttendance.jobSite.name : null,
        signInTime: activeAttendance ? activeAttendance.signInTime.toISOString() : null,
        totalHoursThisWeek,
        completedInductions: worker.inductions.length,
        signedSwms: worker.swmsSignoffs.length,
      }
    })

    return NextResponse.json({ workers: transformedWorkers })
  } catch (error) {
    console.error("Error fetching admin worker data:", error)
    return NextResponse.json({ message: "An error occurred while fetching worker data" }, { status: 500 })
  }
}

