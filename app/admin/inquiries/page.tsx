"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  inquiry_type: string
  status: string
  message: string
  created_at: string
  property_id: string
  properties: { title: string }
  agent_id: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    fetchInquiries()
  }, [filterStatus])

  const fetchInquiries = async () => {
    try {
      let query = supabase
        .from("inquiries")
        .select(`
          *,
          properties(title)
        `)
        .order("created_at", { ascending: false })

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus)
      }

      const { data } = await query
      setInquiries(data || [])
    } catch (err) {
      console.error("Error fetching inquiries:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from("inquiries").update({ status: newStatus }).eq("id", id)

      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)))
    } catch (err) {
      console.error("Error updating inquiry:", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "viewing_scheduled":
        return "bg-purple-100 text-purple-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="p-8">Loading inquiries...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Customer Inquiries</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8">
        {["all", "new", "contacted", "viewing_scheduled", "closed"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
            size="sm"
          >
            {status === "all" ? "All" : status.replace("_", " ").toUpperCase()}
          </Button>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">No inquiries found</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{inquiry.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Property: {inquiry.properties?.title}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-4">{inquiry.message}</p>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Type</p>
                        <Badge variant="outline">{inquiry.inquiry_type.replace("_", " ").toUpperCase()}</Badge>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Status</p>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2">Date</p>
                        <p className="text-sm">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {inquiry.status !== "contacted" && (
                        <Button size="sm" onClick={() => updateInquiryStatus(inquiry.id, "contacted")}>
                          Mark Contacted
                        </Button>
                      )}
                      {inquiry.status !== "viewing_scheduled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateInquiryStatus(inquiry.id, "viewing_scheduled")}
                        >
                          Schedule Viewing
                        </Button>
                      )}
                      {inquiry.status !== "closed" && (
                        <Button size="sm" variant="ghost" onClick={() => updateInquiryStatus(inquiry.id, "closed")}>
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
