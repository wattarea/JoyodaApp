import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get("workflowId")

    if (!workflowId) {
      return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 })
    }

    const { data: rules, error } = await supabase
      .from("workflow_pricing_rules")
      .select("*")
      .eq("workflow_id", workflowId)
      .order("parameter_name", { ascending: true })

    if (error) {
      console.error("Error fetching pricing rules:", error)
      return NextResponse.json({ error: "Failed to fetch pricing rules" }, { status: 500 })
    }

    return NextResponse.json(rules)
  } catch (error) {
    console.error("Error in pricing rules GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: rule, error } = await supabase
      .from("workflow_pricing_rules")
      .insert([
        {
          workflow_id: body.workflow_id,
          parameter_name: body.parameter_name,
          parameter_value: body.parameter_value || "",
          credit_multiplier: body.credit_multiplier || 1.0,
          base_credits: body.base_credits || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating pricing rule:", error)
      return NextResponse.json({ error: "Failed to create pricing rule" }, { status: 500 })
    }

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Error in pricing rules POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("workflow_pricing_rules").delete().eq("id", id)

    if (error) {
      console.error("Error deleting pricing rule:", error)
      return NextResponse.json({ error: "Failed to delete pricing rule" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in pricing rules DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
