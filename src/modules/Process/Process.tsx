"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Process() {
  const [formData, setFormData] = useState({
    wasteType: "",
    quantity: "",
    moisture: "",
    currentMethod: "",
    intendedUse: "",
    resources: [] as string[],
    contamination: "no",
    notes: "",
  })

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      if (prev.resources.includes(value)) {
        return { ...prev, resources: prev.resources.filter((r) => r !== value) }
      } else {
        return { ...prev, resources: [...prev.resources, value] }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    alert("Fetching waste management processes...")
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-green-700 text-2xl">
              Find Waste Management Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Waste Type */}
              <div className="space-y-2">
                <Label>Type of Waste</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, wasteType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">Crop residues (straw, husk, stalks, leaves)</SelectItem>
                    <SelectItem value="fruitveg">Fruit & vegetable waste</SelectItem>
                    <SelectItem value="manure">Animal manure</SelectItem>
                    <SelectItem value="forestry">Agro-forestry waste (wood, sawdust, branches)</SelectItem>
                    <SelectItem value="processing">Food processing/agro-industry waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label>Quantity of Waste (Number + Unit)</Label>
                <Input
                  placeholder="e.g. 50 kg, 2 tons"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              {/* Moisture Condition */}
              <div className="space-y-2">
                <Label>Moisture Condition</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, moisture: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select moisture condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="semiwet">Semi-wet</SelectItem>
                    <SelectItem value="wet">Wet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Handling Method */}
              <div className="space-y-2">
                <Label>Current Handling Method (Optional)</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, currentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="burning">Burning</SelectItem>
                    <SelectItem value="dumping">Dumping</SelectItem>
                    <SelectItem value="feeding">Feeding animals</SelectItem>
                    <SelectItem value="none">No management yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Intended Use */}
              <div className="space-y-2">
                <Label>Intended Use / Goal</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, intendedUse: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intended use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compost">Compost / Fertilizer for soil</SelectItem>
                    <SelectItem value="biogas">Biogas / Energy</SelectItem>
                    <SelectItem value="feed">Animal feed</SelectItem>
                    <SelectItem value="sell">Sell as raw material (biomass, fuel, etc.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resources / Facilities */}
              <div className="space-y-2">
                <Label>Available Resources / Facilities (Multi-select)</Label>
                <div className="grid gap-2">
                  {[
                    "Compost pit / Vermicomposting unit",
                    "Biogas plant nearby",
                    "Access to biomass power plant",
                    "Open field for mulching",
                    "None",
                  ].map((resource) => (
                    <label key={resource} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.resources.includes(resource)}
                        onCheckedChange={() => handleCheckboxChange(resource)}
                      />
                      <span>{resource}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chemical Contamination */}
              <div className="space-y-2">
                <Label>Any Chemical Contamination?</Label>
                <RadioGroup
                  value={formData.contamination}
                  onValueChange={(value) => setFormData({ ...formData, contamination: value })}
                >
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="yes" /> Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="no" /> No
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Additional Notes (optional)</Label>
                <Textarea
                  placeholder="Any extra details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Get Processes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
