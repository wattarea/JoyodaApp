// app/credits/credits-client.tsx

"use client"; // Bu dosyanın bir istemci bileşeni olduğunu belirtiyoruz

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Clock, ShoppingCart, Shield, Lock, Award, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import { RealTimeCredits } from "@/components/real-time-credits";
import { UnifiedHeader } from "@/components/unified-header";

// Sunucu bileşeninden gelen veriler için tip arayüzü
interface CreditsPageClientProps {
  user: any; // Daha spesifik bir User tipi kullanmak daha iyi olabilir
  initialCredits: number;
}

export function CreditsPageClient({ user, initialCredits }: CreditsPageClientProps) {
  const [currentCredits, setCurrentCredits] = useState(initialCredits);

  const creditPackages = [
    { id: "mini", name: "Mini Pack", credits: 25, price: 5, originalPrice: 7, popular: false, savings: "29% off" },
    { id: "starter", name: "Starter Pack", credits: 50, price: 9, originalPrice: 12, popular: false, savings: "25% off" },
    { id: "basic", name: "Basic Pack", credits: 100, price: 17, originalPrice: 24, popular: false, savings: "29% off" },
    { id: "professional", name: "Professional Pack", credits: 200, price: 29, originalPrice: 40, popular: true, savings: "28% off" },
    { id: "business", name: "Business Pack", credits: 500, price: 69, originalPrice: 100, popular: false, savings: "31% off" },
    { id: "enterprise", name: "Enterprise Pack", credits: 1000, price: 129, originalPrice: 200, popular: false, savings: "36% off" },
  ];

  const recentTransactions = [
    { id: "1", type: "purchase", description: "Professional Pack - 150 Credits", amount: "+150", date: "2024-01-15", status: "completed" },
    { id: "2", type: "usage", description: "Background Remover", amount: "-1", date: "2024-01-14", status: "completed" },
    { id: "3", type: "usage", description: "Image Upscaler", amount: "-1", date: "2024-01-14", status: "completed" },
  ];

  const handleCreditPurchase = async (packageId: string) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credits", packageId }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
          <p className="text-gray-600">Purchase credits to use AI tools and enhance your images</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Choose Your Credit Package</h2>
              <p className="text-gray-600">Select the package that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg) => (
                <Card key={pkg.id} className={`relative ${pkg.popular ? "border-purple-500 border-2" : ""}`}>
                  {pkg.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">Best Value</Badge>}
                  <CardHeader className="text-center pb-3 pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">${pkg.price}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">{pkg.savings}</Badge>
                      </div>
                      <div className="text-base font-semibold text-purple-600">{pkg.credits.toLocaleString()} Credits</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <Button onClick={() => handleCreditPurchase(pkg.id)} className={`w-full ${pkg.popular ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-900 hover:bg-gray-800"}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Payment Methods
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">Your payment information is protected with bank-level security</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{/* Payment method cards */}</div>
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">{/* Security features */}</div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">{/* Security message */}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">{/* Low Balance Warning */}</div>
                ) : (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">{/* Good Balance */}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{/* Usage Stats */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">{/* Transaction item */}</div>
                ))}
                <Link href="/profile"><Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">View All Transactions</Button></Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Need Help?</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Have questions about credits or billing? We're here to help.</p>
                <Button variant="outline" className="w-full bg-transparent">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
