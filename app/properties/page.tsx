"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  price: number
  listing_type: "sale" | "rent"
  bedrooms: number
  bathrooms: number
  square_feet: number
  city: string
  state: string
  property_type: string
  property_media: Array<{ media_url: string }>
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all")
  const [searchCity, setSearchCity] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [propertyType, setPropertyType] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    fetchProperties()
  }, [listingType, searchCity, minPrice, maxPrice, bedrooms, propertyType])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("properties")
        .select(`
        id,
        title,
        price,
        listing_type,
        bedrooms,
        bathrooms,
        square_feet,
        city,
        state,
        property_type,
        property_media(media_url)
      `)
        .eq("is_published", true)

      if (listingType !== "all") {
        query = query.eq("listing_type", listingType)
      }

      if (searchCity) {
        query = query.ilike("city", `%${searchCity}%`)
      }

      if (minPrice) {
        query = query.gte("price", Number.parseFloat(minPrice))
      }

      if (maxPrice) {
        query = query.lte("price", Number.parseFloat(maxPrice))
      }

      if (bedrooms) {
        query = query.gte("bedrooms", Number.parseInt(bedrooms))
      }

      if (propertyType) {
        query = query.eq("property_type", propertyType)
      }

      const { data, error } = await query

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ChevronLeft className="w-5 h-5" />
            Properties
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter Properties</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Listing Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setListingType("all")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    listingType === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setListingType("sale")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    listingType === "sale" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Sale
                </button>
                <button
                  onClick={() => setListingType("rent")}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    listingType === "rent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* City Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input placeholder="Search by city" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
            </div>

            {/* Min Price */}
            <div>
              <label className="text-sm font-medium mb-2 block">Min Price</label>
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium mb-2 block">Max Price</label>
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-sm font-medium mb-2 block">Min Bedrooms</label>
              <Input
                type="number"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <Button
            onClick={() => {
              setListingType("all")
              setSearchCity("")
              setMinPrice("")
              setMaxPrice("")
              setBedrooms("")
              setPropertyType("")
            }}
            variant="outline"
            className="w-full md:w-auto"
          >
            Reset Filters
          </Button>
        </Card>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{properties.length}</span> properties
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  listingType={property.listing_type}
                  bedrooms={property.bedrooms || 0}
                  bathrooms={property.bathrooms || 0}
                  squareFeet={property.square_feet || 0}
                  city={property.city}
                  state={property.state || ""}
                  imageUrl={property.property_media[0]?.media_url}
                  propertyType={property.property_type}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
