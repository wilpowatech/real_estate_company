"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  price: number
  listing_type: "sale" | "rent"
  is_published: boolean
  bedrooms: number
  bathrooms: number
  city: string
  created_at: string
}

export default function MyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false })

      setProperties(data || [])
    } catch (err) {
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      await supabase.from("properties").update({ is_published: !isPublished }).eq("id", id)

      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !isPublished } : p)))
    } catch (err) {
      console.error("Error updating property:", err)
    }
  }

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      await supabase.from("properties").delete().eq("id", id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting property:", err)
    }
  }

  if (loading) {
    return <div className="p-8">Loading your listings...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/dashboard/add-property">Add Property</Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No properties listed yet</p>
              <Button asChild>
                <Link href="/dashboard/add-property">Create Your First Listing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <Badge variant={property.listing_type === "sale" ? "default" : "secondary"}>
                        {property.listing_type === "sale" ? "For Sale" : "For Rent"}
                      </Badge>
                      <Badge variant={property.is_published ? "default" : "outline"}>
                        {property.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.city} • {property.bedrooms}BR • {property.bathrooms}BA
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      ${property.price.toLocaleString()}
                      {property.listing_type === "rent" && "/mo"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(property.id, property.is_published)}>
                      {property.is_published ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Hide
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/listings/${property.id}/edit`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProperty(property.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
