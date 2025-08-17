import { createClient } from "@/lib/supabase/server"

export interface AITool {
  id: number
  tool_id: string
  name: string
  description: string
  category: string
  fal_model_id: string
  api_provider: string
  credits_per_use: number
  input_parameters: any
  supported_formats: string[]
  max_file_size_mb: number | null
  processing_time_estimate: number
  output_format: string
  is_active: boolean
  is_featured: boolean
  icon_name: string
  rating: number
  success_rate: number
  usage_count: number
  created_at: string
  updated_at: string
}

export async function getAITools(category?: string): Promise<AITool[]> {
  const supabase = await createClient()

  let query = supabase.from("ai_tools").select("*").eq("is_active", true).order("name")

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching AI tools:", error)
    return []
  }

  return data || []
}

export async function getAITool(toolId: string): Promise<AITool | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("tool_id", toolId)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error fetching AI tool:", error)
    return null
  }

  return data
}

export async function getUserToolUsage(userEmail: string) {
  const supabase = await createClient()

  const { data: userData } = await supabase.from("users").select("id").eq("email", userEmail).single()

  if (!userData) return []

  const { data, error } = await supabase
    .from("tool_executions")
    .select(`
      *,
      ai_tools (name, category)
    `)
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching tool usage:", error)
    return []
  }

  return data || []
}
