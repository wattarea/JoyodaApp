"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Star, Zap, Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { UnifiedHeader } from "@/components/unified-header"
import { calculateWorkflowCredits } from "@/lib/workflow-credit-calculator"

export default function WorkflowDetailPage() {
  const [workflow, setWorkflow] = useState<any>(null)
  const [pricingRules, setPricingRules] = useState<any[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [calculatedCredits, setCalculatedCredits] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    async function loadWorkflow() {
      try {
        // Check authentication
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.push("/signin")
          return
        }

        setUser(authUser)

        // Get user data
        const { data: userInfo } = await supabase.from("users").select("credits").eq("email", authUser.email).single()
        setUserData(userInfo)

        // Fetch workflow details
        const { data: workflowData, error: workflowError } = await supabase
          .from("n8n_workflows")
          .select("*")
          .eq("workflow_id", params.workflowId)
          .eq("is_active", true)
          .single()

        if (workflowError || !workflowData) {
          router.push("/n8n")
          return
        }

        setWorkflow(workflowData)
        setCalculatedCredits(workflowData.base_credits)

        // Fetch pricing rules for this workflow
        const { data: rulesData } = await supabase
          .from("workflow_pricing_rules")
          .select("*")
          .eq("workflow_id", params.workflowId)

        setPricingRules(rulesData || [])
      } catch (error) {
        console.error("Error loading workflow:", error)
        router.push("/n8n")
      } finally {
        setLoading(false)
      }
    }

    if (params.workflowId) {
      loadWorkflow()
    }
  }, [params.workflowId, router, supabase])

  // Recalculate credits when form data changes
  useEffect(() => {
    if (workflow && pricingRules.length > 0) {
      const credits = calculateWorkflowCredits(workflow.base_credits, formData, pricingRules)
      setCalculatedCredits(credits)
    }
  }, [formData, workflow, pricingRules])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExecuteWorkflow = async () => {
    if (!workflow || !user || !userData) return

    if (userData.credits < calculatedCredits) {
      alert("Insufficient credits. Please purchase more credits.")
      return
    }

    setExecuting(true)

    try {
      // Execute workflow via webhook
      const response = await fetch(workflow.production_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: user.email,
          ...formData,
        }),
      })

      if (response.ok) {
        // Deduct credits
        const { error: creditError } = await supabase
          .from("users")
          .update({ credits: userData.credits - calculatedCredits })
          .eq("email", user.email)

        if (!creditError) {
          setUserData((prev) => ({ ...prev, credits: prev.credits - calculatedCredits }))
          alert("Workflow executed successfully!")
        }
      } else {
        alert("Failed to execute workflow. Please try again.")
      }
    } catch (error) {
      console.error("Error executing workflow:", error)
      alert("An error occurred while executing the workflow.")
    } finally {
      setExecuting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow not found</h2>
          <p className="text-gray-600 mb-4">The workflow you're looking for doesn't exist or has been removed.</p>
          <Link href="/n8n">
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader currentPage="n8n" />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/n8n">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workflows
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Workflow Header */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                {workflow.image_url ? (
                  <img
                    src={workflow.image_url || "/placeholder.svg"}
                    alt={workflow.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{workflow.name}</h1>
                  <p className="text-gray-600 mb-3">{workflow.description}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{workflow.content_type.replace("-", " ")}</Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{workflow.rating || "4.5"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{workflow.usage_count || 0} uses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Form */}
            <Card>
              <CardHeader>
                <CardTitle>Configure Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Example form fields - these would be dynamic based on workflow */}
                <div>
                  <Label htmlFor="story">Story *</Label>
                  <Textarea
                    id="story"
                    placeholder="Buraya Prompt yazacak"
                    value={formData.story || ""}
                    onChange={(e) => handleInputChange("story", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="scenes">Number of scenes</Label>
                  <Input
                    id="scenes"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.scenes || 5}
                    onChange={(e) => handleInputChange("scenes", Number.parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="aspect_ratio">Aspect ratio *</Label>
                  <Select
                    value={formData.aspect_ratio || "16:9"}
                    onValueChange={(value) => handleInputChange("aspect_ratio", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resolution">Resolution *</Label>
                  <Select
                    value={formData.resolution || "480p"}
                    onValueChange={(value) => handleInputChange("resolution", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    value={formData.duration || "5"}
                    onValueChange={(value) => handleInputChange("duration", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Credit Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{calculatedCredits}</div>
                    <div className="text-sm text-gray-500">credits required</div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Your credits:</span>
                      <span className="font-medium">{userData?.credits || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>After execution:</span>
                      <span
                        className={`font-medium ${(userData?.credits || 0) - calculatedCredits < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {(userData?.credits || 0) - calculatedCredits}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleExecuteWorkflow}
                    disabled={executing || !userData || userData.credits < calculatedCredits}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {executing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Workflow
                      </>
                    )}
                  </Button>

                  {userData && userData.credits < calculatedCredits && (
                    <div className="text-center">
                      <p className="text-sm text-red-600 mb-2">Insufficient credits</p>
                      <Link href="/pricing">
                        <Button variant="outline" size="sm">
                          Buy Credits
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
