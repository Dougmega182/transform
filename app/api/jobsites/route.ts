import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch job sites from the database
    const jobSites = await prisma.jobSite.findMany();
    
    return NextResponse.json(jobSites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job sites" }, { status: 500 });
  }
}
