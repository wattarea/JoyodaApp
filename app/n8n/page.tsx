"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Heart, Zap, Video, ImageIcon, FileText, Music, Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { UnifiedHeader } from "@/components/unified-header"

// Icon mapping for different workflow content types
const iconMap: Record<string, any> = {
  video: Video,
  image: ImageIcon,
  text: FileText,
  audio: Music,
  automation: Zap,
  // Category fallbacks
  "ai-video": Video,
  "image-processing": ImageIcon,
  "content-generation": FileText,
  "data-processing": Zap,
}

export default function N8nWorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
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

        // Fetch workflows
        const { data: workflowsData, error: workflowsError } = await supabase
          .from("n8n_workflows")
          .select("*")
          .eq("is_active", true)
          .order("name")

        if (workflowsError) {
          console.error("Error fetching workflows:", workflowsError)
        } else {
          setWorkflows(workflowsData || [])
          setFilteredWorkflows(workflowsData || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, supabase])

  // Filter workflows based on search and category
  useEffect(() => {
    let filtered = workflows

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.content_type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((workflow) => workflow.content_type === selectedCategory)
    }

    setFilteredWorkflows(filtered)
  }, [workflows, searchQuery, selectedCategory])

  // Get categories and their counts
  const categories = workflows.reduce((acc: Record<string, number>, workflow) => {
    acc[workflow.content_type] = (acc[workflow.content_type] || 0) + 1
    return acc
  }, {})

  // Featured workflows
  const featuredWorkflows = filteredWorkflows
    .filter((workflow) => workflow.is_featured)
    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
    .slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Header */}
      <UnifiedHeader currentPage="n8n" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">N8N Workflows</h1>
          <p className="text-gray-600">Discover powerful automation workflows to streamline your tasks</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workflows..."
              className="pl-10 h-12 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={selectedCategory === "all" ? "bg-purple-600 hover:bg-purple-700" : "bg-white"}
              onClick={() => setSelectedCategory("all")}
            >
              All ({workflows.length})
            </Button>
            {Object.entries(categories).map(([category, count]) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : "bg-white"}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Workflows */}
        {featuredWorkflows.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Workflows</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredWorkflows.map((workflow) => {
                const IconComponent = iconMap[workflow.content_type] || Zap
                return (
                  <Link key={workflow.workflow_id} href={`/n8n/${workflow.workflow_id}`}>
                    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Hero Visual Area */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                        </div>

                        <div className="absolute inset-0">
                          {workflow.image_url ? (
                            <img
                              src={workflow.image_url || "/placeholder.svg"}
                              alt={workflow.name}
                              className="w-full h-full object-cover absolute inset-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={`${workflow.image_url ? "hidden" : ""} w-full h-full flex items-center justify-center absolute inset-0`}
                          >
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-10 h-10 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Featured Badge - Top Right */}
                        <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-semibold shadow-lg z-10">
                          ⭐ Featured
                        </Badge>

                        {/* Content Type Badge - Top Left */}
                        <Badge
                          variant="secondary"
                          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white border-white/30 z-10"
                        >
                          {workflow.content_type.replace("-", " ")}
                        </Badge>

                        {/* Stats Overlay - Bottom */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{workflow.rating || "4.5"}</span>
                            </div>
                            <span className="opacity-70">•</span>
                            <span className="opacity-90">{workflow.usage_count || 0} uses</span>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-sm font-semibold">{workflow.base_credits} credits</span>
                          </div>
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                            {workflow.name}
                          </h3>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 -mt-1">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-600 text-sm leading-snug line-clamp-2">{workflow.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All Workflows */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Workflows</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredWorkflows.length} workflows found</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorkflows.map((workflow) => {
              const IconComponent = iconMap[workflow.content_type] || Zap
              return (
                <Link key={workflow.workflow_id} href={`/n8n/${workflow.workflow_id}`}>
                  <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    {/* Compact Hero Visual Area */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:15px_15px]"></div>
                      </div>

                      <div className="absolute inset-0">
                        {workflow.image_url ? (
                          <img
                            src={workflow.image_url || "/placeholder.svg"}
                            alt={workflow.name}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : null}
                        <div
                          className={`${workflow.image_url ? "hidden" : ""} w-full h-full flex items-center justify-center absolute inset-0`}
                        >
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Featured Badge - If Featured */}
                      {workflow.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-semibold z-10">
                          Featured
                        </Badge>
                      )}

                      {/* Content Type Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs z-10"
                      >
                        {workflow.content_type.replace("-", " ")}
                      </Badge>

                      {/* Bottom Stats */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs z-10">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{workflow.rating || "4.5"}</span>
                          </div>
                          <span className="opacity-70">•</span>
                          <span className="opacity-90">{workflow.usage_count || 0} uses</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          <span className="font-semibold">{workflow.base_credits}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <CardContent className="p-3 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {workflow.name}
                        </h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 -mt-1 p-1">
                          <Heart className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-xs leading-tight line-clamp-2 flex-1">{workflow.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "all"
                  ? "No workflows match your search"
                  : "No workflows available"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Check back later for new automation workflows."}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
