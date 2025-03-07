"use server"

import prisma from "@/lib/prisma"

export type InductionData = {
  project: string
  manager: string
  date: Date
  company: string
  name: string
  description: string
  plant: string
  plantInduction?: string
  highRiskLicence?: string
  hotWorks: string
  materials: string
  terms: boolean
}

export async function submitInduction(data: InductionData) {
  try {
    // Map the form data to the database schema
    const inductionRecord = await prisma.siteInduction.create({
      data: {
        jobSiteId: data.project, // Assuming project is the jobSiteId
        projectManager: data.manager,
        inductionDate: data.date,
        contractorCompany: data.company,
        contractorName: data.name,
        jobDescription: data.description,
        usesPlant: data.plant === "yes",
        plantInductionDetails: data.plantInduction,
        highRiskWorkLicence: data.highRiskLicence,
        requiresHotWorks: data.hotWorks === "yes",
        materialsApproval: data.materials,
        // Set default values for other required fields
        tcSecurityAccess: false,
        tcDamageResponsibility: false,
        tcRubbishRemoval: false,
        tcIncidentReporting: false,
        tcSafetyClothing: false,
        tcNoSmoking: false,
        tcDrugsAlcohol: false,
        tcSunSmart: false,
        tcFoodWaste: false,
        bsNoBullying: false,
        bsNoTheft: false,
        bsSafetyInstructions: false,
        bsSafetyControls: false,
        bsScaffolding: false,
        bsJoineryProtection: false,
        swmsProvided: false,
        constructionInduction: false,
        safetyIssuesIdentified: false,
        facilitiesShown: false,
        workAreaShown: false,
        sanitaryWipesAcknowledged: false,
        hazardBoardReviewed: false,
        ohsPlanLocation: false,
        incidentProcedure: false,
        emergencyProcedure: false,
        ppeProcedure: false,
        securityProcedure: false,
        questionsAnswered: false,
        inducteeSignature: "",
        acknowledgement: data.terms,
        userId: "example-user-id", // In a real app, get this from the session
      },
    })

    console.log("Induction submitted:", inductionRecord)

    return { success: true, inductionRecord }
  } catch (error) {
    console.error("Error submitting induction:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }
  }
}

