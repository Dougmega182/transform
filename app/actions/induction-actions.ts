"use server"

import prisma from "@/lib/prisma"

type InductionData = {
  name: string
  mobile: string
  company: string
  emergencyContact: string
  emergencyPhone: string
  medicalConditions: string
  acknowledgements: {
    siteRules: boolean
    emergencyProcedures: boolean
    hazards: boolean
    ppe: boolean
  }
  timestamp: string
}

export async function submitInduction(data: InductionData) {
  try {
    // Find or create the user
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

    // Create the site induction record
    const induction = await prisma.siteInduction.create({
      data: {
        userId: user.id,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        medicalConditions: data.medicalConditions,
        siteRulesAcknowledged: data.acknowledgements.siteRules,
        emergencyProceduresAcknowledged: data.acknowledgements.emergencyProcedures,
        hazardsAcknowledged: data.acknowledgements.hazards,
        ppeAcknowledged: data.acknowledgements.ppe,
        timestamp: new Date(data.timestamp),
      },
    })

    return { success: true, induction }
  } catch (error) {
    console.error("Error submitting induction form:", error)
    throw new Error("Failed to submit induction form")
  }
}

