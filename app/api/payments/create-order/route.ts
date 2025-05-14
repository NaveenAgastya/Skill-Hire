import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// Initialize Razorpay
const Razorpay = require("razorpay")
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()

    // Get session to verify user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { bookingId, amount } = await request.json()

    if (!bookingId || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get booking to verify client is the current user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    if (booking.client_id !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized to make payment for this booking" }, { status: 403 })
    }

    // Create a Razorpay order
    const options = {
      amount: Math.round(Number(amount) * 100), // Convert to smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `booking_${bookingId}`,
      payment_capture: 1, // Auto-capture
      notes: {
        booking_id: bookingId,
        user_id: session.user.id,
      },
    }

    const order = await razorpay.orders.create(options)

    // Save order reference in database
    const { error: paymentError } = await supabase.from("payments").insert({
      booking_id: bookingId,
      amount,
      transaction_id: order.id,
      payment_method: "razorpay",
      status: "pending",
    })

    if (paymentError) {
      console.error("Error saving payment record:", paymentError)
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error("Order creation error:", error)

    return NextResponse.json({ message: error.message || "Order creation failed" }, { status: 500 })
  }
}
