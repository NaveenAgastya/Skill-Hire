"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Booking } from "@/types/database"
import { CheckCircle2, Loader2, CreditCard } from "lucide-react"

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentFormProps {
  booking: Booking
  onSuccess?: () => void
}

export default function PaymentForm({ booking, onSuccess }: PaymentFormProps) {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        setIsScriptLoaded(true)
      }
      document.body.appendChild(script)
    }

    if (!window.Razorpay) {
      loadRazorpayScript()
    } else {
      setIsScriptLoaded(true)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  const handlePayment = async () => {
    if (!user || !profile) return

    setIsProcessing(true)

    try {
      // First, fetch the Razorpay public key from the server
      const configResponse = await fetch("/api/payments/config")
      if (!configResponse.ok) {
        throw new Error("Failed to load payment configuration")
      }
      const configData = await configResponse.json()

      // Create order on the server
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.total_amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to create payment order")

      // Initialize Razorpay checkout
      const options = {
        key: configData.publicKey,
        amount: data.order.amount, // Amount in smallest currency unit (paise for INR)
        currency: data.order.currency,
        name: "SkillHire",
        description: `Payment for ${booking.title}`,
        order_id: data.order.id,
        prefill: {
          name: profile.full_name || "",
          email: profile.email || "",
          contact: "", // Phone number if available
        },
        theme: {
          color: "#7c3aed", // Purple color to match our theme
        },
        handler: (response: any) => {
          // Handle successful payment
          verifyPayment(response)
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            toast({
              title: "Payment cancelled",
              description: "You have cancelled the payment process.",
            })
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "Could not process your payment. Please try again.",
      })
      setIsProcessing(false)
    }
  }

  const verifyPayment = async (paymentResponse: any) => {
    try {
      // Verify payment on the server
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.total_amount,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Payment verification failed")

      // Handle successful payment
      toast({
        title: "Payment successful",
        description: `Payment of ₹${Number(booking.total_amount).toFixed(2)} was successful.`,
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Payment verification error:", error)
      toast({
        variant: "destructive",
        title: "Payment verification failed",
        description: error.message || "Could not verify your payment. Please contact support.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment to confirm the booking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{Number(booking.hourly_rate * booking.estimated_hours).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Service Fee</span>
              <span>
                ₹{(Number(booking.total_amount) - Number(booking.hourly_rate * booking.estimated_hours)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{Number(booking.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-4 text-sm">
            <p className="flex items-center text-purple-700 dark:text-purple-300 font-medium mb-2">
              <CreditCard className="mr-2 h-4 w-4" />
              Secure Payment with Razorpay
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              You'll be redirected to Razorpay's secure payment gateway to complete your payment.
            </p>
          </div>

          <Button onClick={handlePayment} className="w-full" disabled={isProcessing || !isScriptLoaded}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Pay ₹{Number(booking.total_amount).toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
