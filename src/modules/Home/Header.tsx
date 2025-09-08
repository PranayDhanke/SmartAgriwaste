// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FiMenu,
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiUser,
  FiBell,
  FiSettings,
  FiLogOut,
  FiPlus,
} from "react-icons/fi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [loggedIn] = useState(true);

  // Navigation items based on your modules
  const navigationItems = [
    { onloggedIn: false, title: "Home", href: "/", icon: FiHome },
    {
      onloggedIn: false,
      title: "Marketplace",
      href: "/marketplace",
      icon: FiShoppingCart,
    },
    {
      onloggedIn: true,
      title: "My Listings",
      href: "/profile/my-listing",
      icon: FiPackage,
    },
    {
      onloggedIn: true,
      title: "Orders",
      href: "/profile/my-orders",
      icon: FiDollarSign,
    },
    {
      onloggedIn: true,
      title: "Analytics",
      href: "/profile/analytics",
      icon: FiTrendingUp,
    },
    {
      onloggedIn: false,
      title: "Community",
      href: "/community",
      icon: FiUsers,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
            <FiPackage className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-700">AgriWaste</span>
            <span className="text-xs text-gray-500 hidden sm:block">
              Marketplace
            </span>
          </div>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems
            .filter((item) => (loggedIn ? true : !item.onloggedIn))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {loggedIn ? (
            <>
              {/* List Waste Button */}
              <Link href={"/profile/list-waste"}>
                <Button className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 text-white">
                  <FiPlus className="mr-2 h-4 w-4" />
                  List Waste
                </Button>
              </Link>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex relative"
              >
                <FiBell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  2
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/farmer-avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                        FM
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Farmer Name</p>
                      <p className="text-xs text-gray-500">
                        farmer@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FiUser className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FiDollarSign className="mr-2 h-4 w-4" />
                    Wallet & Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FiSettings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href={""}>
                <Button variant="secondary" className="">
                  Login
                </Button>
              </Link>
              <Link href={""}>
                <Button variant="default" className="">
                  Sign In
                </Button>
              </Link>
            </>
          )}
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FiMenu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px] px-2">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2 text-left">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                    <FiPackage className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-green-700">AgriWaste</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile CTA */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <FiPlus className="mr-2 h-4 w-4" />
                  List Your Waste
                </Button>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  {navigationItems
                    .filter((item) => (loggedIn ? true : !item.onloggedIn))
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

/*
🚀 INSTALLATION GUIDE

1. Install Required Packages:
npm install @radix-ui/react-dropdown-menu @radix-ui/react-sheet @radix-ui/react-avatar
npm install react-icons
npm install class-variance-authority clsx tailwind-merge

2. Add shadcn/ui Components:
npx shadcn-ui@latest add button dropdown-menu sheet avatar badge

3. Usage in your layout:
import Header from '@/components/Header'

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  )
}

📦 KEY FEATURES MAPPED TO YOUR MODULES:

✅ Authentication: User avatar with profile dropdown
✅ Waste Management: "List Waste" CTA + "My Listings" nav
✅ Marketplace: Dedicated marketplace navigation
✅ Payments: Wallet access in user menu
✅ Orders & Logistics: Orders tracking page link
✅ Analytics: Analytics dashboard link
✅ Community: Community forum access
✅ Notifications: Bell icon with badge counter

🎨 DESIGN PRINCIPLES:
- Clean, minimal interface
- Agricultural green theme
- Clear hierarchy and spacing
- Mobile-first responsive design
- Intuitive iconography
- Professional marketplace feel
*/
