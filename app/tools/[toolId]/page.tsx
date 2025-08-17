import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, TrendingUp, Target, ImageIcon, Download, Eye } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ToolExecutionForm } from "@/components/tool-execution-form"
import { UnifiedHeader } from "@/components/unified-header"
import Image from "next/image"

interface ToolPageProps {
  params: {
    toolId: string
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signin")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  if (!userData) {
    redirect("/signin")
  }

  // Fetch the specific tool
  const { data: tool, error } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("tool_id", params.toolId)
    .eq("is_active", true)
    .single()

  if (error || !tool) {
    notFound()
  }

  // Get tool usage statistics
  const { data: usageStats } = await supabase
    .from("tool_executions")
    .select("*")
    .eq("tool_id", tool.tool_id)
    .eq("status", "completed")

  const totalUsage = usageStats?.length || 0
  const avgProcessingTime = usageStats?.length
    ? Math.round(usageStats.reduce((sum, stat) => sum + (stat.processing_time_seconds || 0), 0) / usageStats.length)
    : 30

  const { data: userToolExecutions } = await supabase
    .from("tool_executions")
    .select("*")
    .eq("user_id", userData.id)
    .eq("tool_id", tool.tool_id)
    .not("output_file_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(6)

  const { data: userImageJobs } = await supabase
    .from("image_processing_jobs")
    .select("*")
    .eq("user_id", userData.id)
    .eq("tool_id", tool.tool_id)
    .not("output_image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(6)

  // Combine user's images for this tool
  const userImages = [
    ...(userToolExecutions || []).map((execution) => ({
      id: execution.id,
      type: "execution" as const,
      outputUrl: execution.output_file_url,
      createdAt: execution.created_at,
      status: execution.status,
      creditsUsed: execution.credits_used,
    })),
    ...(userImageJobs || []).map((job) => ({
      id: job.id,
      type: "job" as const,
      outputUrl: job.output_image_url,
      createdAt: job.created_at,
      status: job.status,
      creditsUsed: job.credits_used,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  // Get related tools from the same category
  const { data: relatedTools } = await supabase
    .from("ai_tools")
    .select("tool_id, name, credits_per_use")
    .eq("category", tool.category)
    .eq("is_active", true)
    .neq("tool_id", tool.tool_id)
    .limit(3)

  // Define capabilities based on tool category
  const getCapabilities = (category: string, model: string) => {
    if (category === "fashion") {
      return [
        {
          icon: CheckCircle,
          title: "Virtual Fashion Try-On",
          description: "Advanced AI model for realistic clothing visualization",
        },
        {
          icon: TrendingUp,
          title: "Realistic Results",
          description: "Professional-grade virtual fitting in seconds",
        },
        {
          icon: Target,
          title: "Multiple Garment Types",
          description: "Supports tops, dresses, outerwear, and more",
        },
        {
          icon: CheckCircle,
          title: "Dual Image Processing",
          description: "Upload person and garment images for perfect fitting",
        },
      ]
    }

    const baseCapabilities = [
      {
        icon: CheckCircle,
        title: "AI-powered processing",
        description: `Advanced ${model} model for professional results`,
      },
      {
        icon: TrendingUp,
        title: "High-quality output",
        description: "Professional-grade results in seconds",
      },
      {
        icon: Target,
        title: "Optimized performance",
        description: "Fast processing with consistent quality",
      },
      {
        icon: CheckCircle,
        title: "Easy to use",
        description: "Simple upload and download process",
      },
    ]

    return baseCapabilities
  }

  const capabilities = getCapabilities(tool.category, tool.fal_model_id)

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader currentPage="tools" />

      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/tools"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>
        </div>

        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{tool.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Fast Processing
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Target className="w-3 h-3 mr-1" />
                  Professional Quality
                </Badge>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white text-sm px-3 py-1">{tool.credits_per_use} credits per use</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Stats */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Performance Stats</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{totalUsage}+</div>
                    <div className="text-sm opacity-90">Images Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">99.9%</div>
                    <div className="text-sm opacity-90">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{avgProcessingTime}s</div>
                    <div className="text-sm opacity-90">Average Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tool Execution Form */}
            <ToolExecutionForm tool={tool} userCredits={userData?.credits || 0} />

            {userImages.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      My Documents ({userImages.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/my-documents">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userImages.map((image) => (
                      <div key={`${image.type}-${image.id}`} className="group relative">
                        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                          {image.outputUrl ? (
                            <Image
                              src={image.outputUrl || "/placeholder.svg"}
                              alt={`Generated with ${tool.name}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}

                          {/* Overlay with actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {image.outputUrl && (
                              <>
                                <Button size="sm" variant="secondary" asChild>
                                  <a href={image.outputUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                                <Button size="sm" variant="secondary" asChild>
                                  <a href={image.outputUrl} download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Image info */}
                        <div className="mt-2 text-center">
                          <Badge
                            variant={
                              image.status === "completed" || image.status === "success" ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {image.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userImages.length >= 6 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" asChild>
                        <Link href="/my-documents">View All My Documents</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What This Tool Does */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  What This Tool Does
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <capability.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{capability.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{tool.fal_model_id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{tool.category.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit cost:</span>
                  <span className="font-medium">{tool.credits_per_use} credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing time:</span>
                  <span className="font-medium">~{avgProcessingTime} seconds</span>
                </div>
              </CardContent>
            </Card>

            {/* Try Other AI Tools */}
            {relatedTools && relatedTools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Try Other AI Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Explore more ways to enhance your images</p>
                  <div className="space-y-3">
                    {relatedTools.map((relatedTool) => (
                      <Link key={relatedTool.tool_id} href={`/tools/${relatedTool.tool_id}`}>
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-sm">{relatedTool.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{relatedTool.credits_per_use} credits</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
