"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Booking } from "@/types/database"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface PaymentFormProps {
  booking: Booking
  onSuccess?: () => void
}

function PaymentFormContent({ booking, onSuccess }: PaymentFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !user) return

    setIsProcessing(true)

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
        billing_details: {
          email: user.email,
        },
      })

      if (paymentMethodError) throw paymentMethodError

      // Call your backend to process the payment
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          bookingId: booking.id,
          amount: booking.total_amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Payment failed")

      // Handle successful payment
      toast({
        title: "Payment successful",
        description: `Payment of $${Number(booking.total_amount).toFixed(2)} was successful.`,
      })

      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "Could not process your payment. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Card Information</Label>
          <div className="border rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${Number(booking.hourly_rate * booking.estimated_hours).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service Fee</span>
            <span>
              ${(Number(booking.total_amount) - Number(booking.hourly_rate * booking.estimated_hours)).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>${Number(booking.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={!stripe || !elements || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Pay ${Number(booking.total_amount).toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment to confirm the booking</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <PaymentFormContent {...props} />
        </Elements>
      </CardContent>
    </Card>
  )
}
