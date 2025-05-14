"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Booking, Payment } from "@/types/database"
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  BarChart3,
  Briefcase,
  CreditCard,
  CheckCircle2,
  Clock8,
} from "lucide-react"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setIsLoading(true)

      try {
        // Fetch bookings based on user role
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .or(profile?.role === "client" ? `client_id.eq.${user.id}` : `laborer_id.eq.${user.id}`)
          .order("created_at", { ascending: false })
          .limit(10)

        if (bookingsError) throw bookingsError

        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*")
          .in(
            "booking_id",
            bookingsData.map((booking) => booking.id),
          )
          .order("created_at", { ascending: false })

        if (paymentsError) throw paymentsError

        setBookings(bookingsData || [])
        setPayments(paymentsData || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, profile, supabase])

  // Calculate dashboard stats
  const totalEarnings = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + Number(payment.amount), 0)

  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length
  const activeBookings = bookings.filter((booking) => booking.status === "in_progress").length
  const completedBookings = bookings.filter((booking) => booking.status === "completed").length

  return (
    <div className="space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {profile?.role === "client" ? "Manage your job postings and hired workers" : "Track your jobs and earnings"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {profile?.role === "client" ? "Total Spent" : "Total Earnings"}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">₹{Number(totalEarnings.toFixed(2))}</h3>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
                  <h3 className="text-2xl font-bold mt-1">{activeBookings}</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Jobs</p>
                  <h3 className="text-2xl font-bold mt-1">{completedBookings}</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Jobs</p>
                  <h3 className="text-2xl font-bold mt-1">{pendingBookings}</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                  <Clock8 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  {profile?.role === "client"
                    ? "Jobs you have posted or hired for"
                    : "Jobs you have applied to or completed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center p-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{booking.title}</h3>
                                <Badge
                                  variant={
                                    booking.status === "completed"
                                      ? "default"
                                      : booking.status === "in_progress"
                                        ? "secondary"
                                        : booking.status === "pending"
                                          ? "outline"
                                          : "destructive"
                                  }
                                >
                                  {booking.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                                {booking.description}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {booking.location}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(booking.booking_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {booking.start_time.slice(0, 5)}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />₹{Number(booking.hourly_rate).toFixed(2)}/hr
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {booking.estimated_hours} hrs
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  Total: ₹{Number(booking.total_amount).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
                              <Button size="sm" variant="outline">
                                Details
                              </Button>
                              {booking.status === "pending" && (
                                <Button size="sm">{profile?.role === "client" ? "Edit" : "Accept"}</Button>
                              )}
                              {booking.status === "in_progress" && (
                                <Button size="sm">{profile?.role === "client" ? "Track" : "Update"}</Button>
                              )}
                              {booking.status === "completed" && profile?.role === "client" && (
                                <Button size="sm">Review</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {profile?.role === "client"
                        ? "You haven't posted any jobs yet."
                        : "You haven't applied to any jobs yet."}
                    </p>
                    <Button>{profile?.role === "client" ? "Post a Job" : "Find Jobs"}</Button>
                  </div>
                )}
              </CardContent>
              {bookings.length > 0 && (
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View All Jobs</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  {profile?.role === "client"
                    ? "Payments you have made to workers"
                    : "Payments you have received for completed jobs"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => {
                      const relatedBooking = bookings.find((b) => b.id === payment.booking_id)

                      return (
                        <Card key={payment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`p-2 rounded-full mr-4 ${
                                    payment.status === "completed"
                                      ? "bg-green-100 dark:bg-green-900"
                                      : payment.status === "pending"
                                        ? "bg-amber-100 dark:bg-amber-900"
                                        : "bg-red-100 dark:bg-red-900"
                                  }`}
                                >
                                  <CreditCard
                                    className={`h-5 w-5 ${
                                      payment.status === "completed"
                                        ? "text-green-600 dark:text-green-400"
                                        : payment.status === "pending"
                                          ? "text-amber-600 dark:text-amber-400"
                                          : "text-red-600 dark:text-red-400"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{relatedBooking?.title || "Payment"}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(payment.created_at).toLocaleDateString()} •
                                    {payment.payment_method === "razorpay" ? "Razorpay" : payment.payment_method} • ID:{" "}
                                    {payment.transaction_id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{Number(payment.amount).toFixed(2)}</p>
                                <Badge
                                  variant={
                                    payment.status === "completed"
                                      ? "default"
                                      : payment.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                  }
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payments found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {profile?.role === "client"
                        ? "You haven't made any payments yet."
                        : "You haven't received any payments yet."}
                    </p>
                  </div>
                )}
              </CardContent>
              {payments.length > 0 && (
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View All Payments</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View your performance and statistics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    We're working on providing detailed analytics for your account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
