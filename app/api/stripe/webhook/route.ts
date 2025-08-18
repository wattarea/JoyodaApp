import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata!

        if (metadata.type === "credits") {
          // Handle credit purchase
          const credits = Number.parseInt(metadata.credits)
          const userEmail = metadata.userEmail

          // Add credits to user account
          const { data: userData } = await supabase.from("users").select("id, credits").eq("email", userEmail).single()

          if (userData) {
            await supabase
              .from("users")
              .update({ credits: userData.credits + credits })
              .eq("email", userEmail)

            // Record transaction
            await supabase.from("credit_transactions").insert({
              user_id: userData.id,
              transaction_type: "purchase",
              amount: credits,
              description: `Credit purchase - ${metadata.packageId} package`,
              cost_usd: session.amount_total! / 100,
              stripe_payment_id: session.payment_intent as string,
              status: "completed",
            })
          }
        } else if (metadata.type === "subscription") {
          // Handle subscription
          const userEmail = metadata.userEmail
          const planId = metadata.planId
          const isYearly = metadata.isYearly === "true"

          // Update user subscription
          await supabase
            .from("users")
            .update({
              subscription_plan: planId,
              subscription_status: "active",
              subscription_period: isYearly ? "yearly" : "monthly",
            })
            .eq("email", userEmail)
        }
        break
      }

      case "invoice.payment_succeeded": {
        // Handle recurring subscription payments
        const invoice = event.data.object as Stripe.Invoice
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

        // Add monthly/yearly credits based on subscription
        // Implementation depends on your subscription credit allocation logic
        break
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription

        // Update user subscription status
        await supabase
          .from("users")
          .update({
            subscription_status: "canceled",
          })
          .eq("stripe_customer_id", subscription.customer as string)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
