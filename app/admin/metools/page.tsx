import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ToolsManagementClient } from "@/components/admin/tools-management-client"

export default async function ToolsManagePage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signin")
  }

  // Fetch all tools from database
  const { data: tools, error } = await supabase.from("ai_tools").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tools:", error)
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tools Management</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading tools: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tools Management</h1>
          <p className="text-gray-600 mt-2">Manage AI tools, add new tools, and configure settings</p>
        </div>

        <ToolsManagementClient initialTools={tools || []} />
      </div>
    </div>
  )
}
