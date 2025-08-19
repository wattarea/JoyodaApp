import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { handleGoogleUser } from "@/lib/actions"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()

    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error("Error exchanging code for session:", sessionError)
      return NextResponse.redirect(new URL("/signin?error=verification_failed", request.url))
    }

    if (sessionData.user?.email) {
      if (sessionData.user.app_metadata?.provider === "google") {
        await handleGoogleUser(sessionData.user)
      } else {
        // Handle email verification for regular users
        const { error: updateError } = await supabase
          .from("users")
          .update({
            email_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq("email", sessionData.user.email)

        if (updateError) {
          console.error("Error updating user verification status:", updateError)
        }
      }
    }

    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.redirect(new URL("/signin", request.url))
}
