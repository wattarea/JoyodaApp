"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium rounded-lg h-12"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function SignInForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const [showPassword, setShowPassword] = useState(false)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8" suppressHydrationWarning={true}>
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}

        <div className="space-y-4" suppressHydrationWarning={true}>
          <div suppressHydrationWarning={true}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div suppressHydrationWarning={true}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative" suppressHydrationWarning={true}>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between" suppressHydrationWarning={true}>
          <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <SubmitButton />

        <div className="text-center text-sm text-gray-600" suppressHydrationWarning={true}>
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
            Sign up
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6" suppressHydrationWarning={true}>
          By signing in you agree to our{" "}
          <Link href="/terms" className="text-purple-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-purple-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </form>
    </div>
  )
}
