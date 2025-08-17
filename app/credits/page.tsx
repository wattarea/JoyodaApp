import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Clock, ShoppingCart, Shield, Lock, Award, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { RealTimeCredits } from "@/components/real-time-credits"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UnifiedHeader } from "@/components/unified-header"

export default async function CreditsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signin")
  }

  const { data: userData } = await supabase.from("users").select("credits").eq("email", user.email).single()

  return <CreditsPageClient user={user} initialCredits={userData?.credits || 0} />
}
;("use client")

import { useState } from "react"

function CreditsPageClient({ user, initialCredits }: { user: any; initialCredits: number }) {
  const [currentCredits, setCurrentCredits] = useState(initialCredits)

  const creditPackages = [
    {
      id: "mini",
      name: "Mini Pack",
      credits: 25,
      price: 5,
      originalPrice: 7,
      popular: false,
      savings: "29% off",
    },
    {
      id: "starter",
      name: "Starter Pack",
      credits: 50,
      price: 9,
      originalPrice: 12,
      popular: false,
      savings: "25% off",
    },
    {
      id: "basic",
      name: "Basic Pack",
      credits: 100,
      price: 17,
      originalPrice: 24,
      popular: false,
      savings: "29% off",
    },
    {
      id: "professional",
      name: "Professional Pack",
      credits: 200,
      price: 29,
      originalPrice: 40,
      popular: true,
      savings: "28% off",
    },
    {
      id: "business",
      name: "Business Pack",
      credits: 500,
      price: 69,
      originalPrice: 100,
      popular: false,
      savings: "31% off",
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      credits: 1000,
      price: 129,
      originalPrice: 200,
      popular: false,
      savings: "36% off",
    },
  ]

  const recentTransactions = [
    {
      id: "1",
      type: "purchase",
      description: "Professional Pack - 150 Credits",
      amount: "+150",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "usage",
      description: "Background Remover",
      amount: "-1",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "3",
      type: "usage",
      description: "Image Upscaler",
      amount: "-1",
      date: "2024-01-14",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Header */}
      <UnifiedHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
          <p className="text-gray-600">Purchase credits to use AI tools and enhance your images</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Credit Packages */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Choose Your Credit Package</h2>
              <p className="text-gray-600">Select the package that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <Card key={pkg.id} className={`relative ${pkg.popular ? "border-purple-500 border-2" : ""}`}>
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                      Best Value
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-3 pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">${pkg.price}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {pkg.savings}
                        </Badge>
                      </div>
                      <div className="text-base font-semibold text-purple-600">
                        {pkg.credits.toLocaleString()} Credits
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <Button
                      className={`w-full ${
                        pkg.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Methods */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Payment Methods
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Your payment information is protected with bank-level security
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment method cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl hover:border-blue-300 transition-colors bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-center">
                      <div className="w-8 h-5 bg-blue-600 rounded-sm mb-2 mx-auto flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <span className="text-xs text-gray-600">Visa</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl hover:border-red-300 transition-colors bg-gradient-to-br from-red-50 to-orange-100">
                    <div className="text-center">
                      <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-500 rounded-sm mb-2 mx-auto flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MC</span>
                      </div>
                      <span className="text-xs text-gray-600">Mastercard</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-center">
                      <div className="w-8 h-5 bg-blue-500 rounded-sm mb-2 mx-auto flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <span className="text-xs text-gray-600">PayPal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl hover:border-purple-300 transition-colors bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="text-center">
                      <div className="w-8 h-5 bg-purple-600 rounded-sm mb-2 mx-auto flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <span className="text-xs text-gray-600">Stripe</span>
                    </div>
                  </div>
                </div>

                {/* Security features */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-green-800">SSL Encrypted</div>
                      <div className="text-xs text-green-600">256-bit security</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-blue-800">Money Back</div>
                      <div className="text-xs text-blue-600">30-day guarantee</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-purple-800">Trusted by 10K+</div>
                      <div className="text-xs text-purple-600">Happy customers</div>
                    </div>
                  </div>
                </div>

                {/* Security message */}
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        🔒 Your payment is 100% secure and protected
                      </p>
                      <p className="text-xs text-gray-600">
                        We use industry-standard encryption and never store your payment information. All transactions
                        are processed securely through our certified payment partners.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    <RealTimeCredits
                      initialCredits={initialCredits}
                      userEmail={user.email}
                      showIcon={false}
                      onCreditsChange={setCurrentCredits}
                    />
                  </div>
                  <div className="text-sm text-gray-600">Available Credits</div>
                </div>
                {currentCredits < 20 ? (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Low Balance Warning</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      You're running low on credits. Consider purchasing more to continue using AI tools.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Good Balance</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      You have sufficient credits to use all AI tools. Keep creating amazing content!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credits Used</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Images Processed</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Used Tool</span>
                  <span className="font-semibold text-purple-600">Background Remover</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{transaction.description}</div>
                      <div className="text-xs text-gray-500">{transaction.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          transaction.type === "purchase" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          transaction.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100"
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    View All Transactions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about credits or billing? We're here to help.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
