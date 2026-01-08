"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MediaUpload } from "@/components/media-upload"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  file?: File
}

export default function EditPropertyPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const supabase = createClient()

  const [property, setProperty] = useState<any>(null)
  const [media, setMedia] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    features: "",
  })

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const { data } = await supabase
        .from("properties")
        .select(
          `
          *,
          property_media(id, media_url, media_type)
        `,
        )
        .eq("id", id)
        .single()

      if (data) {
        setProperty(data)
        setFormData({
          title: data.title,
          description: data.description || "",
          price: data.price.toString(),
          bedrooms: (data.bedrooms || "").toString(),
          bathrooms: (data.bathrooms || "").toString(),
          squareFeet: (data.square_feet || "").toString(),
          features: (data.features || []).join(", "),
        })

        // Load existing media
        const existingMedia = data.property_media.map((m: any) => ({
          id: m.id,
          url: m.media_url,
          type: m.media_type,
        }))
        setMedia(existingMedia)
      }
    } catch (err) {
      setError("Failed to load property")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediaUpload = (uploadedMedia: MediaFile[]) => {
    setMedia(uploadedMedia)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError(null)

    try {
      const features = formData.features.split(",").map((f) => f.trim())

      // Update property
      await supabase
        .from("properties")
        .update({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          bedrooms: Number.parseInt(formData.bedrooms),
          bathrooms: Number.parseFloat(formData.bathrooms),
          square_feet: Number.parseFloat(formData.squareFeet),
          features: features,
        })
        .eq("id", id)

      // Handle media uploads to Cloudinary would go here
      // For now, we're storing the file references in Supabase

      router.push("/dashboard/listings")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update property")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <Link href="/dashboard/listings" className="flex items-center gap-2 mb-8 text-blue-600 hover:underline">
        <ChevronLeft className="w-4 h-4" />
        Back to Listings
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <Input name="price" type="number" value={formData.price} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                <Input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                <Input
                  name="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Square Feet</label>
                <Input name="squareFeet" type="number" value={formData.squareFeet} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Features</label>
              <Input
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Pool, Garage, etc."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-4 block">Property Media</label>
              <MediaUpload onMediaUpload={handleMediaUpload} maxFiles={20} />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={uploading}>
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
