import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { nin, companyName, agentName, location, biometricData } = body

    const { error } = await supabase.from("agent_verifications").insert({
      agent_id: user.id,
      nin,
      company_name: companyName,
      agent_name: agentName,
      location,
      biometric_data: biometricData,
      verification_status: "pending",
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
