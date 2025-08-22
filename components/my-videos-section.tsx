"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Play, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface WorkflowExecution {
  id: string
  workflow_name: string
  status: "pending" | "processing" | "completed" | "failed"
  input_data: any
  video_url?: string
  credits_used: number
  execution_time_seconds?: number
  created_at: string
  completed_at?: string
  error_message?: string
}

export default function MyVideosSection() {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExecutions = async () => {
    try {
      const response = await fetch("/api/n8n/my-videos")
      if (response.ok) {
        const data = await response.json()
        setExecutions(data.executions)
      }
    } catch (error) {
      console.error("Error fetching executions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExecutions()

    const interval = setInterval(() => {
      const hasPending = executions.some((exec) => exec.status === "pending" || exec.status === "processing")
      if (hasPending) {
        fetchExecutions()
      }
    }, 10000) // Poll every 10 seconds instead of 30

    return () => clearInterval(interval)
  }, [executions])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">My Videos</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading your videos...</span>
        </div>
      </div>
    )
  }

  if (executions.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">My Videos</h3>
        <Card>
          <CardContent className="py-8 text-center">
            <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No videos generated yet</p>
            <p className="text-sm text-gray-500 mt-1">Start a workflow above to create your first AI video</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">My Videos</h3>
      <div className="grid gap-4">
        {executions.map((execution) => (
          <Card key={execution.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(execution.status)}
                    <h4 className="font-medium">{execution.workflow_name}</h4>
                    <Badge className={getStatusColor(execution.status)}>{execution.status}</Badge>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Credits used: {execution.credits_used}</p>
                    <p>Created: {new Date(execution.created_at).toLocaleString()}</p>
                    {execution.execution_time_seconds && (
                      <p>Duration: {formatDuration(execution.execution_time_seconds)}</p>
                    )}
                    {execution.error_message && <p className="text-red-600">Error: {execution.error_message}</p>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {execution.status === "completed" && execution.video_url && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => window.open(execution.video_url, "_blank")}>
                        <Play className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (execution.video_url!.includes("fal.media") || execution.video_url!.startsWith("http")) {
                            // For external URLs, open in new tab for download
                            window.open(execution.video_url, "_blank")
                          } else {
                            // For blob URLs, use download attribute
                            const link = document.createElement("a")
                            link.href = execution.video_url!
                            link.download = `${execution.workflow_name}-${execution.id}.mp4`
                            link.click()
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  )}

                  {(execution.status === "pending" || execution.status === "processing") && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      {execution.status === "pending" ? "Queued" : "Processing..."}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
