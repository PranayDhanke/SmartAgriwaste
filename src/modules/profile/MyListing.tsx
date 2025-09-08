"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, ShoppingCart, Filter } from "lucide-react"

export default function MyListing() {
  const [search, setSearch] = useState("")

  const listings = [
    {
      id: 1,
      title: "Cotton Crop Residues",
      type: "Crop",
      price: "₹2000 / ton",
      location: "Pune, Maharashtra",
      quantity: "2 tons",
      moisture: "Dry",
    },
    {
      id: 2,
      title: "Vegetable Waste (Cabbage, Tomato)",
      type: "Vegetable",
      price: "₹1500 / ton",
      location: "Nashik, Maharashtra",
      quantity: "1.5 tons",
      moisture: "Semi-wet",
    },
    {
      id: 3,
      title: "Fruit Waste (Mango Pulp)",
      type: "Fruit",
      price: "₹2500 / ton",
      location: "Nagpur, Maharashtra",
      quantity: "3 tons",
      moisture: "Wet",
    },
  ]

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-green-700">
          <Leaf className="h-8 w-8" /> Waste Listings
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <Card key={item.id} className="shadow-lg border-0 bg-white hover:shadow-xl transition">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {item.title}
                <Badge
                  className={`${
                    item.type === "Crop"
                      ? "bg-green-100 text-green-700"
                      : item.type === "Vegetable"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {item.type}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <p><span className="font-medium">Price:</span> {item.price}</p>
              <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
              <p><span className="font-medium">Moisture:</span> {item.moisture}</p>
              <p><span className="font-medium">Location:</span> {item.location}</p>

              <Button className="w-full mt-3">
                <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
