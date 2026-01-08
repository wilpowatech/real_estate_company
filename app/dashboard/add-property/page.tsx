"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddPropertyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "house",
    listingType: "sale",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    features: "",
  })

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

      if (!user) throw new Error("Not authenticated")

      const features = formData.features.split(",").map((f) => f.trim())

      const { data, error: insertError } = await supabase
        .from("properties")
        .insert({
          agent_id: user.id,
          title: formData.title,
          description: formData.description,
          property_type: formData.propertyType,
          listing_type: formData.listingType,
          price: Number.parseFloat(formData.price),
          bedrooms: Number.parseInt(formData.bedrooms),
          bathrooms: Number.parseFloat(formData.bathrooms),
          square_feet: Number.parseFloat(formData.squareFeet),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          features: features,
          is_published: true,
        })
        .select()

      if (insertError) throw insertError

      router.push(`/dashboard/listings/${data[0].id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Beautiful 3BR Home in Downtown"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property"
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Listing Type</label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                <Input
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                <Input
                  name="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Square Feet</label>
                <Input
                  name="squareFeet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                <Input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="12345" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Features (comma-separated)</label>
              <Input
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Pool, Garage, Central AC, Hardwood Floors"
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
