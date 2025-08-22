import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] N8N webhook callback received")

    const body = await request.json()
    console.log("[v0] Webhook payload received with keys:", Object.keys(body))

    const supabase = await createClient()

    // Extract data from n8n webhook payload
    const { executionId, workflowId, status, data, error } = body

    if (!executionId) {
      console.error("[v0] Missing executionId in webhook payload")
      return NextResponse.json({ error: "Missing executionId" }, { status: 400 })
    }

    // Find the workflow execution record
    const { data: execution, error: fetchError } = await supabase
      .from("workflow_executions")
      .select("*")
      .eq("n8n_execution_id", executionId)
      .single()

    if (fetchError || !execution) {
      console.error("[v0] Workflow execution not found:", fetchError)
      return NextResponse.json({ error: "Execution not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      status: status === "success" ? "completed" : "failed",
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }

    if (status === "success" && data) {
      const base64Video = data.videoBase64 || data.base64 || data.video
      const videoUrl =
        data.videoUrl || data.downloadUrl || data.finalVideo || data.video_url || data.output || data.result || data.url

      if (base64Video) {
        try {
          // Convert base64 to buffer
          const videoBuffer = Buffer.from(base64Video, "base64")

          // Generate unique filename
          const timestamp = Date.now()
          const filename = `workflow-${execution.id}-${timestamp}.mp4`

          // Upload to Vercel Blob
          const blob = await put(filename, videoBuffer, {
            access: "public",
            contentType: "video/mp4",
          })

          updateData.video_url = blob.url
          console.log("[v0] Video uploaded to blob storage:", blob.url)
        } catch (blobError) {
          console.error("[v0] Error uploading video to blob:", blobError)
          // Fallback: store base64 in output_data
          updateData.output_data = { ...data, videoBase64: base64Video }
        }
      } else if (videoUrl) {
        console.log("[v0] Using direct video URL:", videoUrl)
        updateData.video_url = videoUrl
      }

      // Store additional output data
      updateData.output_data = data
    }

    if (status === "error" && error) {
      updateData.error_message = error.message || error.toString()
    }

    // Calculate execution time
    const startTime = new Date(execution.created_at).getTime()
    const endTime = new Date().getTime()
    updateData.execution_time_seconds = Math.floor((endTime - startTime) / 1000)

    // Update the workflow execution
    const { error: updateError } = await supabase.from("workflow_executions").update(updateData).eq("id", execution.id)

    if (updateError) {
      console.error("[v0] Error updating workflow execution:", updateError)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    console.log("[v0] Workflow execution updated successfully:", execution.id)

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      status: updateData.status,
    })
  } catch (error) {
    console.error("[v0] Webhook callback error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
