"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, MapPin, Bed, Bath, Ruler, Mail, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PropertyDetail {
  id: string
  title: string
  description: string
  price: number
  listing_type: "sale" | "rent"
  bedrooms: number
  bathrooms: number
  square_feet: number
  address: string
  city: string
  state: string
  zip_code: string
  features: string[]
  property_media: Array<{ id: string; media_url: string; media_type: string }>
  agent_id: string
  agents: { full_name: string; email: string; phone: string; agency_name: string; avatar_url: string }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    fetchPropertyDetails()
  }, [id])

  const fetchPropertyDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          *,
          agents:agent_id(full_name, email, phone, agency_name, avatar_url),
          property_media(id, media_url, media_type)
        `,
        )
        .eq("id", id)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (err) {
      console.error("Error fetching property:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading property details...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Button asChild>
          <Link href="/properties">Back to Properties</Link>
        </Button>
      </div>
    )
  }

  const images = property.property_media.filter((m) => m.media_type === "image")
  const currentImage = images[selectedImageIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/properties" className="flex items-center gap-2 font-bold text-xl">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-8">
            <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <Image
                src={currentImage.media_url || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                      idx === selectedImageIndex ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.media_url || "/placeholder.svg"}
                      alt={`Property ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5" />
              <span>
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </span>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-8">
              ${property.price.toLocaleString()}
              {property.listing_type === "rent" && <span className="text-xl text-gray-600">/month</span>}
            </div>

            {/* Property Features */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Bed className="w-5 h-5" />
                      <span className="text-sm">Bedrooms</span>
                    </div>
                    <div className="text-2xl font-bold">{property.bedrooms}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Bath className="w-5 h-5" />
                      <span className="text-sm">Bathrooms</span>
                    </div>
                    <div className="text-2xl font-bold">{property.bathrooms}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Ruler className="w-5 h-5" />
                      <span className="text-sm">Square Feet</span>
                    </div>
                    <div className="text-2xl font-bold">{property.square_feet.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Agent Card */}
          {property.agents && (
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.agents.avatar_url && (
                    <div className="mb-4">
                      <Image
                        src={property.agents.avatar_url || "/placeholder.svg"}
                        alt={property.agents.full_name}
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-full mx-auto"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-center mb-2">{property.agents.full_name}</h3>
                  {property.agents.agency_name && (
                    <p className="text-sm text-gray-600 text-center mb-4">{property.agents.agency_name}</p>
                  )}

                  <div className="space-y-3 mb-6">
                    {property.agents.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${property.agents.email}`} className="text-blue-600 hover:underline text-sm">
                          {property.agents.email}
                        </a>
                      </div>
                    )}
                    {property.agents.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${property.agents.phone}`} className="text-blue-600 hover:underline text-sm">
                          {property.agents.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full mb-3">
                    <Link href={`/contact?property_id=${property.id}&agent_id=${property.agent_id}`}>
                      Contact Agent
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Schedule Viewing
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
