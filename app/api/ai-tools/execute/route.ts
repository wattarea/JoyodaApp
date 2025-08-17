import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  generateImage,
  removeBackground,
  upscaleImage,
  enhanceFace,
  transferStyle,
  ageProgression,
  virtualTryOn,
  generateCharacter,
  generateVideoFromImage,
  generateVideoFromImageHailuo, // Added Hailuo-02 import
} from "@/lib/fal-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { toolId, parameters } = await request.json()

    if (!toolId || !parameters) {
      return NextResponse.json({ error: "Tool ID and parameters are required" }, { status: 400 })
    }

    const { data: tool, error: toolError } = await supabase
      .from("ai_tools")
      .select("*")
      .eq("tool_id", toolId)
      .eq("is_active", true)
      .single()

    if (toolError || !tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const calculateCredits = () => {
      if (tool.category === "text-to-video") {
        return parameters.duration === "5" ? 8 : 15 // 8 credits for 5s, 15 credits for 10s
      }
      return tool.credits_per_use
    }

    const creditsToUse = calculateCredits()

    // Check user credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, credits")
      .eq("email", user.email)
      .single()

    if (userError || !userData || userData.credits < creditsToUse) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    let result
    const startTime = Date.now()

    switch (tool.fal_model_id) {
      case "fal-ai/imagen4/preview":
        result = await generateImage(
          parameters.prompt,
          parameters.aspectRatio,
          parameters.numImages,
          parameters.seed,
          parameters.outputFormat,
        )
        break
      case "fal-ai/birefnet":
        result = await removeBackground(parameters.imageUrl)
        break
      case "fal-ai/clarity-upscaler":
        result = await upscaleImage(parameters.imageUrl)
        break
      case "fal-ai/image-editing/age-progression":
        result = await ageProgression(parameters.imageUrl, parameters.ageChange)
        break
      case "fal-ai/image-editing/face-enhancement":
        result = await enhanceFace(parameters.imageUrl)
        break
      case "fal-ai/image-editing/plushie-style":
        result = await transferStyle(parameters.imageUrl, parameters.stylePrompt, parameters.additionalSettings)
        break
      case "fal-ai/fashn/tryon/v1.5":
        result = await virtualTryOn(parameters.personImageUrl, parameters.garmentImageUrl, parameters.garmentType)
        break
      case "fal-ai/ideogram/character":
        result = await generateCharacter(parameters.prompt, parameters.referenceImageUrls, parameters.quality)
        break
      case "fal-ai/kling-video/v1.6/pro/image-to-video":
        result = await generateVideoFromImage(
          parameters.imageUrl,
          parameters.prompt,
          parameters.duration,
          parameters.aspectRatio,
          parameters.negativePrompt,
          parameters.cfgScale,
        )
        break
      case "fal-ai/minimax/hailuo-02/standard/image-to-video": // Added Hailuo-02 case
        result = await generateVideoFromImageHailuo(
          parameters.imageUrl,
          parameters.prompt,
          parameters.duration,
          parameters.resolution,
          parameters.promptOptimizer,
        )
        break
      default:
        return NextResponse.json({ error: "Unsupported tool model" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const endTime = Date.now()
    const processingTime = Math.round((endTime - startTime) / 1000)

    const outputUrl = result.imageUrl || result.videoUrl

    await supabase.from("tool_executions").insert({
      user_id: userData.id,
      tool_id: toolId,
      input_parameters: parameters,
      fal_response: result.data,
      output_file_url: outputUrl,
      credits_used: creditsToUse, // Use calculated credits instead of tool.credits_per_use
      processing_time_seconds: processingTime,
      status: "completed",
    })

    await supabase
      .from("users")
      .update({ credits: userData.credits - creditsToUse })
      .eq("email", user.email)

    await supabase.from("credit_transactions").insert({
      user_id: userData.id,
      transaction_type: "usage",
      amount: -creditsToUse,
      description: `Used ${tool.name}${tool.category === "text-to-video" ? ` (${parameters.duration}s)` : ""}`,
      tool_used: tool.name,
      status: "completed",
    })

    // Update tool usage count
    await supabase
      .from("ai_tools")
      .update({ usage_count: (tool.usage_count || 0) + 1 })
      .eq("tool_id", toolId)

    return NextResponse.json({
      success: true,
      result: {
        imageUrl: result.imageUrl,
        videoUrl: result.videoUrl,
        processingTime,
        creditsUsed: creditsToUse, // Return calculated credits
        remainingCredits: userData.credits - creditsToUse,
      },
    })
  } catch (error) {
    console.error("Error executing AI tool:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
