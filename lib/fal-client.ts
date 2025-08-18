import * as fal from "@fal-ai/serverless-client"

// Configure fal client
if (process.env.FAL_KEY && process.env.FAL_KEY !== "fal_placeholder_key_replace_with_real_key") {
  fal.config({
    credentials: process.env.FAL_KEY,
  })
} else {
  console.warn("[v0] FAL_KEY not properly configured - fal.ai features will not work")
}

export interface FalImageResult {
  url: string
  width: number
  height: number
  content_type: string
}

export interface FalResponse {
  images: FalImageResult[]
  timings?: {
    inference: number
  }
  seed?: number
}

export async function generateImage(
  prompt: string,
  aspectRatio = "1:1",
  numImages = 1,
  seed?: number,
  outputFormat = "png",
) {
  try {
    const result = (await fal.subscribe("fal-ai/imagen4/preview", {
      input: {
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        num_images: numImages,
        ...(seed && { seed }),
        output_format: outputFormat,
      },
    })) as FalResponse

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error generating image with Imagen4:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
    }
  }
}

// Background removal
export async function removeBackground(imageUrl: string) {
  try {
    console.log("Background removal input:", { imageUrl })

    const result = (await fal.subscribe("fal-ai/birefnet", {
      input: {
        image_url: imageUrl,
      },
    })) as any

    console.log("Background removal result:", result)

    // BiRefNet returns the image directly in the 'image' field, not in an 'images' array
    const outputImageUrl = result.image?.url || result.image

    if (!outputImageUrl) {
      console.error("No image URL found in result:", result)
      throw new Error("No processed image returned from the API")
    }

    return {
      success: true,
      data: result,
      imageUrl: outputImageUrl,
    }
  } catch (error) {
    console.error("Error removing background:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove background",
    }
  }
}

// Image upscaling
export async function upscaleImage(imageUrl: string) {
  try {
    const result = (await fal.subscribe("fal-ai/clarity-upscaler", {
      input: {
        image_url: imageUrl,
      },
    })) as FalResponse

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error upscaling image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upscale image",
    }
  }
}

// Face enhancement
export async function enhanceFace(imageUrl: string) {
  try {
    console.log("Face enhancement input:", { imageUrl })

    const result = (await fal.subscribe("fal-ai/image-editing/face-enhancement", {
      input: {
        image_url: imageUrl,
      },
    })) as FalResponse

    console.log("Face enhancement result:", result)

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error enhancing face:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enhance face",
    }
  }
}

// Style transfer
export async function transferStyle(imageUrl: string, stylePrompt?: string, additionalSettings?: any) {
  try {
    console.log("[v0] Plushie style transfer input:", { imageUrl, stylePrompt, additionalSettings })

    if (!imageUrl) {
      throw new Error("Image URL is required for style transfer")
    }

    if (
      !process.env.FAL_KEY ||
      process.env.FAL_KEY === "fal_placeholder_key_replace_with_real_key" ||
      process.env.FAL_KEY === ""
    ) {
      throw new Error(
        "FAL_KEY environment variable is not configured. Please add your real fal.ai API key from https://fal.ai/dashboard/keys",
      )
    }

    console.log("[v0] Making API call to fal-ai/image-editing/plushie-style")

    let result: any
    try {
      result = await fal.subscribe("fal-ai/image-editing/plushie-style", {
        input: {
          image_url: imageUrl,
          // Additional settings can be passed here
          ...additionalSettings,
        },
      })
    } catch (falError: any) {
      console.error("[v0] FAL API Error Details:", {
        error: falError,
        message: falError?.message,
        response: falError?.response?.data,
        body: falError?.body,
        status: falError?.status || falError?.response?.status,
      })

      let errorMessage = "Failed to transfer to plushie style"

      if (falError?.response?.data?.detail) {
        errorMessage = Array.isArray(falError.response.data.detail)
          ? falError.response.data.detail.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join("; ")
          : falError.response.data.detail
      } else if (falError?.response?.data?.message) {
        errorMessage = falError.response.data.message
      } else if (falError?.body?.detail) {
        errorMessage = Array.isArray(falError.body.detail)
          ? falError.body.detail.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join("; ")
          : falError.body.detail
      } else if (falError?.message) {
        errorMessage = falError.message
      } else if (falError?.status === 404) {
        errorMessage = "Plushie style transfer endpoint not found - the API endpoint may have changed"
      } else if (falError?.status === 401 || falError?.status === 403) {
        errorMessage = "Authentication failed - please check your FAL_KEY configuration"
      }

      throw new Error(errorMessage)
    }

    console.log("[v0] Plushie style transfer result:", result)

    if (!result) {
      throw new Error("No response received from plushie style transfer API")
    }

    if (!result.images || !Array.isArray(result.images) || result.images.length === 0) {
      console.error("[v0] Invalid API response structure:", result)
      throw new Error("Invalid API response - no images found in result")
    }

    if (!result.images[0]?.url) {
      console.error("[v0] No image URL in response:", result.images[0])
      throw new Error("No processed image URL returned from the API")
    }

    return {
      success: true,
      data: result,
      imageUrl: result.images[0].url,
    }
  } catch (error) {
    console.error("[v0] Error transferring to plushie style:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to transfer to plushie style",
    }
  }
}

