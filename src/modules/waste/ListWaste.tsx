"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Leaf, Upload } from "lucide-react"

export default function ListWaste() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    quantity: "",
    moisture: "",
    price: "",
    location: "",
    description: "",
    image: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted:", formData)
    alert("Waste listed successfully ✅")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <Leaf className="h-7 w-7" /> List Your Agricultural Waste
      </h1>

      <Card className="max-w-3xl mx-auto shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-green-700">
            Waste Listing Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Cotton crop residues"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Type & Quantity */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Type of Waste *</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">🌾 Crop Residues</SelectItem>
                    <SelectItem value="vegetable">🥦 Vegetable Waste</SelectItem>
                    <SelectItem value="fruit">🍎 Fruit Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity *</Label>
                <Input
                  placeholder="e.g. 2 tons, 500 kg"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            {/* Moisture & Price */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Moisture Level *</Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, moisture: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select moisture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">☀️ Dry</SelectItem>
                    <SelectItem value="semiwet">🌤️ Semi-wet</SelectItem>
                    <SelectItem value="wet">💧 Wet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (per ton/kg) *</Label>
                <Input
                  placeholder="e.g. ₹2000 / ton"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label>Location *</Label>
              <Input
                placeholder="e.g. Nashik, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Add details like freshness, handling method, or usage..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Upload Image */}
            <div>
              <Label>Upload Image (optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files?.[0] || null })
                  }
                />
                <Upload className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-12 text-lg font-semibold">
              List Waste
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
