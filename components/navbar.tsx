"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, X, MessageSquare, Bell } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">S</div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              SkillHire
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Find Work</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-blue-500 p-6 no-underline outline-none focus:shadow-md"
                          href="/jobs/search"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Browse Jobs</div>
                          <p className="text-sm leading-tight text-white/90">
                            Find work opportunities that match your skills and preferences
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/jobs/search" title="Search Jobs">
                      Find work based on your skills and location
                    </ListItem>
                    <ListItem href="/profile" title="Worker Profile">
                      Create and manage your professional profile
                    </ListItem>
                    <ListItem href="/dashboard" title="Worker Dashboard">
                      Track applications and manage your work
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Hire Talent</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <ListItem href="/jobs/post" title="Post a Job">
                      Create a job listing to find the right workers
                    </ListItem>
                    <ListItem href="/dashboard" title="Manage Jobs">
                      Track and manage your job postings
                    </ListItem>
                    <ListItem href="/chat" title="Message Workers">
                      Communicate with potential hires
                    </ListItem>
                    <ListItem href="/payments" title="Payments">
                      Secure payment processing for completed work
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/chat">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/jobs/search" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Find Work
                </Link>
                <Link href="/jobs/post" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Post a Job
                </Link>
                <Link href="/about" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
                <Link href="/chat" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Messages
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                  <div className="mt-4 flex justify-center">
                    <ModeToggle />
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
