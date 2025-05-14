import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
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
    const { paymentMethodId, bookingId, amount } = await request.json()

    if (!paymentMethodId || !bookingId || !amount) {
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

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    // Save payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      booking_id: bookingId,
      amount,
      transaction_id: paymentIntent.id,
      payment_method: "card",
      status: paymentIntent.status === "succeeded" ? "completed" : "pending",
    })

    if (paymentError) {
      console.error("Error saving payment record:", paymentError)
    }

    // Update booking status if payment succeeded
    if (paymentIntent.status === "succeeded") {
      await supabase.from("bookings").update({ status: "in_progress" }).eq("id", bookingId)

      // Create notification for laborer
      await supabase.from("notifications").insert({
        user_id: booking.laborer_id,
        type: "payment",
        title: "Payment Received",
        message: `Payment of $${Number(amount).toFixed(2)} has been received for booking "${booking.title}"`,
        is_read: false,
      })
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    })
  } catch (error: any) {
    console.error("Payment processing error:", error)

    return NextResponse.json({ message: error.message || "Payment processing failed" }, { status: 500 })
  }
}
