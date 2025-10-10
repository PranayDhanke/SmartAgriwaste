"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Leaf, Upload } from "lucide-react";
import ProductList from "@/../public/Products/Product.json";

type WasteType = "crop" | "fruit" | "vegetable";

interface WasteFormData {
  title: string;
  wasteType: WasteType | "";
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  location: string;
  description: string;
  image: File | null;
}

export default function ListWaste() {
  const [formData, setFormData] = useState<WasteFormData>({
    title: "",
    wasteType: "",
    wasteProduct: "",
    quantity: "",
    moisture: "",
    price: "",
    location: "",
    description: "",
    image: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert File to base64 if needed
    let imageBase64 = null;
    if (formData.image) {
      imageBase64 = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(formData.image!);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
      });
    }

    const payload = { ...formData, image: imageBase64 };

    const res = await fetch("/api/waste/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert(res.ok);
    
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
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
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Cotton crop residues"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Type of Waste & Product */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type of Waste *</Label>
                <Select
                  required
                  onValueChange={(value: WasteType) =>
                    setFormData({ ...formData, wasteType: value })
                  }
                  value={formData.wasteType}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crop">🌾 Crop residues</SelectItem>
                    <SelectItem value="fruit">🍓 Fruit</SelectItem>
                    <SelectItem value="vegetable">🥬 Vegetables</SelectItem>
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
                  value={formData.wasteProduct}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select waste product" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.wasteType &&
                      ProductList[formData.wasteType].map((item: string) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity & Moisture */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Quantity *</Label>
                <Input
                  placeholder="e.g. 2 tons, 500 kg"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Moisture Level *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, moisture: value })
                  }
                  value={formData.moisture}
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
            </div>

            {/* Price & Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Price (per ton/kg) *</Label>
                <Input
                  placeholder="e.g. ₹2000 / ton"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Location *</Label>
                <Input
                  placeholder="e.g. Nashik, Maharashtra"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                placeholder="Add details like freshness, handling method, or usage..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Upload Image */}
            <div className="space-y-1">
              <Label>Upload Image (optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
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
  );
}
