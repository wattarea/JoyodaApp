import { requireAdmin } from "@/lib/admin-auth"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Workflow, ExternalLink, Settings, Play } from "lucide-react"

export default async function AdminN8nPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">n8n Workflow Yönetimi</h1>
          <p className="text-gray-600 mt-2">Otomatik iş akışlarını yönet ve izle</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Aktif Workflow'lar
              </CardTitle>
              <CardDescription>Çalışan otomatik süreçler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">Toplam aktif workflow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Günlük Çalıştırma
              </CardTitle>
              <CardDescription>Bugün çalıştırılan işlemler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">247</div>
              <p className="text-xs text-muted-foreground">Başarılı çalıştırma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sistem Durumu
              </CardTitle>
              <CardDescription>n8n sunucu durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Çevrimiçi</div>
              <p className="text-xs text-muted-foreground">Tüm sistemler normal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
              <CardDescription>n8n yönetim paneline erişim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-transparent" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                n8n Dashboard'a Git
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Workflow className="h-4 w-4 mr-2" />
                Yeni Workflow Oluştur
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Ayarları Yönet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>En son çalıştırılan workflow'lar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Bildirimleri</p>
                    <p className="text-sm text-gray-600">Kullanıcı kayıt bildirimi</p>
                  </div>
                  <div className="text-sm text-green-600">Başarılı</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Kredi İşlemleri</p>
                    <p className="text-sm text-gray-600">Otomatik kredi güncellemesi</p>
                  </div>
                  <div className="text-sm text-green-600">Başarılı</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup İşlemi</p>
                    <p className="text-sm text-gray-600">Günlük veritabanı yedeği</p>
                  </div>
                  <div className="text-sm text-green-600">Başarılı</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
