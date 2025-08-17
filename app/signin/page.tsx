import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignInForm from "@/components/signin-form"
import { UnifiedHeader } from "@/components/unified-header"

export default async function SignInPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Sign In Form */}
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="font-black text-xl text-white">J</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Joyoda Smart</h1>
            <p className="text-gray-600">Sign in to your account and discover AI tools</p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  )
}
