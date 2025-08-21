import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wrench, DollarSign, Package, TrendingUp, Activity } from "lucide-react"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminPage() {
  await requireAdmin()

  const supabase = await createClient()

  // Get recent users count
  const { data: recentUsers, error: usersError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(10)

  // Get total users count
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get recent tool executions
  const { data: recentTools, error: toolsError } = await supabase
    .from("tool_executions")
    .select(`
      id, 
      created_at,
      ai_tools (name),
      users (first_name, last_name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get total revenue from credit transactions
  const { data: revenue } = await supabase
    .from("credit_transactions")
    .select("amount")
    .eq("transaction_type", "purchase")

  const totalRevenue = revenue?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0

  // Get subscription stats
  const { data: subscriptions } = await supabase.from("users").select("subscription_plan")

  const subscriptionStats =
    subscriptions?.reduce(
      (acc, user) => {
        acc[user.subscription_plan] = (acc[user.subscription_plan] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Sistem yönetimi ve istatistikler</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Kayıtlı kullanıcı sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kazanç</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Kredi satışlarından</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Üyeler</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(subscriptionStats.professional || 0) + (subscriptionStats.enterprise || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Ücretli abonelik</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Araç Kullanımı</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{recentTools?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Son 10 işlem</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Son Üyeler
              </CardTitle>
              <CardDescription>En son kayıt olan kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString("tr-TR")}</div>
                  </div>
                )) || <p className="text-gray-500">Henüz üye yok</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Son Kullanılan Araçlar
              </CardTitle>
              <CardDescription>En son kullanılan AI araçları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTools?.map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{execution.ai_tools?.name}</p>
                      <p className="text-sm text-gray-600">
                        {execution.users?.first_name} {execution.users?.last_name}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(execution.created_at).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                )) || <p className="text-gray-500">Henüz araç kullanımı yok</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Abonelik Dağılımı
              </CardTitle>
              <CardDescription>Kullanıcıların abonelik planları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{subscriptionStats.free || 0}</div>
                  <div className="text-sm text-gray-500">Ücretsiz</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{subscriptionStats.professional || 0}</div>
                  <div className="text-sm text-gray-500">Professional</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{subscriptionStats.enterprise || 0}</div>
                  <div className="text-sm text-gray-500">Enterprise</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
