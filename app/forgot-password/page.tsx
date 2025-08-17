import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Joyoda
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Form */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-xl">J</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a reset link</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/signin" className="text-purple-600 hover:text-purple-700">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h2 className="text-xl font-semibold">Forgot Password</h2>
            </div>
            <p className="text-gray-600 text-sm">We'll send a password reset link to your email address</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email address" className="h-12" />
            </div>

            <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium">
              Send Reset Link
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
