"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { N8nWorkflowForm } from "./n8n-workflow-form"
import { Plus, Search, ExternalLink, Edit, Trash2, Play, Pause } from "lucide-react"
import { toast } from "sonner"

interface N8nWorkflow {
  id: string
  name: string
  description: string
  production_url: string
  credit_cost: number
  workflow_tag: string
  content_type: string
  category: string
  is_active: boolean
  execution_count: number
  last_executed_at: string | null
  created_at: string
}

interface N8nWorkflowsManagementProps {
  initialWorkflows: N8nWorkflow[]
}

export function N8nWorkflowsManagement({ initialWorkflows }: N8nWorkflowsManagementProps) {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>(initialWorkflows)
  const [filteredWorkflows, setFilteredWorkflows] = useState<N8nWorkflow[]>(initialWorkflows)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<N8nWorkflow | undefined>()

  const filterWorkflows = () => {
    let filtered = workflows

    if (searchTerm) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((workflow) => workflow.category === categoryFilter)
    }

    setFilteredWorkflows(filtered)
  }

  useState(() => {
    filterWorkflows()
  }, [searchTerm, categoryFilter, workflows])

  const handleSaveWorkflow = async (workflowData: any) => {
    try {
      const response = await fetch("/api/admin/n8n-workflows", {
        method: editingWorkflow ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWorkflow ? { ...workflowData, id: editingWorkflow.id } : workflowData),
      })

      if (!response.ok) throw new Error("Failed to save workflow")

      const savedWorkflow = await response.json()

      if (editingWorkflow) {
        setWorkflows(workflows.map((w) => (w.id === editingWorkflow.id ? savedWorkflow : w)))
      } else {
        setWorkflows([savedWorkflow, ...workflows])
      }

      setEditingWorkflow(undefined)
      filterWorkflows()
    } catch (error) {
      throw error
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm("Bu workflow'u silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/n8n-workflows?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete workflow")

      setWorkflows(workflows.filter((w) => w.id !== id))
      filterWorkflows()
      toast.success("Workflow silindi")
    } catch (error) {
      toast.error("Workflow silinirken hata oluştu")
    }
  }

  const handleToggleActive = async (workflow: N8nWorkflow) => {
    try {
      const response = await fetch("/api/admin/n8n-workflows", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...workflow, is_active: !workflow.is_active }),
      })

      if (!response.ok) throw new Error("Failed to toggle workflow")

      const updatedWorkflow = await response.json()
      setWorkflows(workflows.map((w) => (w.id === workflow.id ? updatedWorkflow : w)))
      filterWorkflows()
      toast.success(`Workflow ${updatedWorkflow.is_active ? "aktif" : "pasif"} edildi`)
    } catch (error) {
      toast.error("Workflow durumu değiştirilemedi")
    }
  }

  const categories = [...new Set(workflows.map((w) => w.category))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">n8n Workflow'ları</h2>
          <p className="text-gray-600">Otomatik iş akışlarını yönetin</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Workflow Ekle
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Workflow ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Kategori filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription className="mt-1">{workflow.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => window.open(workflow.production_url, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(workflow)}>
                    {workflow.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kredi Maliyeti:</span>
                  <Badge variant="secondary">{workflow.credit_cost} kredi</Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{workflow.category}</Badge>
                  <Badge variant="outline">{workflow.content_type}</Badge>
                  {workflow.workflow_tag && <Badge variant="outline">{workflow.workflow_tag}</Badge>}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Çalıştırma: {workflow.execution_count}</span>
                  <Badge variant={workflow.is_active ? "default" : "secondary"}>
                    {workflow.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingWorkflow(workflow)
                      setIsFormOpen(true)
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Henüz workflow bulunmuyor.</p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            İlk Workflow'u Ekle
          </Button>
        </div>
      )}

      <N8nWorkflowForm
        workflow={editingWorkflow}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingWorkflow(undefined)
        }}
        onSave={handleSaveWorkflow}
      />
    </div>
  )
}
