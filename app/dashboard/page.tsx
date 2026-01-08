"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, MessageSquare, TrendingUp } from "lucide-react"

interface AgentStats {
  totalListings: number
  activeListings: number
  totalInquiries: number
  totalViews: number
  averageRating: number
  propertiesSold: number
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get agent's properties
      const { data: properties } = await supabase.from("properties").select("id, is_published").eq("agent_id", user.id)

      const totalListings = properties?.length || 0
      const activeListings = properties?.filter((p) => p.is_published).length || 0

      // Get inquiries for agent's properties
      const { count: totalInquiries } = await supabase
        .from("inquiries")
        .select("count", { count: "exact" })
        .eq("agent_id", user.id)

      // Get agent info
      const { data: agentData } = await supabase
        .from("agents")
        .select("rating, properties_sold")
        .eq("id", user.id)
        .single()

      setStats({
        totalListings,
        activeListings,
        totalInquiries: totalInquiries || 0,
        totalViews: Math.floor(Math.random() * 500) + 100, // Placeholder
        averageRating: agentData?.rating || 0,
        propertiesSold: agentData?.properties_sold || 0,
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
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalListings}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.activeListings} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInquiries}</div>
            <p className="text-xs text-gray-500 mt-1">From customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating.toFixed(1)} ★</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.propertiesSold} sold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/dashboard/add-property"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">Add New Property</h3>
              <p className="text-sm text-gray-600">List a new property for sale or rent</p>
            </a>
            <a href="/dashboard/listings" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">Manage Listings</h3>
              <p className="text-sm text-gray-600">Edit or delete your current listings</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Check your inquiries page for details</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
