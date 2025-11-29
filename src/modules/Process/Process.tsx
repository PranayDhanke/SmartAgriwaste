"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProductList from "@/../public/Products/Product.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import {
  Leaf,
  Recycle,
  Target,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { WasteForm, WasteType } from "@/components/types/ListWaste";

export default function Process() {
  const [formData, setFormData] = useState<WasteForm>({
    wasteType: "",
    wasteProduct: "",
    quantity: "",
    moisture: "",
    currentMethod: "",
    intendedUse: "",
    contamination: "no",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(formData);
    setIsSubmitting(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Smart Waste Management
              </h1>
              <p className="text-gray-600 mt-1">
                Find the best processing methods for your agricultural waste
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-8">
                  {/* Waste Classification */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Waste Classification</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type of Waste *</Label>
                          <Select
                            required
                            onValueChange={(value: WasteType) =>
                              setFormData({ ...formData, wasteType: value })
                            }
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your waste type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crop">
                                🌾 Crop residues
                              </SelectItem>
                              <SelectItem value="fruit">🥬 Fruit</SelectItem>
                              <SelectItem value="vegetable">
                                🥬 Vegetables
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Type of Product *</Label>
                          <Select
                            disabled={!formData.wasteType}
                            required
                            onValueChange={(value) =>
                              setFormData({ ...formData, wasteProduct: value })
                            }
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your waste product" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.wasteType &&
                                ProductList[formData.wasteType].map(
                                  (item: string) => (
                                    <SelectItem key={item} value={item}>
                                      {item}
                                    </SelectItem>
                                  )
                                )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Quantity *</Label>
                          <Input
                            required
                            placeholder="e.g. 50 kg, 2 tons"
                            value={formData.quantity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Moisture *</Label>
                          <Select
                            required
                            onValueChange={(value) =>
                              setFormData({ ...formData, moisture: value })
                            }
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select moisture" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dry">☀️ Dry</SelectItem>
                              <SelectItem value="semiwet">
                                🌤️ Semi-wet
                              </SelectItem>
                              <SelectItem value="wet">💧 Wet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* Processing Preferences */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Processing Preferences</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Current Handling</Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({ ...formData, currentMethod: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How do you handle it?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="burning">🔥 Burning</SelectItem>
                            <SelectItem value="dumping">🗑️ Dumping</SelectItem>
                            <SelectItem value="none">❓ None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Intended Use *</Label>
                        <Select
                          required
                          onValueChange={(value) =>
                            setFormData({ ...formData, intendedUse: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="What’s your goal?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compost">🌱 Compost</SelectItem>
                            <SelectItem value="biogas">⚡ Biogas</SelectItem>
                            <SelectItem value="feed">🐄 Animal feed</SelectItem>
                            <SelectItem value="sell">💰 Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* Safety */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">Safety Information</h3>
                    </div>
                    <RadioGroup
                      value={formData.contamination}
                      onValueChange={(value) =>
                        setFormData({ ...formData, contamination: value })
                      }
                      className="flex gap-6"
                    >
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="yes" /> Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="no" /> No
                      </label>
                    </RadioGroup>
                  </section>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any constraints or details..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold"
                  >
                    {isSubmitting ? "Processing..." : "Get Recommendations"}
                    {!isSubmitting && <ChevronRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips 💡</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-700">
                <p>✔️ Accurate quantity = better suggestions</p>
                <p>✔️ Moisture matters for composting vs. biogas</p>
                <p>✔️ Available facilities help us refine results</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
