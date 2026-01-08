"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Upload, CheckCircle } from "lucide-react"

export default function VerifyAgentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nin: "",
    companyName: "",
    agentName: "",
    location: "",
    biometricData: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/verify-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStep(3)
      }
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Agent Verification</h1>
          <p className="text-lg text-foreground/60">Complete your verification to start listing properties</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step ? "bg-primary text-white" : "bg-muted text-foreground/40"
                }`}
              >
                {s < step ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 transition-all ${s < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Provide your identification details</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep(2)
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">NIN (National ID Number)</label>
                  <input
                    type="text"
                    required
                    value={formData.nin}
                    onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                    placeholder="Enter your NIN"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City/Region"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                  Next: Company Information
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Company & Biometric Details</CardTitle>
              <CardDescription>Provide business information and biometric data</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Your real estate company"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Biometric Data</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
                    <p className="text-sm text-foreground/60">
                      Upload biometric scan (fingerprint, iris scan, or facial scan)
                    </p>
                    <input
                      type="file"
                      required
                      onChange={(e) => setFormData({ ...formData, biometricData: e.target.files?.[0]?.name || "" })}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-primary to-accent">
                    {loading ? "Submitting..." : "Submit for Verification"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-border/50 border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Verification Submitted</h2>
                <p className="text-foreground/60 max-w-md mx-auto">
                  Your verification details have been submitted. Our team will review your information within 24-48
                  hours. You'll receive an email once your account is verified.
                </p>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-primary to-accent">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
