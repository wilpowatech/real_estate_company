import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .or(`agent_id.eq.${user.id},client_id.eq.${user.id}`)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ conversations: conversations || [] })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
