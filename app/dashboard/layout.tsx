import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AgentSidebar from "@/components/agent-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is agent or admin
  const { data: userData } = await supabase.from("users").select("user_type").eq("id", user.id).single()

  if (userData?.user_type !== "agent" && userData?.user_type !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex h-screen">
      <AgentSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
