"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { ToolForm } from "./tool-form"
import { deleteToolAction, toggleToolStatusAction } from "@/lib/admin-actions"

interface Tool {
  id: number
  tool_id: string
  name: string
  description: string
  category: string
  credits_per_use: number
  fal_model_id: string
  api_provider: string
  is_active: boolean
  is_featured: boolean
  usage_count: number
  rating: number
  created_at: string
}

interface ToolsManagementClientProps {
  initialTools: Tool[]
}

export function ToolsManagementClient({ initialTools }: ToolsManagementClientProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  const categories = ["all", ...Array.from(new Set(tools.map((tool) => tool.category)))]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteTool = async (toolId: string) => {
    if (confirm("Are you sure you want to delete this tool?")) {
      const result = await deleteToolAction(toolId)
      if (result.success) {
        setTools(tools.filter((tool) => tool.tool_id !== toolId))
      } else {
        alert("Error deleting tool: " + result.error)
      }
    }
  }

  const handleToggleStatus = async (toolId: string, currentStatus: boolean) => {
    const result = await toggleToolStatusAction(toolId, !currentStatus)
    if (result.success) {
      setTools(tools.map((tool) => (tool.tool_id === toolId ? { ...tool, is_active: !currentStatus } : tool)))
    } else {
      alert("Error updating tool status: " + result.error)
    }
  }

  const handleToolUpdate = (updatedTool: Tool) => {
    setTools(tools.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool)))
    setEditingTool(null)
  }

  const handleToolAdd = (newTool: Tool) => {
    setTools([newTool, ...tools])
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Tool</DialogTitle>
            </DialogHeader>
            <ToolForm onSuccess={handleToolAdd} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{tools.length}</div>
            <div className="text-sm text-gray-600">Total Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{tools.filter((t) => t.is_active).length}</div>
            <div className="text-sm text-gray-600">Active Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{tools.filter((t) => t.is_featured).length}</div>
            <div className="text-sm text-gray-600">Featured Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {tools.reduce((sum, t) => sum + (t.usage_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Usage</div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(tool.tool_id, tool.is_active)}
                    className={tool.is_active ? "text-green-600" : "text-gray-400"}
                  >
                    {tool.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTool(tool)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTool(tool.tool_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{tool.credits_per_use}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">API Provider:</span>
                  <span className="font-medium">{tool.api_provider}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium">{tool.usage_count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">{tool.rating ? `${tool.rating}/5` : "N/A"}</span>
                </div>
                <div className="flex gap-2">
                  {tool.is_active && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                  {tool.is_featured && <Badge className="bg-blue-100 text-blue-800">Featured</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tools found matching your criteria.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTool} onOpenChange={() => setEditingTool(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tool: {editingTool?.name}</DialogTitle>
          </DialogHeader>
          {editingTool && (
            <ToolForm tool={editingTool} onSuccess={handleToolUpdate} onCancel={() => setEditingTool(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
