"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Find Skilled Labor With Ease
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect with qualified professionals for your projects or find work opportunities that match your skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full animate-pulse-slow">
                <Link href="/jobs/search">
                  Find Workers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/jobs/post">Post a Job</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl animate-float">
              <Image
                src="/placeholder.svg?height=800&width=800"
                alt="Workers collaborating"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-2xl font-bold">Skilled Professionals</p>
                <p>Ready to work on your projects</p>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ x: -30, y: -20, opacity: 0 }}
              animate={{ x: -60, y: -40, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -left-4 -top-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">1,200+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Workers</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, y: 20, opacity: 0 }}
              animate={{ x: 60, y: 40, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -right-4 -bottom-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">850+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jobs Posted</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Our platform makes it easy to connect skilled workers with those who need their services
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Post a Job",
              description: "Describe your project, set your budget, and specify the skills you need",
              icon: Briefcase,
              color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
              delay: 0,
            },
            {
              title: "Connect with Workers",
              description: "Browse profiles, check ratings, and chat with potential workers",
              icon: Users,
              color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
              delay: 0.2,
            },
            {
              title: "Secure Payments",
              description: "Pay only when you're satisfied with the completed work",
              icon: MessageSquare,
              color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
              delay: 0.4,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={cn("p-4 rounded-full w-fit mb-6", feature.color)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Popular Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Browse through our most in-demand service categories
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Construction", "Plumbing", "Electrical", "Carpentry", "Painting", "Landscaping", "Cleaning", "Moving"].map(
            (category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative h-40 rounded-xl overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-xl font-bold">{category}</p>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl -z-10 animate-gradient" />
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl max-w-2xl mx-auto mb-8"
          >
            Join thousands of satisfied customers and skilled professionals on our platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              variant="default"
              className="rounded-full bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/auth/signup">Create an Account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white text-white hover:bg-white/20"
            >
              <Link href="/jobs/search">Browse Jobs</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
