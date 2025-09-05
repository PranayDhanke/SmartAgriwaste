"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Leaf } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-10 mt-1">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Leaf className="h-6 w-6 text-white" />
            AgriWaste
          </div>
          <p className="mt-3 text-sm text-green-100">
            Sustainable solutions for agricultural waste management 🌱
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-green-100">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/process" className="hover:underline">Processes</Link></li>
            <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
            <li><Link href="/community" className="hover:underline">Community</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Resources</h3>
          <ul className="space-y-2 text-green-100">
            <li><Link href="/discussion" className="hover:underline">Discussion</Link></li>
            <li><Link href="/blogs" className="hover:underline">Blogs</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-green-300">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-green-300">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-green-300">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-green-300">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-green-600 mt-10 pt-6 text-center text-sm text-green-100">
        © {new Date().getFullYear()} AgriWaste. All rights reserved.
      </div>
    </footer>
  )
}
