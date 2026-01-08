import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  id: string
  title: string
  price: number
  listingType: "sale" | "rent"
  bedrooms: number
  bathrooms: number
  squareFeet: number
  city: string
  state: string
  imageUrl?: string
  propertyType: string
}

export function PropertyCard({
  id,
  title,
  price,
  listingType,
  bedrooms,
  bathrooms,
  squareFeet,
  city,
  state,
  imageUrl,
  propertyType,
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="relative w-full h-48 bg-gray-200">
          {imageUrl ? (
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
          )}
          <div className="absolute top-3 right-3">
            <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          <Badge className="absolute top-3 left-3" variant={listingType === "sale" ? "default" : "secondary"}>
            {listingType === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {city}, {state}
          </p>
          <div className="text-2xl font-bold text-blue-600 mb-4">
            ${price.toLocaleString()}
            {listingType === "rent" && <span className="text-sm text-gray-600">/mo</span>}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 border-t pt-3">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{bedrooms}</div>
              <div className="text-xs">Beds</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{bathrooms}</div>
              <div className="text-xs">Baths</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{squareFeet.toLocaleString()}</div>
              <div className="text-xs">Sqft</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
