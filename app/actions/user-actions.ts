"use server"

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
    const response = await fetch("/api/signin-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to record sign in/out")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error recording sign in/out:", error)
    throw new Error("Failed to record sign in/out")
  }
}

