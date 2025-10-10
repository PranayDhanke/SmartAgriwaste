"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Edit, Trash2, Filter } from "lucide-react"

type WasteType = "crop" | "fruit" | "vegetable"

interface WasteFormData {
  id: number
  title: string
  wasteType: WasteType | ""
  wasteProduct: string
  quantity: string
  moisture: string
  price: string
  location: string
  description: string
  image: File | null
}

export default function MyListing() {
  const [search, setSearch] = useState("")

  const [listings, setListings] = useState<WasteFormData[]>([
    {
      id: 1,
      title: "Cotton Crop Residues",
      wasteType: "crop",
      wasteProduct: "Cotton",
      quantity: "2 tons",
      moisture: "dry",
      price: "₹2000 / ton",
      location: "Pune, Maharashtra",
      description: "Fresh crop residues",
      image: null,
    },
    {
      id: 2,
      title: "Vegetable Waste (Cabbage, Tomato)",
      wasteType: "vegetable",
      wasteProduct: "Cabbage",
      quantity: "1.5 tons",
      moisture: "semiwet",
      price: "₹1500 / ton",
      location: "Nashik, Maharashtra",
      description: "Mixed vegetable waste",
      image: null,
    },
    {
      id: 3,
      title: "Fruit Waste (Mango Pulp)",
      wasteType: "fruit",
      wasteProduct: "Mango",
      quantity: "3 tons",
      moisture: "wet",
      price: "₹2500 / ton",
      location: "Nagpur, Maharashtra",
      description: "Mango pulp waste",
      image: null,
    },
  ])

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (id: number) => {
    console.log("Edit listing", id)
    alert(`Edit listing ${id}`)
  }

  const handleDelete = (id: number) => {
    setListings((prev) => prev.filter((item) => item.id !== id))
  }

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
                    item.wasteType === "crop"
                      ? "bg-green-100 text-green-700"
                      : item.wasteType === "vegetable"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {item.wasteType}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p><span className="font-medium">Product:</span> {item.wasteProduct}</p>
              <p><span className="font-medium">Price:</span> {item.price}</p>
              <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
              <p><span className="font-medium">Moisture:</span> {item.moisture}</p>
              <p><span className="font-medium">Location:</span> {item.location}</p>
              <p><span className="font-medium">Description:</span> {item.description}</p>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleEdit(item.id)}
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
