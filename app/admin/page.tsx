"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Building2, Users, MessageSquare } from "lucide-react"

interface DashboardStats {
  totalProperties: number
  totalAgents: number
  totalInquiries: number
  pendingAgentApprovals: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [propertiesData, agentsData, inquiriesData, pendingAgentsData] = await Promise.all([
        supabase.from("properties").select("count", { count: "exact" }),
        supabase.from("agents").select("count", { count: "exact" }),
        supabase.from("inquiries").select("count", { count: "exact" }),
        supabase.from("agents").select("count", { count: "exact" }).eq("verification_status", "pending"),
      ])

      setStats({
        totalProperties: propertiesData.count || 0,
        totalAgents: agentsData.count || 0,
        totalInquiries: inquiriesData.count || 0,
        pendingAgentApprovals: pendingAgentsData.count || 0,
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1">Listed on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAgents}</div>
            <p className="text-xs text-gray-500 mt-1">Verified and pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInquiries}</div>
            <p className="text-xs text-gray-500 mt-1">From customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingAgentApprovals}</div>
            <p className="text-xs text-gray-500 mt-1">Agent applications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/admin/properties" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">Manage Properties</h3>
              <p className="text-sm text-gray-600">View and manage all listed properties</p>
            </a>
            <a href="/admin/agents" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">Manage Agents</h3>
              <p className="text-sm text-gray-600">Approve or reject agent applications</p>
            </a>
            <a href="/admin/inquiries" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">View Inquiries</h3>
              <p className="text-sm text-gray-600">Track customer inquiries and inquiries</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
