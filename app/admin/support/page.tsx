import { requireAdmin } from "@/lib/admin-auth"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeadphonesIcon, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminSupportPage() {
  await requireAdmin()

  // Mock support tickets data
  const supportTickets = [
    {
      id: "1",
      user: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      subject: "Kredi yüklenmiyor",
      status: "open",
      priority: "high",
      created_at: "2024-01-15T10:30:00Z",
      last_reply: "2024-01-15T14:20:00Z",
    },
    {
      id: "2",
      user: "Fatma Demir",
      email: "fatma@example.com",
      subject: "AI araç çalışmıyor",
      status: "in_progress",
      priority: "medium",
      created_at: "2024-01-14T16:45:00Z",
      last_reply: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      user: "Mehmet Kaya",
      email: "mehmet@example.com",
      subject: "Abonelik iptali",
      status: "resolved",
      priority: "low",
      created_at: "2024-01-13T11:20:00Z",
      last_reply: "2024-01-14T13:30:00Z",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { variant: "destructive" as const, label: "Açık" },
      in_progress: { variant: "default" as const, label: "İşlemde" },
      resolved: { variant: "secondary" as const, label: "Çözüldü" },
    }

    const config = variants[status as keyof typeof variants] || variants.open
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, label: "Yüksek" },
      medium: { variant: "default" as const, label: "Orta" },
      low: { variant: "secondary" as const, label: "Düşük" },
    }

    const config = variants[priority as keyof typeof variants] || variants.medium
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Destek Yönetimi</h1>
          <p className="text-gray-600 mt-2">Kullanıcı destek taleplerini yönet ve takip et</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Açık Talepler</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {supportTickets.filter((t) => t.status === "open").length}
              </div>
              <p className="text-xs text-muted-foreground">Bekleyen destek talepleri</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">İşlemde</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {supportTickets.filter((t) => t.status === "in_progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Üzerinde çalışılan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Çözüldü</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {supportTickets.filter((t) => t.status === "resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">Bu hafta çözülen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama Süre</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2.4h</div>
              <p className="text-xs text-muted-foreground">Yanıt süresi</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeadphonesIcon className="h-5 w-5" />
              Destek Talepleri
            </CardTitle>
            <CardDescription>Tüm kullanıcı destek talepleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Konu</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead>Son Yanıt</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.user}</p>
                          <p className="text-sm text-gray-600">{ticket.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{ticket.subject}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{new Date(ticket.created_at).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell>{new Date(ticket.last_reply).toLocaleDateString("tr-TR")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Görüntüle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
