import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { N8nWorkflowsManagement } from "@/components/admin/n8n-workflows-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Workflow, Play, Settings, TrendingUp } from "lucide-react"

export default async function AdminN8nPage() {
  await requireAdmin()

  const supabase = await createClient()

  const { data: workflows, error } = await supabase
    .from("n8n_workflows")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching workflows:", error)
  }

  const workflowsData = workflows || []
  const activeWorkflows = workflowsData.filter((w) => w.is_active).length
  const totalExecutions = workflowsData.reduce((sum, w) => sum + (w.execution_count || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">n8n Workflow Yönetimi</h1>
          <p className="text-gray-600 mt-2">Otomatik iş akışlarını yönet ve izle</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Toplam Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{workflowsData.length}</div>
              <p className="text-xs text-muted-foreground">Kayıtlı workflow sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Aktif Workflow'lar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeWorkflows}</div>
              <p className="text-xs text-muted-foreground">Çalışan otomatik süreçler</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Toplam Çalıştırma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalExecutions}</div>
              <p className="text-xs text-muted-foreground">Başarılı çalıştırma sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sistem Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Çevrimiçi</div>
              <p className="text-xs text-muted-foreground">Tüm sistemler normal</p>
            </CardContent>
          </Card>
        </div>

        <N8nWorkflowsManagement initialWorkflows={workflowsData} />
      </div>
    </div>
  )
}
