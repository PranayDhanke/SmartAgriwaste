"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-green-700 sm:text-5xl">
          Agriculture Waste Management
        </h1>
        
        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Empowering farmers and communities to manage agricultural waste efficiently, 
          protect the environment, and create value from resources.
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex gap-4">
          <Link href="/process">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
              Find Waste Management Processes
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="px-6 py-3 rounded-xl">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-3 text-center">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-green-700">Eco-Friendly</h3>
          <p className="mt-3 text-gray-600">
            Reduce pollution and promote sustainable farming with proper waste management.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-green-700">Farmer Support</h3>
          <p className="mt-3 text-gray-600">
            Helping farmers turn waste into resources that boost their income.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-green-700">Smart Solutions</h3>
          <p className="mt-3 text-gray-600">
            Discover innovative waste management processes tailored to your needs.
          </p>
        </div>
      </section>
    </main>
  )
}
