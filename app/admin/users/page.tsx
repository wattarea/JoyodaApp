import { requireAdmin } from "@/lib/admin-auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Calendar, CreditCard } from "lucide-react"

export default async function UsersManagePage() {
  await requireAdmin()

  const supabase = await createClient()

  // Fetch all users
  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Tüm kullanıcıları görüntüleyin ve yönetin</p>
        </div>

        <div className="grid gap-6">
          {users?.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user.first_name} {user.last_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </Badge>
                    <Badge variant={user.email_verified ? "default" : "outline"}>
                      {user.email_verified ? "Doğrulanmış" : "Doğrulanmamış"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Kredi</p>
                      <p className="font-medium">{user.credits}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Kayıt Tarihi</p>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Abonelik</p>
                    <Badge variant="outline">{user.subscription_plan}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Şirket</p>
                    <p className="font-medium">{user.company || "Belirtilmemiş"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
