import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Calendar,
  Crown,
  TrendingUp,
  Sparkles,
  User,
  ShoppingCart,
  RefreshCw,
  Wand2,
  Scissors,
  Palette,
  UserCheck,
  ImageIcon,
  Shirt,
} from "lucide-react"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClickableImageThumbnail } from "@/components/clickable-image-thumbnail"
import { UnifiedHeader } from "@/components/unified-header"

const iconMap: Record<string, any> = {
  "background-remover": Scissors,
  "face-enhancer": UserCheck,
  "style-transfer": Palette,
  "text-to-image": Wand2,
  imagen4: Wand2,
  "virtual-tryon": Shirt,
  "face-swap": RefreshCw,
  "age-progression": RefreshCw,
  "image-upscaler": TrendingUp,
  "text-to-video-kling": ImageIcon,
  "text-to-video-hailuo": ImageIcon,
  // Category fallbacks
  editing: Scissors,
  enhancement: UserCheck,
  artistic: Palette,
  generation: Wand2,
  fashion: Shirt,
  creative: RefreshCw,
  "image editing": RefreshCw,
  "text-to-image": Wand2,
  "text-to-video": ImageIcon,
  "image-to-video": ImageIcon,
}

const categoryColors: Record<string, string> = {
  editing: "bg-blue-100 text-blue-700",
  enhancement: "bg-purple-100 text-purple-700",
  artistic: "bg-pink-100 text-pink-700",
  generation: "bg-green-100 text-green-700",
  fashion: "bg-orange-100 text-orange-700",
  creative: "bg-red-100 text-red-700",
  "text-to-image": "bg-green-100 text-green-700",
  "text-to-video": "bg-indigo-100 text-indigo-700",
  "image-to-video": "bg-indigo-100 text-indigo-700",
}

export default async function DashboardPage() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  try {
    // Get the user from the server
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect("/signin")
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single()

    let finalUserData = userData

    // If no user data found, create a basic profile
    if (!userData && !userError) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email: user.email,
          first_name: user.user_metadata?.first_name || "User",
          last_name: user.user_metadata?.last_name || "",
          credits: 10,
          subscription_plan: "free",
          password_hash: "supabase_auth",
        })
        .select()
        .single()

      if (!createError && newUser) {
        finalUserData = newUser
      }
    }

    if (!finalUserData) {
      // Create a minimal user object to prevent crashes
      finalUserData = {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || "User",
        last_name: user.user_metadata?.last_name || "",
        credits: 0,
        subscription_plan: "free",
      }
    }

    const userId = finalUserData?.id

    const { data: tools } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("is_active", true)
      .order("usage_count", { ascending: false })
      .limit(5)

    const { data: recentJobs } = await supabase
      .from("tool_executions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: toolExecutions } = await supabase
      .from("tool_executions")
      .select("credits_used, created_at")
      .eq("user_id", userId)

    const currentMonth = new Date()
    const creditsUsedThisMonth =
      toolExecutions
        ?.filter((execution) => {
          const executionDate = new Date(execution.created_at)
          return (
            executionDate.getMonth() === currentMonth.getMonth() &&
            executionDate.getFullYear() === currentMonth.getFullYear()
          )
        })
        .reduce((sum, execution) => sum + (execution.credits_used || 0), 0) || 0

    const totalCredits = finalUserData?.credits || 0
    const usagePercentage = totalCredits > 0 ? (creditsUsedThisMonth / totalCredits) * 100 : 0

    // Calculate completed jobs count
    const completedJobs = recentJobs?.filter((job) => job.status === "completed").length || 0

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Unified Header */}
        <UnifiedHeader currentPage="dashboard" />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {finalUserData?.first_name || "User"} {finalUserData?.last_name || ""}!
            </h1>
            <p className="text-gray-600">Unleash your creativity with AI tools</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Available Credits</p>
                  <p className="text-2xl font-bold">{totalCredits}</p>
                  <p className="text-xs text-gray-500">Active Generations</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Total Generated</p>
                  <p className="text-2xl font-bold">{completedJobs}</p>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">{creditsUsedThisMonth}</p>
                  <p className="text-xs text-gray-500">Credits Used</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Subscription</p>
                  <p className="text-2xl font-bold capitalize">{finalUserData?.subscription_plan || "Free"}</p>
                  <p className="text-xs text-gray-500">Current Plan</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Tools Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <CardTitle>AI Tools</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">Choose a tool to transform your images</p>
                  <Link href="/tools">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tools && tools.length > 0 ? (
                    tools.map((tool) => {
                      const IconComponent = iconMap[tool.tool_id] || iconMap[tool.category] || ImageIcon
                      const categoryColor = categoryColors[tool.category] || "bg-gray-100 text-gray-700"

                      return (
                        <Link key={tool.tool_id} href={`/tools/${tool.tool_id}`} className="block">
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {tool.image_url ? (
                                  <img
                                    src={tool.image_url || "/placeholder.svg"}
                                    alt={tool.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to icon if image fails to load
                                      const target = e.target as HTMLImageElement
                                      target.style.display = "none"
                                      target.nextElementSibling?.classList.remove("hidden")
                                    }}
                                  />
                                ) : null}
                                <IconComponent
                                  className={`w-5 h-5 text-purple-600 ${tool.image_url ? "hidden" : ""}`}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{tool.name}</h4>
                                <p className="text-sm text-gray-600 line-clamp-1">{tool.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={categoryColor}>
                                {tool.category.replace("-", " ")}
                              </Badge>
                              <span className="text-sm font-medium">{tool.credits_per_use} credits</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No tools available at the moment.</p>
                      <p className="text-gray-500 text-sm">Check back later for new AI tools.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <CardTitle>Recent Activity</CardTitle>
                  </div>
                  <Link href="/my-documents">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Your recent operations</p>
                  <div className="mt-4">
                    {recentJobs && recentJobs.length > 0 ? (
                      <div className="space-y-3">
                        {recentJobs.map((job) => (
                          <div key={job.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            {job.output_file_url ? (
                              <ClickableImageThumbnail
                                imageUrl={job.output_file_url}
                                altText={`Generated by ${job.tool_id}`}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{job.tool_id}</p>
                              <p className="text-xs text-gray-500">{new Date(job.created_at).toLocaleDateString()}</p>
                            </div>
                            <Badge
                              variant={job.status === "completed" ? "default" : "secondary"}
                              className={
                                job.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : job.status === "failed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <RefreshCw className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">You haven't done anything yet.</p>
                        <p className="text-gray-500 text-sm">Start using your first AI tool.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-4">
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/credits">
                      <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Credits
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full justify-start bg-transparent mb-2">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    You've used {creditsUsedThisMonth}/{totalCredits} credits this month
                  </p>
                  <Progress value={Math.min(usagePercentage, 100)} className="mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{creditsUsedThisMonth} used</span>
                    <span>{totalCredits} available</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <Link href="/signin">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }
}
