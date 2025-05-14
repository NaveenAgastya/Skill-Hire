import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

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
    const { bookingId, latitude, longitude, status } = await request.json()

    if (!bookingId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get booking to verify laborer is the current user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    if (booking.laborer_id !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized to update tracking for this booking" }, { status: 403 })
    }

    // Update tracking
    const { error: trackingError } = await supabase.from("tracking").upsert({
      booking_id: bookingId,
      laborer_id: session.user.id,
      latitude,
      longitude,
      status: status || booking.status,
      updated_at: new Date().toISOString(),
    })

    if (trackingError) {
      return NextResponse.json({ message: "Error updating tracking" }, { status: 500 })
    }

    // Update booking status if provided
    if (status && status !== booking.status) {
      await supabase.from("bookings").update({ status }).eq("id", bookingId)

      // Create notification for client
      await supabase.from("notifications").insert({
        user_id: booking.client_id,
        type: "status_update",
        title: "Booking Status Updated",
        message: `The status of your booking "${booking.title}" has been updated to ${status.replace("_", " ")}`,
        is_read: false,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
    })
  } catch (error: any) {
    console.error("Location update error:", error)

    return NextResponse.json({ message: error.message || "Location update failed" }, { status: 500 })
  }
}
