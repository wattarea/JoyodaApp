"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

interface PricingRule {
  id?: number
  parameter_name: string
  parameter_value: string
  credit_multiplier: number
  base_credits: number
}

interface WorkflowPricingRulesProps {
  workflowId: number
  workflowName: string
}

export default function WorkflowPricingRules({ workflowId, workflowName }: WorkflowPricingRulesProps) {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [newRule, setNewRule] = useState<PricingRule>({
    parameter_name: "",
    parameter_value: "",
    credit_multiplier: 1.0,
    base_credits: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRules()
  }, [workflowId])

  const fetchRules = async () => {
    try {
      const response = await fetch(`/api/admin/workflow-pricing-rules?workflowId=${workflowId}`)
      if (response.ok) {
        const data = await response.json()
        setRules(data)
      }
    } catch (error) {
      console.error("Error fetching pricing rules:", error)
    }
  }

  const addRule = async () => {
    if (!newRule.parameter_name) {
      toast.error("Parameter name is required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/workflow-pricing-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRule,
          workflow_id: workflowId,
        }),
      })

      if (response.ok) {
        toast.success("Pricing rule added successfully")
        setNewRule({
          parameter_name: "",
          parameter_value: "",
          credit_multiplier: 1.0,
          base_credits: 0,
        })
        fetchRules()
      } else {
        toast.error("Failed to add pricing rule")
      }
    } catch (error) {
      toast.error("Error adding pricing rule")
    } finally {
      setLoading(false)
    }
  }

  const deleteRule = async (ruleId: number) => {
    try {
      const response = await fetch(`/api/admin/workflow-pricing-rules?id=${ruleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Pricing rule deleted")
        fetchRules()
      } else {
        toast.error("Failed to delete pricing rule")
      }
    } catch (error) {
      toast.error("Error deleting pricing rule")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Pricing Rules - {workflowName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Rule */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
          <div>
            <Label htmlFor="parameter_name">Parameter Name</Label>
            <Input
              id="parameter_name"
              placeholder="e.g., resolution, duration"
              value={newRule.parameter_name}
              onChange={(e) => setNewRule({ ...newRule, parameter_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="parameter_value">Parameter Value</Label>
            <Input
              id="parameter_value"
              placeholder="e.g., 1080p, 30s"
              value={newRule.parameter_value}
              onChange={(e) => setNewRule({ ...newRule, parameter_value: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="credit_multiplier">Credit Multiplier</Label>
            <Input
              id="credit_multiplier"
              type="number"
              step="0.1"
              min="0"
              value={newRule.credit_multiplier}
              onChange={(e) => setNewRule({ ...newRule, credit_multiplier: Number.parseFloat(e.target.value) || 1.0 })}
            />
          </div>
          <div>
            <Label htmlFor="base_credits">Base Credits</Label>
            <Input
              id="base_credits"
              type="number"
              min="0"
              value={newRule.base_credits}
              onChange={(e) => setNewRule({ ...newRule, base_credits: Number.parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addRule} disabled={loading} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>

        {/* Existing Rules */}
        <div className="space-y-2">
          <h4 className="font-medium">Current Pricing Rules</h4>
          {rules.length === 0 ? (
            <p className="text-gray-500 text-sm">No pricing rules defined yet.</p>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Parameter:</span> {rule.parameter_name}
                    </div>
                    <div>
                      <span className="font-medium">Value:</span> {rule.parameter_value || "Any"}
                    </div>
                    <div>
                      <span className="font-medium">Multiplier:</span> {rule.credit_multiplier}x
                    </div>
                    <div>
                      <span className="font-medium">Base Credits:</span> {rule.base_credits}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rule.id && deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Calculation Example */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Credit Calculation Logic</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Base credits are added to the total</p>
            <p>• Parameter multipliers are applied to the workflow's base cost</p>
            <p>• Formula: (Workflow Base Cost × Multipliers) + Base Credits</p>
            <p>• Example: (10 credits × 2.0 resolution × 1.5 duration) + 5 scene credits = 35 credits</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
