import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import crypto from "crypto"

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
    const { bookingId, amount, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

    if (!bookingId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
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
      return NextResponse.json({ message: "Unauthorized to verify payment for this booking" }, { status: 403 })
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 })
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        transaction_id: razorpay_payment_id, // Update with actual payment ID
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", bookingId)
      .eq("transaction_id", razorpay_order_id) // Match by order ID

    if (paymentError) {
      console.error("Error updating payment record:", paymentError)
      return NextResponse.json({ message: "Error updating payment record" }, { status: 500 })
    }

    // Update booking status
    await supabase.from("bookings").update({ status: "in_progress" }).eq("id", bookingId)

    // Create notification for laborer
    await supabase.from("notifications").insert({
      user_id: booking.laborer_id,
      type: "payment",
      title: "Payment Received",
      message: `Payment of ₹${Number(amount).toFixed(2)} has been received for booking "${booking.title}"`,
      is_read: false,
    })

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    })
  } catch (error: any) {
    console.error("Payment verification error:", error)

    return NextResponse.json({ message: error.message || "Payment verification failed" }, { status: 500 })
  }
}
