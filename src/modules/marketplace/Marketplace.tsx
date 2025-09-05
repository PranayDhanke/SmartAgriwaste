"use client"

import { JSX, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Recycle, Leaf, Factory, MapPin, Filter } from "lucide-react"
// (Optional) If you have shadcn toast installed:
// import { useToast } from "@/components/ui/use-toast"

type Product = {
  id: string
  name: string
  category: "biomass" | "compost" | "manure" | "agri-waste" | "feed"
  price: number
  unit: string
  location: string
  seller: string
  description: string
  image?: string
  tags?: string[]
  postedAt: string // ISO date
}

// --- Mock data (replace with DB/API later) ---
const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Paddy Straw Bales",
    category: "biomass",
    price: 2200,
    unit: "per ton",
    location: "Nanded, MH",
    seller: "Kisan Agro Group",
    description: "Clean paddy straw bales, ideal for biomass fuel and mushroom cultivation.",
    tags: ["Low moisture", "Baled"],
    postedAt: "2025-08-15",
  },
  {
    id: "p2",
    name: "Vermicompost Premium",
    category: "compost",
    price: 18,
    unit: "per kg",
    location: "Kolhapur, MH",
    seller: "GreenSoil Farms",
    description: "High-quality vermicompost, screened and matured. Great for vegetables and orchards.",
    tags: ["Organic", "Screened"],
    postedAt: "2025-07-28",
  },
  {
    id: "p3",
    name: "Cow Manure (Sun-dried)",
    category: "manure",
    price: 10,
    unit: "per kg",
    location: "Ahmedabad, GJ",
    seller: "Shree Dairy",
    description: "Sun-dried manure cakes and loose form available. Bulk orders only.",
    tags: ["Bulk", "Sun-dried"],
    postedAt: "2025-08-30",
  },
  {
    id: "p4",
    name: "Sugarcane Bagasse",
    category: "agri-waste",
    price: 1600,
    unit: "per ton",
    location: "Belagavi, KA",
    seller: "Cane Power Co-op",
    description: "Fresh bagasse for paper, board, and cogeneration feedstock.",
    tags: ["Industrial", "Fresh"],
    postedAt: "2025-06-10",
  },
  {
    id: "p5",
    name: "Maize Stover (Chopped)",
    category: "feed",
    price: 12,
    unit: "per kg",
    location: "Nagpur, MH",
    seller: "AgriFeed Hub",
    description: "Chopped stover suitable as roughage for cattle feed, low dust.",
    tags: ["Roughage", "Chopped"],
    postedAt: "2025-08-20",
  },
]

// Category label + icon
const categoryMeta: Record<
  Product["category"],
  { label: string; icon: JSX.Element }
> = {
  biomass: { label: "Biomass", icon: <Recycle className="h-4 w-4" /> },
  compost: { label: "Compost", icon: <Leaf className="h-4 w-4" /> },
  manure:  { label: "Manure", icon: <Leaf className="h-4 w-4" /> },
  "agri-waste": { label: "Agri Waste", icon: <Factory className="h-4 w-4" /> },
  feed: { label: "Animal Feed", icon: <Leaf className="h-4 w-4" /> },
}

export default function Marketplace() {
  // const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [location, setLocation] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("recent")

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice()

    // text search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    // category
    if (category !== "all") {
      list = list.filter(p => p.category === category)
    }

    // location contains
    if (location.trim()) {
      const locq = location.toLowerCase()
      list = list.filter(p => p.location.toLowerCase().includes(locq))
    }

    // price
    const min = minPrice ? Number(minPrice) : undefined
    const max = maxPrice ? Number(maxPrice) : undefined
    list = list.filter(p => {
      const price = p.price
      if (min !== undefined && price < min) return false
      if (max !== undefined && price > max) return false
      return true
    })

    // sort
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price)
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price)
    if (sortBy === "recent")
      list.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      )
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [search, category, location, minPrice, maxPrice, sortBy])

  const handleAddToCart = (p: Product) => {
    // toast?.({ title: "Added to cart", description: p.name })
    alert(`Added to cart: ${p.name}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-green-700">Marketplace</h1>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            {filtered.length} items
          </Badge>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search compost, straw, bagasse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category}  onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="biomass">Biomass</SelectItem>
                  <SelectItem value="compost">Compost</SelectItem>
                  <SelectItem value="manure">Manure</SelectItem>
                  <SelectItem value="agri-waste">Agri Waste</SelectItem>
                  <SelectItem value="feed">Animal Feed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City / District"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2 space-y-2">
                <Label htmlFor="minp">Min ₹</Label>
                <Input
                  id="minp"
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="w-1/2 space-y-2">
                <Label htmlFor="maxp">Max ₹</Label>
                <Input
                  id="maxp"
                  type="number"
                  placeholder="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Tip: Use **Category** + **Location** to quickly narrow down results.
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-sm">Sort by</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Recent" />
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

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden border shadow-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    {categoryMeta[p.category].icon}
                    {categoryMeta[p.category].label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {p.location}
                </div>
              </CardHeader>

              {/* Image placeholder (or use real images) */}
              <div className="h-36 w-full bg-gray-100" />

              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-700">₹{p.price}</span>
                  <span className="text-sm text-gray-500">{p.unit}</span>
                </div>
                <p className="text-sm text-gray-600">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(p.tags || []).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleAddToCart(p)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>

                <Link href={`/marketplace/${p.id}`}>
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    View details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center text-gray-600">
            No items found. Try changing filters.
          </div>
        )}
      </section>
    </main>
  )
}
