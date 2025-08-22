import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user credits
    const { data, error } = await supabase.from("users").select("credits").eq("email", user.email).single()

    if (error) {
      console.error("Error fetching credits:", error)
      return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
    }

    return NextResponse.json({ credits: data?.credits || 0 })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
