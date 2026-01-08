"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface InquiryStats {
  total: number
  byType: { type: string; count: number }[]
  byStatus: { status: string; count: number }[]
  recentInquiries: any[]
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<InquiryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get all inquiries for agent
      const { data: inquiries } = await supabase
        .from("inquiries")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false })

      if (!inquiries) {
        setLoading(false)
        return
      }

      // Count by type
      const byType = [
        {
          type: "General",
          count: inquiries.filter((i) => i.inquiry_type === "general").length,
        },
        {
          type: "Viewing",
          count: inquiries.filter((i) => i.inquiry_type === "viewing").length,
        },
        {
          type: "Offer",
          count: inquiries.filter((i) => i.inquiry_type === "offer").length,
        },
      ]

      // Count by status
      const byStatus = [
        { status: "New", count: inquiries.filter((i) => i.status === "new").length },
        { status: "Contacted", count: inquiries.filter((i) => i.status === "contacted").length },
        { status: "Viewing", count: inquiries.filter((i) => i.status === "viewing_scheduled").length },
        { status: "Closed", count: inquiries.filter((i) => i.status === "closed").length },
      ]

      setStats({
        total: inquiries.length,
        byType,
        byStatus,
        recentInquiries: inquiries.slice(0, 10),
      })
    } catch (err) {
      console.error("Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading analytics...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Inquiries by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.byType || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inquiries by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.byStatus || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats?.recentInquiries || []).map((inquiry) => (
              <div key={inquiry.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{inquiry.name}</h4>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    <p className="text-sm text-gray-500 mt-1">{inquiry.message?.substring(0, 100)}...</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">{inquiry.inquiry_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
