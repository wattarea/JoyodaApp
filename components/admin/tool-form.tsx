"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createToolAction, updateToolAction } from "@/lib/admin-actions"

interface Tool {
  id?: number
  tool_id: string
  name: string
  description: string
  category: string
  credits_per_use: number
  fal_model_id: string
  api_provider: string
  is_active: boolean
  is_featured: boolean
  icon_name?: string
  processing_time_estimate?: number
  success_rate?: number
  max_file_size_mb?: number
  output_format?: string
  supported_formats?: any
  input_parameters?: any
}

interface ToolFormProps {
  tool?: Tool
  onSuccess: (tool: Tool) => void
  onCancel: () => void
}

export function ToolForm({ tool, onSuccess, onCancel }: ToolFormProps) {
  const [formData, setFormData] = useState<Tool>({
    tool_id: tool?.tool_id || "",
    name: tool?.name || "",
    description: tool?.description || "",
    category: tool?.category || "editing",
    credits_per_use: tool?.credits_per_use || 1,
    fal_model_id: tool?.fal_model_id || "",
    api_provider: tool?.api_provider || "fal.ai",
    is_active: tool?.is_active ?? true,
    is_featured: tool?.is_featured ?? false,
    icon_name: tool?.icon_name || "",
    processing_time_estimate: tool?.processing_time_estimate || 30,
    success_rate: tool?.success_rate || 99.9,
    max_file_size_mb: tool?.max_file_size_mb || 10,
    output_format: tool?.output_format || "PNG",
    ...tool,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = tool ? await updateToolAction(tool.id!, formData) : await createToolAction(formData)

      if (result.success) {
        onSuccess(result.tool!)
      } else {
        alert("Error saving tool: " + result.error)
      }
    } catch (error) {
      alert("Error saving tool: " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    "editing",
    "enhancement",
    "generation",
    "artistic",
    "text-to-image",
    "image-to-video",
    "text-to-video",
    "creative",
    "fashion",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tool_id">Tool ID</Label>
            <Input
              id="tool_id"
              value={formData.tool_id}
              onChange={(e) => setFormData({ ...formData, tool_id: e.target.value })}
              placeholder="e.g., background-remover"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Tool Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Background Remover"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="credits_per_use">Credits Per Use</Label>
            <Input
              id="credits_per_use"
              type="number"
              min="1"
              value={formData.credits_per_use || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 1 : Number.parseInt(e.target.value) || 1
                setFormData({ ...formData, credits_per_use: value })
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="fal_model_id">FAL Model ID</Label>
            <Input
              id="fal_model_id"
              value={formData.fal_model_id}
              onChange={(e) => setFormData({ ...formData, fal_model_id: e.target.value })}
              placeholder="e.g., fal-ai/birefnet"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="api_provider">API Provider</Label>
            <Input
              id="api_provider"
              value={formData.api_provider}
              onChange={(e) => setFormData({ ...formData, api_provider: e.target.value })}
              placeholder="e.g., fal.ai"
              required
            />
          </div>

          <div>
            <Label htmlFor="processing_time_estimate">Processing Time (seconds)</Label>
            <Input
              id="processing_time_estimate"
              type="number"
              min="1"
              value={formData.processing_time_estimate || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 30 : Number.parseInt(e.target.value) || 30
                setFormData({ ...formData, processing_time_estimate: value })
              }}
            />
          </div>

          <div>
            <Label htmlFor="success_rate">Success Rate (%)</Label>
            <Input
              id="success_rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.success_rate || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 99.9 : Number.parseFloat(e.target.value) || 99.9
                setFormData({ ...formData, success_rate: value })
              }}
            />
          </div>

          <div>
            <Label htmlFor="max_file_size_mb">Max File Size (MB)</Label>
            <Input
              id="max_file_size_mb"
              type="number"
              min="1"
              value={formData.max_file_size_mb || ""}
              onChange={(e) => {
                const value = e.target.value === "" ? 10 : Number.parseInt(e.target.value) || 10
                setFormData({ ...formData, max_file_size_mb: value })
              }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this tool does..."
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
          {isSubmitting ? "Saving..." : tool ? "Update Tool" : "Create Tool"}
        </Button>
      </div>
    </form>
  )
}
