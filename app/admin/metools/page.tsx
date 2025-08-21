import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { ToolsManagementClient } from "@/components/admin/tools-management-client"

export default async function ToolsManagePage() {
  await requireAdmin()

  const supabase = await createClient()

  // Fetch all tools from database
  const { data: tools, error } = await supabase.from("ai_tools").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tools:", error)
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Araç Yönetimi</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Araçlar yüklenirken hata: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Araç Yönetimi</h1>
          <p className="text-gray-600 mt-2">AI araçlarını yönetin, yeni araçlar ekleyin ve ayarları yapılandırın</p>
        </div>

        <ToolsManagementClient initialTools={tools || []} />
      </div>
    </div>
  )
}