// Age progression
export async function ageProgression(imageUrl: string, ageChange: string) {
  try {
    const result = (await fal.subscribe("fal-ai/image-editing/age-progression", {
      input: {
        image_url: imageUrl,
        age_change: ageChange, // e.g., "20 years older" or "15 years younger"
      },
    })) as FalResponse

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error processing age progression:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process age progression",
    }
  }
}

// Virtual Try-On
export async function virtualTryOn(personImageUrl: string, garmentImageUrl: string, garmentType?: string) {
  try {
    console.log("Virtual Try-On Input:", {
      model_image: personImageUrl,
      garment_image: garmentImageUrl,
      category: garmentType,
    })

    // Validate inputs
    if (!personImageUrl || !garmentImageUrl) {
      throw new Error("Both person image and garment image URLs are required")
    }

    // Ensure category is valid
    const validCategories = ["tops", "bottoms", "one-pieces"]
    const category =
      garmentType && validCategories.includes(garmentType.toLowerCase()) ? garmentType.toLowerCase() : "tops"

    const result = (await fal.subscribe("fal-ai/fashn/tryon/v1.5", {
      input: {
        model_image: personImageUrl, // Person wearing clothes
        garment_image: garmentImageUrl, // Garment to try on
        category: category, // Garment category: tops, bottoms, one-pieces
        guidance_scale: 2.0, // Default value from API docs
        timesteps: 50, // Default value from API docs
        nsfw_filter: true,
        num_samples: 1,
      },
    })) as FalResponse

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error processing virtual try-on:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      personImageUrl,
      garmentImageUrl,
      garmentType,
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process virtual try-on",
    }
  }
}

// Character Generation (Face Swap)
export async function generateCharacter(prompt: string, referenceImageUrls: string[], quality = "TURBO") {
  try {
    console.log("Character generation input:", { prompt, referenceImageUrls, quality })

    if (!prompt || !referenceImageUrls || referenceImageUrls.length === 0) {
      throw new Error("Prompt and at least one reference image are required")
    }

    const result = (await fal.subscribe("fal-ai/ideogram/character", {
      input: {
        prompt: prompt.trim(),
        reference_image_urls: referenceImageUrls,
        quality: quality, // TURBO, BALANCED, or QUALITY
        num_images: 1,
      },
    })) as FalResponse

    return {
      success: true,
      data: result,
      imageUrl: result.images?.[0]?.url,
    }
  } catch (error) {
    console.error("Error generating character:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate character",
    }
  }
}

// Image-to-video generation
export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string,
  duration = "5",
  aspectRatio = "16:9",
  negativePrompt?: string,
  cfgScale = 0.5,
) {
  try {
    console.log("Image-to-video generation input:", {
      imageUrl,
      prompt,
      duration,
      aspectRatio,
      negativePrompt,
      cfgScale,
    })

    if (!imageUrl || !prompt) {
      throw new Error("Both image URL and prompt are required")
    }

    const result = (await fal.subscribe("fal-ai/kling-video/v1.6/pro/image-to-video", {
      input: {
        image_url: imageUrl,
        prompt: prompt.trim(),
        duration: duration, // "5" or "10" seconds
        aspect_ratio: aspectRatio, // "16:9", "9:16", "1:1"
        ...(negativePrompt && { negative_prompt: negativePrompt }),
        cfg_scale: cfgScale, // 0.1 to 1.0
      },
    })) as any

    console.log("Image-to-video generation result:", result)

    return {
      success: true,
      data: result,
      videoUrl: result.video?.url,
    }
  } catch (error) {
    console.error("Error generating video from image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate video from image",
    }
  }
}

