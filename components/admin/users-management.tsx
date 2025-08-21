"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserAction, deleteUserAction } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  credits: number
  subscription_plan: string
  role: string
  email_verified: boolean
  created_at: string
}

interface UsersManagementProps {
  users: User[]
}

export function UsersManagement({ users }: UsersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    credits: 0,
    role: "user",
  })
  const router = useRouter()

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      credits: user.credits,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const result = await updateUserAction(selectedUser.id, editFormData)

      if (result.success) {
        toast.success("Kullanıcı başarıyla güncellendi")
        setIsEditDialogOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Kullanıcı güncellenirken hata oluştu")
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const result = await deleteUserAction(selectedUser.id)

      if (result.success) {
        toast.success("Kullanıcı başarıyla silindi")
        setIsDeleteDialogOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Kullanıcı silinirken hata oluştu")
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const getSubscriptionBadge = (plan: string) => {
    const variants = {
      free: "secondary",
      professional: "default",
      enterprise: "destructive",
    } as const

    return <Badge variant={variants[plan as keyof typeof variants] || "secondary"}>{plan}</Badge>
  }

  const getRoleBadge = (role: string) => {
    return <Badge variant={role === "admin" ? "destructive" : "outline"}>{role}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Kullanıcılar ({filteredUsers.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kredi</TableHead>
                <TableHead>Abonelik</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.credits}</Badge>
                  </TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription_plan)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.email_verified ? "default" : "secondary"}>
                      {user.email_verified ? "Onaylı" : "Beklemede"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Kullanıcı Düzenle</DialogTitle>
              <DialogDescription>Kullanıcı bilgilerini düzenleyin.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    Ad
                  </Label>
                  <Input
                    id="firstName"
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Soyad
                  </Label>
                  <Input
                    id="lastName"
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="credits" className="text-right">
                    Kredi
                  </Label>
                  <Input
                    id="credits"
                    type="number"
                    value={editFormData.credits}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, credits: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rol
                  </Label>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleSaveUser} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kullanıcıyı Sil</DialogTitle>
              <DialogDescription>
                Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isLoading}>
                {isLoading ? "Siliniyor..." : "Sil"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
