"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface N8nWorkflow {
  id?: string
  name: string
  description: string
  production_url: string
  credit_cost: number
  workflow_tag: string
  content_type: string
  category: string
  is_active: boolean
}

interface N8nWorkflowFormProps {
  workflow?: N8nWorkflow
  isOpen: boolean
  onClose: () => void
  onSave: (workflow: N8nWorkflow) => void
}

const categories = ["communication", "processing", "automation", "management", "analytics", "integration"]

const contentTypes = ["email", "image", "data", "video", "audio", "other"]

export function N8nWorkflowForm({ workflow, isOpen, onClose, onSave }: N8nWorkflowFormProps) {
  const [formData, setFormData] = useState<N8nWorkflow>({
    name: workflow?.name || "",
    description: workflow?.description || "",
    production_url: workflow?.production_url || "",
    credit_cost: workflow?.credit_cost || 1,
    workflow_tag: workflow?.workflow_tag || "",
    content_type: workflow?.content_type || "",
    category: workflow?.category || "",
    is_active: workflow?.is_active ?? true,
    ...workflow,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
      toast.success(workflow ? "Workflow güncellendi" : "Workflow eklendi")
      onClose()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workflow ? "Workflow Düzenle" : "Yeni Workflow Ekle"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Workflow Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Email Notification System"
                required
              />
            </div>

            <div>
              <Label htmlFor="credit_cost">Kredi Maliyeti</Label>
              <Input
                id="credit_cost"
                type="number"
                min="1"
                value={formData.credit_cost}
                onChange={(e) => setFormData({ ...formData, credit_cost: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Workflow'un ne yaptığını açıklayın..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="production_url">Production URL</Label>
            <Input
              id="production_url"
              type="url"
              value={formData.production_url}
              onChange={(e) => setFormData({ ...formData, production_url: e.target.value })}
              placeholder="https://n8n.joyoda.com/webhook/your-workflow"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content_type">İçerik Türü</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData({ ...formData, content_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İçerik türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workflow_tag">Etiket</Label>
              <Input
                id="workflow_tag"
                value={formData.workflow_tag}
                onChange={(e) => setFormData({ ...formData, workflow_tag: e.target.value })}
                placeholder="automation"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="is_active">Aktif</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : workflow ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