// Hailuo-02 image-to-video generation
export async function generateVideoFromImageHailuo(
  imageUrl: string,
  prompt: string,
  duration = "6",
  resolution = "768P",
  promptOptimizer = true,
) {
  console.log("=== Hailuo-02 Function Called ===")
  console.log("Input parameters:", { imageUrl, prompt, duration, resolution, promptOptimizer })

  try {
    // Validate required parameters
    if (!imageUrl) {
      throw new Error("Image URL is required for Hailuo-02 video generation")
    }
    if (!prompt) {
      throw new Error("Prompt is required for Hailuo-02 video generation")
    }
    if (!process.env.FAL_KEY) {
      throw new Error("FAL_KEY environment variable is not configured")
    }

    const validDurations = ["6", "10"]
    const validatedDuration = validDurations.includes(String(duration)) ? String(duration) : "6"

    const input = {
      image_url: imageUrl,
      prompt: prompt.trim(),
      duration: validatedDuration, // Must be string "6" or "10"
      resolution: resolution === "1080P" ? "1080P" : "768P",
      prompt_optimizer: Boolean(promptOptimizer),
    }

    console.log("Making API call to fal-ai/minimax/hailuo-02/standard/image-to-video")
    console.log("API input:", JSON.stringify(input, null, 2))

    let result: any
    try {
      result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/image-to-video", {
        input,
      })
    } catch (falError: any) {
      console.error("=== FAL Subscribe Error ===")
      console.error("FAL error object:", falError)

      let errorDetails = "ValidationError"

      // Try multiple ways to extract the actual error details
      if (falError?.response?.data) {
        console.error("Response data:", JSON.stringify(falError.response.data, null, 2))
        if (falError.response.data.detail) {
          errorDetails = Array.isArray(falError.response.data.detail)
            ? falError.response.data.detail.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join("; ")
            : falError.response.data.detail
        } else if (falError.response.data.message) {
          errorDetails = falError.response.data.message
        }
      } else if (falError?.body) {
        console.error("Error body:", JSON.stringify(falError.body, null, 2))
        if (falError.body.detail) {
          errorDetails = Array.isArray(falError.body.detail)
            ? falError.body.detail.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join("; ")
            : falError.body.detail
        }
      } else if (falError?.detail) {
        errorDetails = Array.isArray(falError.detail)
          ? falError.detail.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join("; ")
          : falError.detail
      } else if (falError?.message) {
        errorDetails = falError.message
      }

      if (errorDetails === "ValidationError" && falError) {
        try {
          errorDetails = JSON.stringify(falError, null, 2)
        } catch {
          errorDetails = String(falError)
        }
      }

      throw new Error(`Hailuo-02 API validation failed: ${errorDetails}`)
    }

    console.log("API response received:", JSON.stringify(result, null, 2))

    if (!result) {
      throw new Error("No response received from Hailuo-02 API")
    }

    if (!result.video?.url) {
      throw new Error(`Invalid API response - no video URL found. Response: ${JSON.stringify(result)}`)
    }

    console.log("=== Hailuo-02 Success ===")
    return {
      success: true,
      data: result,
      videoUrl: result.video.url,
    }
  } catch (error) {
    console.error("=== Hailuo-02 Error Caught ===")
    console.error("Raw error:", error)

    let errorMessage = "Unknown error occurred in Hailuo-02 video generation"

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    } else {
      try {
        errorMessage = JSON.stringify(error)
      } catch {
        errorMessage = String(error)
      }
    }

    console.error("Final error message:", errorMessage)
    console.error("=== End Hailuo-02 Error ===")

    return {
      success: false,
      error: errorMessage,
    }
  }
}
