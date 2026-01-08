"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

function ContactFormContent() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get("property_id")
  const agentId = searchParams.get("agent_id")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "general",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!propertyId || !agentId) {
        throw new Error("Property or agent information missing")
      }

      const { error: insertError } = await supabase.from("inquiries").insert({
        property_id: propertyId,
        agent_id: agentId,
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        inquiry_type: formData.inquiryType,
        status: "new",
      })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({ name: "", email: "", phone: "", inquiryType: "general", message: "" })

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send inquiry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <Link href="/properties" className="flex items-center gap-2 font-bold">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="general">General Inquiry</option>
                  <option value="viewing">Schedule Viewing</option>
                  <option value="offer">Make an Offer</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  rows={5}
                  required
                />
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                  Thank you! Your inquiry has been sent to the agent.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ContactFormContent />
    </Suspense>
  )
}
