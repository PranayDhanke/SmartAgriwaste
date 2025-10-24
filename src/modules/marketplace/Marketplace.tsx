"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Filter,
  MapPin,
  Leaf,
  Recycle,
  Factory,
  Search,
  ChevronRight,
  Droplets,
} from "lucide-react";
import Image from "next/image";

type WasteType = "crop" | "fruit" | "vegetable";

interface WasteItem {
  _id: string;
  title: string;
  wasteType: WasteType;
  wasteProduct: string;
  quantity: string;
  moisture: string;
  price: string;
  location: string;
  description: string;
  imageUrl: string;
}

const categoryMeta: Record<WasteType, { label: string; icon: JSX.Element; color: string }> = {
  crop: { 
    label: "Crop", 
    icon: <Recycle className="h-3.5 w-3.5" />,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  fruit: { 
    label: "Fruit", 
    icon: <Leaf className="h-3.5 w-3.5" />,
    color: "bg-orange-100 text-orange-700 border-orange-200"
  },
  vegetable: {
    label: "Vegetable",
    icon: <Factory className="h-3.5 w-3.5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
};

export default function Marketplace() {
  const [wastes, setWastes] = useState<WasteItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/waste/get");
        if (res.ok) {
          const data = await res.json();
          setWastes(data.wastedata || []);
        } else {
          console.error("Failed to fetch waste listings");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...wastes];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.wasteProduct.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.wasteType === category);
    }

    if (location.trim()) {
      const locq = location.toLowerCase();
      list = list.filter((p) => p.location.toLowerCase().includes(locq));
    }

    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    list = list.filter((p) => {
      const price = parseFloat(p.price);
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      return true;
    });

    if (sortBy === "price-asc")
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === "price-desc")
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortBy === "name") list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [wastes, search, category, location, minPrice, maxPrice, sortBy]);

  const handleAddToCart = (item: WasteItem) => {
    alert(`Added to cart: ${item.title}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Discover agricultural waste for sustainable solutions</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for waste products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white border-gray-200 focus:border-green-500"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={category === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("all")}
            className={category === "all" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            All
          </Button>
          <Button
            variant={category === "crop" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("crop")}
            className={category === "crop" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <Recycle className="h-3.5 w-3.5 mr-1.5" />
            Crops
          </Button>
          <Button
            variant={category === "fruit" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("fruit")}
            className={category === "fruit" ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            <Leaf className="h-3.5 w-3.5 mr-1.5" />
            Fruits
          </Button>
          <Button
            variant={category === "vegetable" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory("vegetable")}
            className={category === "vegetable" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Factory className="h-3.5 w-3.5 mr-1.5" />
            Vegetables
          </Button>
          
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              {showFilters ? "Hide" : "More"} Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Location</Label>
                <Input
                  placeholder="City / District"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Min Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Max Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name (A–Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> products available
          </p>
          {!showFilters && (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Card key={p._id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                {p.imageUrl ? (
                  <Image 
                    src={p.imageUrl} 
                    alt={p.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={`${categoryMeta[p.wasteType].color} border text-xs font-medium px-2 py-0.5`}>
                    {categoryMeta[p.wasteType].label}
                  </Badge>
                </div>
              </div>

              <CardHeader className="-mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{p.wasteProduct}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{p.location}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className=" space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-green-600">₹{p.price}</span>
                    <span className="text-xs text-gray-500"> /unit</span>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Droplets className="h-3 w-3" />
                    {p.moisture}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleAddToCart(p)}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
                <Link href={`/marketplace/${p._id}`} className="flex-1">
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs bg-green-600 hover:bg-green-700"
                  >
                    Details
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-xl bg-white p-12 text-center border">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </section>
    </main>
  );
}