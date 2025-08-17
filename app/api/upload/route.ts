import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        },
        { status: 413 },
      )
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
        },
        { status: 400 },
      )
    }

    let blob
    try {
      console.log(`[v0] Uploading file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)

      const uploadPromise = new Promise(async (resolve, reject) => {
        try {
          const result = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
          })
          resolve(result)
        } catch (uploadError: any) {
          console.log(`[v0] Raw upload error:`, uploadError)

          // Handle JSON parsing errors specifically
          if (uploadError?.message?.includes("Unexpected token") && uploadError?.message?.includes("JSON")) {
            reject(
              new Error("BLOB_JSON_PARSE_ERROR: Server returned non-JSON response, likely due to file size limits"),
            )
          } else if (uploadError?.message?.includes("Request En")) {
            reject(new Error("BLOB_REQUEST_ERROR: Request entity too large or server error"))
          } else {
            reject(uploadError)
          }
        }
      })

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("UPLOAD_TIMEOUT: Upload timeout - please try again")), 30000)
      })

      blob = await Promise.race([uploadPromise, timeoutPromise])

      // Validate the blob response
      if (!blob || typeof blob !== "object") {
        throw new Error("Invalid response from Vercel Blob - no response object")
      }

      if (!blob.url || typeof blob.url !== "string") {
        throw new Error("Invalid response from Vercel Blob - missing or invalid URL")
      }

      console.log(`[v0] Upload successful: ${blob.url}`)
      return NextResponse.json({ url: blob.url })
    } catch (blobError: any) {
      console.error("[v0] Vercel Blob upload error details:", {
        error: blobError,
        message: blobError?.message,
        stack: blobError?.stack,
        name: blobError?.name,
        cause: blobError?.cause,
      })

      let errorMessage = "Upload failed"
      let statusCode = 500

      if (blobError?.message) {
        const message = blobError.message

        if (message.includes("BLOB_JSON_PARSE_ERROR")) {
          errorMessage =
            "File upload failed due to server response error. This usually means the file is too large or the service is temporarily unavailable. Please try a smaller file."
          statusCode = 413
        } else if (message.includes("BLOB_REQUEST_ERROR")) {
          errorMessage = "File upload failed due to size restrictions. Please use a file smaller than 10MB."
          statusCode = 413
        } else if (message.includes("UPLOAD_TIMEOUT")) {
          errorMessage = "Upload timed out. Please try again with a smaller file."
          statusCode = 408
        } else if (message.toLowerCase().includes("unexpected token") && message.toLowerCase().includes("json")) {
          errorMessage =
            "Server returned invalid response. The file might be too large or the service is temporarily unavailable."
          statusCode = 413
        } else if (message.toLowerCase().includes("request entity too large") || message.includes("413")) {
          errorMessage = "File is too large for upload. Please use a file smaller than 10MB."
          statusCode = 413
        } else if (
          message.toLowerCase().includes("request en") ||
          message.toLowerCase().includes("payload too large")
        ) {
          errorMessage = "File size exceeds server limits. Please use a smaller file."
          statusCode = 413
        } else if (message.toLowerCase().includes("timeout")) {
          errorMessage = "Upload timed out. Please try again with a smaller file."
          statusCode = 408
        } else if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch")) {
          errorMessage = "Network error during upload. Please check your connection and try again."
          statusCode = 503
        } else {
          errorMessage = `Upload failed: ${blobError.message}`
        }
      } else if (typeof blobError === "string") {
        if (blobError.toLowerCase().includes("request en")) {
          errorMessage = "File upload failed due to size limitations. Please use a smaller file."
          statusCode = 413
        } else {
          errorMessage = `Upload failed: ${blobError}`
        }
      } else {
        errorMessage = "Upload failed due to an unknown server error. Please try again."
      }

      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }
  } catch (error: any) {
    console.error("[v0] General upload error:", {
      error: error,
      message: error?.message,
      stack: error?.stack,
    })

    let errorMessage = "Failed to process upload request"
    let statusCode = 500

    if (error?.message) {
      const message = error.message

      if (message.includes("Unexpected token") && message.includes("JSON")) {
        errorMessage = "Server response error. Please try again or use a smaller file."
        statusCode = 502
      } else if (message.includes("formdata")) {
        errorMessage = "Invalid file data. Please select a valid image file."
        statusCode = 400
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
