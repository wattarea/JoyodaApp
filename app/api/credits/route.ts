import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Credits API: Starting request")

    let supabase
    try {
      supabase = await createClient()
      console.log("[v0] Credits API: Supabase client created successfully")
    } catch (clientError) {
      console.error("[v0] Credits API: Failed to create Supabase client:", clientError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    let user
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("[v0] Credits API: Auth error:", authError)
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
      }

      if (!authUser) {
        console.log("[v0] Credits API: No authenticated user")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      user = authUser
      console.log("[v0] Credits API: User authenticated:", user.email)
    } catch (authError) {
      console.error("[v0] Credits API: Auth exception:", authError)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    try {
      const { data, error } = await supabase.from("users").select("credits").eq("email", user.email).single()

      if (error) {
        console.error("[v0] Credits API: Database error:", error)
        return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
      }

      const credits = data?.credits || 0
      console.log("[v0] Credits API: Successfully fetched credits:", credits)
      return NextResponse.json({ credits })
    } catch (dbError) {
      console.error("[v0] Credits API: Database exception:", dbError)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Credits API: Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
