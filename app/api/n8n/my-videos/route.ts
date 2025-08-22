import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: customUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

    if (userError || !customUser) {
      console.error("[v0] Error finding custom user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { data: executions, error: fetchError } = await supabase
      .from("workflow_executions")
      .select("*")
      .eq("user_id", customUser.id)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("[v0] Error fetching workflow executions:", fetchError)
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }

    return NextResponse.json({ executions: executions || [] })
  } catch (error) {
    console.error("[v0] My videos API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
