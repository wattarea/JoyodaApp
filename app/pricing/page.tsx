"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, CreditCard, Zap, Users, Building, Star, ArrowRight, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { UnifiedHeader } from "@/components/unified-header"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userCredits, setUserCredits] = useState(0)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase.from("users").select("credits").eq("email", user.email).single()

        if (data) {
          setUserCredits(data.credits)
        }
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      monthlyPrice: 5.9,
      yearlyPrice: 49,
      description: "Perfect for individuals getting started",
      credits: 100,
      popular: false,
      features: [
        "100 credits per month",
        "All AI tools access",
        "High quality results",
        "Email support",
        "Basic templates",
        "Standard processing speed",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 14.9,
      yearlyPrice: 149,
      description: "For professionals and creators",
      credits: 1000,
      popular: true,
      features: [
        "1,000 credits per month",
        "All AI tools access",
        "Premium quality results",
        "Priority support",
        "Advanced templates",
        "Bulk processing",
        "API access",
        "Priority processing speed",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyPrice: 24.9,
      yearlyPrice: 249,
      description: "For teams and businesses",
      credits: 5000,
      popular: false,
      features: [
        "5,000 credits per month",
        "All AI tools access",
        "Premium quality results",
        "24/7 dedicated support",
        "Custom templates",
        "Advanced API access",
        "Team management",
        "Custom integrations",
        "White-label options",
        "Fastest processing speed",
      ],
    },
  ]

  const creditPackages = [
    {
      id: "mini",
      name: "Mini Pack",
      credits: 25,
      price: 5,
      originalPrice: 7,
      savings: "29% off",
      popular: false,
    },
    {
      id: "starter",
      name: "Starter Pack",
      credits: 50,
      price: 9,
      originalPrice: 12,
      savings: "25% off",
      popular: false,
    },
    {
      id: "basic",
      name: "Basic Pack",
      credits: 100,
      price: 17,
      originalPrice: 24,
      savings: "29% off",
      popular: false,
    },
    {
      id: "professional",
      name: "Professional Pack",
      credits: 200,
      price: 29,
      originalPrice: 40,
      savings: "28% off",
      popular: true,
    },
    {
      id: "business",
      name: "Business Pack",
      credits: 500,
      price: 69,
      originalPrice: 100,
      savings: "31% off",
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      credits: 1000,
      price: 129,
      originalPrice: 200,
      savings: "36% off",
      popular: false,
    },
  ]

  const handleSubscriptionPurchase = async (planId: string, isYearly: boolean) => {
    if (isLoading) return

    setIsLoading(`subscription-${planId}`)
    setError(null)

    const attemptPurchase = async (retryCount = 0): Promise<void> => {
      try {
        console.log("[v0] Creating subscription checkout, attempt:", retryCount + 1)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "subscription",
            planId,
            isYearly,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Checkout session created successfully")

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error("No checkout URL received")
        }
      } catch (error) {
        console.error("[v0] Error creating subscription checkout:", error)

        if (retryCount < 2 && (error instanceof TypeError || error.name === "AbortError")) {
          console.log("[v0] Retrying subscription checkout due to network interference")
          setTimeout(() => attemptPurchase(retryCount + 1), 1000 * (retryCount + 1))
          return
        }

        setError("Unable to process payment. Please try again or contact support.")
        throw error
      }
    }

    try {
      await attemptPurchase()
    } catch (error) {
      // Final error handling
    } finally {
      setIsLoading(null)
    }
  }

  const handleCreditPurchase = async (packageId: string) => {
    if (isLoading) return

    setIsLoading(`credits-${packageId}`)
    setError(null)

    const attemptPurchase = async (retryCount = 0): Promise<void> => {
      try {
        console.log("[v0] Creating credit checkout, attempt:", retryCount + 1)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "credits",
            packageId,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Credit checkout session created successfully")

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error("No checkout URL received")
        }
      } catch (error) {
        console.error("[v0] Error creating credit checkout:", error)

        if (retryCount < 2 && (error instanceof TypeError || error.name === "AbortError")) {
          console.log("[v0] Retrying credit checkout due to network interference")
          setTimeout(() => attemptPurchase(retryCount + 1), 1000 * (retryCount + 1))
          return
        }

        setError("Unable to process payment. Please try again or contact support.")
        throw error
      }
    }

    try {
      await attemptPurchase()
    } catch (error) {
      // Final error handling
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UnifiedHeader />

      <div className="container mx-auto px-4 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. All plans include access to our complete suite of AI tools with no
            hidden fees.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isYearly ? "text-purple-600" : "text-gray-500"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-purple-600" />
            <span className={`text-lg font-medium ${isYearly ? "text-purple-600" : "text-gray-500"}`}>Yearly</span>
            <Badge className="bg-green-100 text-green-700 ml-2">Save up to 30%</Badge>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {subscriptionPlans.map((plan) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const savings = isYearly
              ? Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)
              : 0

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-purple-500 border-2 shadow-xl scale-105"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                      plan.popular ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-100"
                    }`}
                  >
                    {plan.id === "basic" && (
                      <Star className={`w-10 h-10 ${plan.popular ? "text-white" : "text-gray-600"}`} />
                    )}
                    {plan.id === "pro" && (
                      <Users className={`w-10 h-10 ${plan.popular ? "text-white" : "text-gray-600"}`} />
                    )}
                    {plan.id === "enterprise" && (
                      <Building className={`w-10 h-10 ${plan.popular ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>

                  <CardTitle className="text-3xl font-bold mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold">${currentPrice}</span>
                      <span className="text-lg text-gray-500">/{isYearly ? "year" : "month"}</span>
                    </div>
                    {isYearly && savings > 0 && <Badge className="bg-green-100 text-green-700">Save {savings}%</Badge>}
                    <div className="text-lg font-semibold text-purple-600">
                      {plan.credits.toLocaleString()} credits/{isYearly ? "year" : "month"}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                  <Button
                    onClick={() => handleSubscriptionPurchase(plan.id, isYearly)}
                    disabled={isLoading !== null}
                    className={`w-full h-12 text-lg font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {isLoading === `subscription-${plan.id}` ? "Processing..." : "Get Started"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Everything included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Credit Packages Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              One-Time Credit Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need extra credits? Purchase one-time packages that never expire. Perfect for occasional use or
              supplementing your subscription.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  pkg.popular ? "border-purple-500 border-2 shadow-lg" : "border-gray-200 hover:border-purple-300"
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Best Value
                  </Badge>
                )}

                <CardHeader className="text-center pb-3 pt-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      pkg.popular ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-100"
                    }`}
                  >
                    <Zap className={`w-6 h-6 ${pkg.popular ? "text-white" : "text-gray-600"}`} />
                  </div>

                  <CardTitle className="text-lg font-bold mb-2">{pkg.name}</CardTitle>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold">${pkg.price}</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                      <Badge className="bg-green-100 text-green-700 text-xs">{pkg.savings}</Badge>
                    </div>
                    <div className="text-lg font-semibold text-purple-600">{pkg.credits.toLocaleString()} Credits</div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-6">
                  <Button
                    onClick={() => handleCreditPurchase(pkg.id)}
                    disabled={isLoading !== null}
                    className={`w-full h-10 font-semibold ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {isLoading === `credits-${pkg.id}` ? "Processing..." : "Purchase Credits"}
                    <CreditCard className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Features</th>
                    <th className="text-center py-3 px-4">Basic</th>
                    <th className="text-center py-3 px-4">Pro</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3 px-4">Monthly Credits</td>
                    <td className="text-center py-3 px-4">100</td>
                    <td className="text-center py-3 px-4">1,000</td>
                    <td className="text-center py-3 px-4">5,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">AI Tools Access</td>
                    <td className="text-center py-3 px-4">All</td>
                    <td className="text-center py-3 px-4">All</td>
                    <td className="text-center py-3 px-4">All + Custom</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Processing Quality</td>
                    <td className="text-center py-3 px-4">High</td>
                    <td className="text-center py-3 px-4">Premium</td>
                    <td className="text-center py-3 px-4">Premium</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">API Access</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">Full</td>
                    <td className="text-center py-3 px-4">Full</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Support</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Priority</td>
                    <td className="text-center py-3 px-4">24/7 Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
                <p className="text-sm text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do unused credits roll over?</h4>
                <p className="text-sm text-gray-600">
                  Monthly plan credits reset each month. One-time credit packages never expire.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-sm text-gray-600">
                  Yes, our Basic plan gives you 100 credits monthly to try our tools with no commitment.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing
                  period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-gray-600">
                  We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Images?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of creators using Joyoda Smart to create stunning visuals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
