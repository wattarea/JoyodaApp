"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Download, Eye, ImageIcon, Zap, Filter, Play, Pause } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UnifiedHeader } from "@/components/unified-header"

type DocumentItem = {
  id: string
  type: "execution" | "job"
  toolName: string
  toolIcon: string
  category: string
  inputUrl: string | null
  outputUrl: string | null
  createdAt: string
  status: string
  creditsUsed: number | null
  processingTime: number | null
  toolId: string
  fileType: "image" | "video"
}

export default function MyDocumentsPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Get user data
      const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()
      if (!userData) return
      setUserData(userData)

      // Get tool executions with tool info
      const { data: toolExecutions } = await supabase
        .from("tool_executions")
        .select(`
          *,
          ai_tools (
            name,
            icon_name,
            category
          )
        `)
        .eq("user_id", userData.id)
        .not("output_file_url", "is", null)
        .order("created_at", { ascending: false })

      // Get image processing jobs with tool info
      const { data: imageJobs } = await supabase
        .from("image_processing_jobs")
        .select(`
          *,
          ai_tools!image_processing_jobs_tool_id_fkey (
            name,
            icon_name,
            category
          )
        `)
        .eq("user_id", userData.id)
        .not("output_image_url", "is", null)
        .order("created_at", { ascending: false })

      const documents: DocumentItem[] = [
        ...(toolExecutions || []).map((execution) => ({
          id: execution.id,
          type: "execution" as const,
          toolName: execution.ai_tools?.name || "Unknown Tool",
          toolIcon: execution.ai_tools?.icon_name || "image",
          category: execution.ai_tools?.category || "other",
          inputUrl: execution.input_file_url,
          outputUrl: execution.output_file_url,
          createdAt: execution.created_at,
          status: execution.status,
          creditsUsed: execution.credits_used,
          processingTime: execution.processing_time_seconds,
          toolId: execution.tool_id,
          fileType:
            execution.output_file_url?.includes(".mp4") || execution.output_file_url?.includes(".webm")
              ? ("video" as const)
              : ("image" as const),
        })),
        ...(imageJobs || []).map((job) => ({
          id: job.id,
          type: "job" as const,
          toolName: job.ai_tools?.name || job.tool_name || "Unknown Tool",
          toolIcon: job.ai_tools?.icon_name || "image",
          category: job.ai_tools?.category || "other",
          inputUrl: job.input_image_url,
          outputUrl: job.output_image_url,
          createdAt: job.created_at,
          status: job.status,
          creditsUsed: job.credits_used,
          processingTime: job.processing_time_seconds,
          toolId: job.tool_id,
          fileType: "image" as const,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setAllDocuments(documents)
      setFilteredDocuments(documents)
      setLoading(false)
    }

    fetchData()
  }, [])

  const applyFilter = (filterType: string) => {
    setActiveFilter(filterType)

    switch (filterType) {
      case "all":
        setFilteredDocuments(allDocuments)
        break
      case "images":
        setFilteredDocuments(allDocuments.filter((doc) => doc.fileType === "image"))
        break
      case "videos":
        setFilteredDocuments(allDocuments.filter((doc) => doc.fileType === "video"))
        break
      case "recent":
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        setFilteredDocuments(allDocuments.filter((doc) => new Date(doc.createdAt) > oneWeekAgo))
        break
      case "editing":
        setFilteredDocuments(allDocuments.filter((doc) => doc.category === "editing"))
        break
      case "generation":
        setFilteredDocuments(allDocuments.filter((doc) => doc.category === "generation"))
        break
      case "enhancement":
        setFilteredDocuments(allDocuments.filter((doc) => doc.category === "enhancement"))
        break
      default:
        setFilteredDocuments(allDocuments)
    }
  }

  const toggleVideo = async (videoId: string) => {
    const videoElement = videoRefs.current[videoId]
    if (!videoElement) return

    try {
      if (playingVideo === videoId) {
        // Pause the video
        videoElement.pause()
        setPlayingVideo(null)
      } else {
        // Pause any other playing video first
        Object.entries(videoRefs.current).forEach(([id, video]) => {
          if (video && id !== videoId) {
            video.pause()
          }
        })

        // Play the selected video
        await videoElement.play()
        setPlayingVideo(videoId)
      }
    } catch (error) {
      console.error("Error controlling video playback:", error)
      // Reset state if playback fails
      setPlayingVideo(null)
    }
  }

  const handleVideoEnded = (videoId: string) => {
    setPlayingVideo(null)
  }

  const handleVideoError = (videoId: string, error: any) => {
    console.error(`Video ${videoId} failed to load:`, error)
    setPlayingVideo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader currentPage="my-documents" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading your documents...</div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalDocuments = allDocuments.length
  const totalCreditsUsed = allDocuments.reduce((sum, doc) => sum + (doc.creditsUsed || 0), 0)
  const successfulDocuments = allDocuments.filter(
    (doc) => doc.status === "completed" || doc.status === "success",
  ).length
  const thisMonthDocuments = allDocuments.filter((doc) => {
    const docDate = new Date(doc.createdAt)
    const now = new Date()
    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader currentPage="my-documents" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-muted-foreground">View and manage all your generated content and media files</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{totalDocuments}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{totalCreditsUsed}</p>
                  <p className="text-sm text-muted-foreground">Credits Used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{successfulDocuments}</p>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{thisMonthDocuments}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("all")}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              All Documents
            </Button>
            <Button
              variant={activeFilter === "images" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("images")}
            >
              Images
            </Button>
            <Button
              variant={activeFilter === "videos" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("videos")}
            >
              Videos
            </Button>
            <Button
              variant={activeFilter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("recent")}
            >
              Recent (7 days)
            </Button>
            <Button
              variant={activeFilter === "editing" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("editing")}
            >
              Editing Tools
            </Button>
            <Button
              variant={activeFilter === "generation" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("generation")}
            >
              Generation Tools
            </Button>
            <Button
              variant={activeFilter === "enhancement" ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilter("enhancement")}
            >
              Enhancement Tools
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={`${document.type}-${document.id}`} className="overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                {document.outputUrl ? (
                  document.fileType === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={(el) => {
                          videoRefs.current[document.id] = el
                        }}
                        src={document.outputUrl}
                        className="w-full h-full object-cover"
                        muted={false}
                        loop={false}
                        preload="metadata"
                        playsInline
                        onEnded={() => handleVideoEnded(document.id)}
                        onError={(e) => handleVideoError(document.id, e)}
                        onLoadStart={() => console.log(`[v0] Video ${document.id} started loading`)}
                        onCanPlay={() => console.log(`[v0] Video ${document.id} can play`)}
                        crossOrigin="anonymous"
                      />
                      <button
                        onClick={() => toggleVideo(document.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-200 group"
                        aria-label={playingVideo === document.id ? "Pause video" : "Play video"}
                      >
                        <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all">
                          {playingVideo === document.id ? (
                            <Pause className="w-8 h-8 text-gray-800" />
                          ) : (
                            <Play className="w-8 h-8 text-gray-800 ml-1" />
                          )}
                        </div>
                      </button>
                      {playingVideo === document.id && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">PLAYING</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={document.outputUrl || "/placeholder.svg"}
                      alt={`Generated with ${document.toolName}`}
                      fill
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      document.status === "completed" || document.status === "success" ? "default" : "destructive"
                    }
                  >
                    {document.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{document.creditsUsed} credits</span>
                </div>
                <h3 className="font-semibold mb-1">{document.toolName}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {new Date(document.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  {document.outputUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={document.outputUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/tools/${document.toolId}`}>Use Again</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilter === "all"
                ? "You haven't generated any content yet."
                : `No documents found for the selected filter: ${activeFilter}`}
            </p>
            <Button asChild>
              <Link href="/tools">Start Creating</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
