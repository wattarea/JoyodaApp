import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { UsersManagement } from "@/components/admin/users-management"

export default async function UsersManagePage() {
  await requireAdmin()

  const supabase = await createClient()

  // Fetch all users
  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kullanıcı Yönetimi</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Kullanıcılar yüklenirken hata: {error.message}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Tüm kullanıcıları görüntüleyin ve yönetin</p>
        </div>

        <UsersManagement users={users || []} />
      </div>
    </div>
  )
}
