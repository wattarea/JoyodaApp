"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface Tool {
  id?: number
  tool_id: string
  name: string
  description: string
  category: string
  credits_per_use: number
  fal_model_id: string
  api_provider: string
  is_active: boolean
  is_featured: boolean
  icon_name?: string
  processing_time_estimate?: number
  success_rate?: number
  max_file_size_mb?: number
  output_format?: string
  supported_formats?: any
  input_parameters?: any
}

export async function createToolAction(toolData: Tool) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("ai_tools")
      .insert([
        {
          ...toolData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          usage_count: 0,
          rating: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/metools")
    return { success: true, tool: data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateToolAction(toolId: number, toolData: Tool) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("ai_tools")
      .update({
        ...toolData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", toolId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/metools")
    return { success: true, tool: data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteToolAction(toolId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("ai_tools").delete().eq("tool_id", toolId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/metools")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function toggleToolStatusAction(toolId: string, isActive: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("ai_tools")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("tool_id", toolId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/metools")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserAction(
  userId: string,
  userData: {
    first_name: string
    last_name: string
    credits: number
    role: string
  },
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("users")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/users")
    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const supabase = await createClient()

    // First delete from auth.users (this will cascade to other tables)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      return { success: false, error: authError.message }
    }

    // Also delete from custom users table
    const { error: userError } = await supabase.from("users").delete().eq("id", userId)

    if (userError) {
      return { success: false, error: userError.message }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
