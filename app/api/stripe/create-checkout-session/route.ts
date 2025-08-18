import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, packageId, planId, isYearly } = await request.json()

    if (!type || (type === "credits" && !packageId) || (type === "subscription" && !planId)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let sessionConfig: Stripe.Checkout.SessionCreateParams

    if (type === "credits") {
      // Credit packages
      const creditPackages = {
        mini: { name: "Mini Pack", credits: 25, price: 5 },
        starter: { name: "Starter Pack", credits: 50, price: 9 },
        basic: { name: "Basic Pack", credits: 100, price: 17 },
        professional: { name: "Professional Pack", credits: 200, price: 29 },
        business: { name: "Business Pack", credits: 500, price: 69 },
        enterprise: { name: "Enterprise Pack", credits: 1000, price: 129 },
      }

      const pkg = creditPackages[packageId as keyof typeof creditPackages]
      if (!pkg) {
        return NextResponse.json({ error: "Invalid package" }, { status: 400 })
      }

      sessionConfig = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${pkg.name} - ${pkg.credits} Credits`,
                description: `${pkg.credits} AI credits for Joyoda Smart`,
              },
              unit_amount: pkg.price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/credits?success=true&credits=${pkg.credits}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/credits?canceled=true`,
        metadata: {
          type: "credits",
          packageId,
          userId: user.id,
          userEmail: user.email!,
          credits: pkg.credits.toString(),
        },
      }
    } else {
      // Subscription plans
      const subscriptionPlans = {
        basic: { name: "Basic", monthlyPrice: 5.9, yearlyPrice: 49, credits: 100 },
        pro: { name: "Pro", monthlyPrice: 14.9, yearlyPrice: 149, credits: 500 },
        enterprise: { name: "Enterprise", monthlyPrice: 24.9, yearlyPrice: 249, credits: 1000 },
      }

      const plan = subscriptionPlans[planId as keyof typeof subscriptionPlans]
      if (!plan) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }

      const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
      const interval = isYearly ? "year" : "month"

      sessionConfig = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.name} Plan`,
                description: `${plan.credits} credits per ${interval} - Joyoda Smart`,
              },
              unit_amount: price * 100, // Convert to cents
              recurring: {
                interval: interval as "month" | "year",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true&plan=${planId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
        metadata: {
          type: "subscription",
          planId,
          isYearly: isYearly.toString(),
          userId: user.id,
          userEmail: user.email!,
          credits: plan.credits.toString(),
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
