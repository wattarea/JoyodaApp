import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { data: workflows, error } = await supabase
      .from("n8n_workflows")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(workflows)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const body = await request.json()

    const { data: workflow, error } = await supabase
      .from("n8n_workflows")
      .insert([
        {
          name: body.name,
          description: body.description,
          production_url: body.production_url,
          credit_cost: body.credit_cost,
          workflow_tag: body.workflow_tag,
          content_type: body.content_type,
          category: body.category,
          is_active: body.is_active,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const body = await request.json()

    const { data: workflow, error } = await supabase
      .from("n8n_workflows")
      .update({
        name: body.name,
        description: body.description,
        production_url: body.production_url,
        credit_cost: body.credit_cost,
        workflow_tag: body.workflow_tag,
        content_type: body.content_type,
        category: body.category,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("n8n_workflows").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
