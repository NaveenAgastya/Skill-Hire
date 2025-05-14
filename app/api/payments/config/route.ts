import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()

    // Get session to verify user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if the key is configured
    if (!process.env.RAZORPAY_KEY_ID) {
      console.error("Razorpay public key not configured")
      return NextResponse.json({ message: "Payment gateway not configured" }, { status: 500 })
    }

    // Only return the public key, not any secret keys
    return NextResponse.json({
      publicKey: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error("Config error:", error)
    return NextResponse.json({ message: error.message || "Failed to get config" }, { status: 500 })
  }
}
