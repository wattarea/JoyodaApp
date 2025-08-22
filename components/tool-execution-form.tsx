"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, Loader2, AlertCircle, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ToolExecutionFormProps {
  tool: {
    id: number
    tool_id: string
    name: string
    category: string
    fal_model_id: string
    credits_per_use: number
    input_parameters: any
  }
  userCredits: number
}

export function ToolExecutionForm({ tool, userCredits }: ToolExecutionFormProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [videoResult, setVideoResult] = useState<string | null>(null) // Added video result state
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [garmentFile, setGarmentFile] = useState<File | null>(null)
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [quality, setQuality] = useState("TURBO")
  const [prompt, setPrompt] = useState("")
  const [stylePrompt, setStylePrompt] = useState("")
  const [ageChange, setAgeChange] = useState("10 years older")
  const [garmentType, setGarmentType] = useState("top")

  const [modelGender, setModelGender] = useState("male")
  const [bodySize, setBodySize] = useState("M")
  const [location, setLocation] = useState("studio")

  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [numImages, setNumImages] = useState(1)
  const [seed, setSeed] = useState("")
  const [outputFormat, setOutputFormat] = useState("png")

  const [videoDuration, setVideoDuration] = useState("5")
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [cfgScale, setCfgScale] = useState([0.5])

  const [plushieIntensity, setPlushieIntensity] = useState([0.8])
  const [colorMode, setColorMode] = useState("natural")
  const [detailPreservation, setDetailPreservation] = useState([0.7])
  const [backgroundHandling, setBackgroundHandling] = useState("preserve")

  const [renderingSpeed, setRenderingSpeed] = useState("BALANCED")
  const [characterStyle, setCharacterStyle] = useState("AUTO")
  const [faceFile, setFaceFile] = useState<File | null>(null)

  const [fashionStyle, setFashionStyle] = useState("professional")
  const [fashionBackground, setFashionBackground] = useState("studio")
  const [fashionLighting, setFashionLighting] = useState("natural")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setError(`File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
        return
      }
      setImageFile(file)
      setError(null)
    }
  }

  const handleGarmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setError(`File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
        return
      }
      setGarmentFile(file)
      setError(null)
    }
  }

  const handleFaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setError(`File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
        return
      }
      setFaceFile(file)
      setError(null)
      console.log("[v0] Face file uploaded:", file.name)
    }
  }

  const handleReferenceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes

    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File size must be less than 10MB. ${file.name} is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
        return
      }
    }

    if (files.length > 5) {
      setError("Maximum 5 reference images allowed.")
      return
    }

    setReferenceFiles(files)
    setError(null)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      let errorMessage = "Failed to upload image"
      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } else {
          const textError = await response.text()
          errorMessage = textError || `Upload failed with status ${response.status}`
        }
      } catch {
        errorMessage = `Upload failed with status ${response.status}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.url
  }

  const getVideoDurationCredits = () => {
    return tool.credits_per_use
  }

  const currentCredits = getVideoDurationCredits()

  const handleExecute = async () => {
    if (userCredits < currentCredits) {
      setError("Insufficient credits. Please purchase more credits to use this tool.")
      return
    }

    if ((tool.category === "text-to-image" || tool.tool_id === "text-to-image") && !prompt.trim()) {
      setError("Please enter a prompt for image generation.")
      return
    }

    if (tool.category === "text-to-video") {
      if (!prompt.trim()) {
        setError("Please enter a prompt describing the video you want to generate.")
        return
      }
    }

    if (tool.category === "image-to-video") {
      if (!imageFile) {
        setError("Please upload an image to convert to video.")
        return
      }
      if (!prompt.trim()) {
        setError("Please enter a prompt describing the desired motion.")
        return
      }
    }

    if (tool.category === "creative" && tool.tool_id === "character-generation") {
      if (!prompt.trim()) {
        setError("Please enter a character description.")
        return
      }
      if (referenceFiles.length === 0) {
        setError("Please upload at least one reference image.")
        return
      }
    }

    if (tool.category === "fashion" && (!imageFile || !garmentFile)) {
      setError("Please upload both a person image and a garment image for virtual try-on.")
      return
    }

    if (tool.tool_id === "fashion-photoshoot") {
      console.log("[v0] Fashion photoshoot validation - imageFile:", imageFile?.name, "faceFile:", faceFile?.name)
      if (!imageFile) {
        setError("Please upload a garment image for fashion photoshoot.")
        return
      }
      if (!faceFile) {
        setError("Please upload a face image for fashion photoshoot.")
        return
      }
    }

    if (tool.tool_id === "nextstep-image-editor") {
      if (!prompt.trim()) {
        setError("Please enter a character description.")
        return
      }
      if (referenceFiles.length === 0) {
        setError("Please upload at least one reference image.")
        return
      }
    }

    if (
      tool.category !== "text-to-image" &&
      tool.tool_id !== "text-to-image" && // Added tool_id check for text-to-image
      tool.category !== "text-to-video" &&
      tool.category !== "fashion" &&
      tool.category !== "creative" &&
      tool.category !== "character" && // Added character category exception
      tool.category !== "image-to-video" &&
      tool.tool_id !== "nextstep-image-editor" && // Added nextstep exception
      tool.tool_id !== "fashion-photoshoot" && // Added fashion photoshoot exception
      !imageFile
    ) {
      setError("Please upload an image to process.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setVideoResult(null)

    try {
      let parameters: any = {}

      if (tool.tool_id === "ideogram-v2-generator") {
        parameters = {
          prompt: prompt.trim(),
          aspectRatio,
          style: characterStyle, // Reuse characterStyle for Ideogram V2 style
          expandPrompt: true,
          negativePrompt: negativePrompt.trim(),
          ...(seed && { seed: Number.parseInt(seed) }),
          numImages: 1,
        }
      } else if (tool.category === "text-to-image" || tool.tool_id === "text-to-image") {
        parameters = {
          prompt: prompt.trim(),
          aspectRatio,
          numImages,
          outputFormat,
          ...(seed && { seed: Number.parseInt(seed) }),
        }
      } else if (tool.category === "text-to-video") {
        parameters = {
          prompt: prompt.trim(),
          duration: videoDuration,
          aspectRatio: videoAspectRatio,
          ...(negativePrompt.trim() && { negativePrompt: negativePrompt.trim() }),
          cfgScale: cfgScale[0],
        }

        // Add image URL if an image was uploaded
        if (imageFile) {
          const imageUrl = await uploadImage(imageFile)
          parameters.imageUrl = imageUrl
        }
      } else if (tool.category === "image-to-video") {
        const imageUrl = await uploadImage(imageFile!)
        parameters = {
          imageUrl,
          prompt: prompt.trim(),
          duration: videoDuration,
          aspectRatio: videoAspectRatio,
          ...(negativePrompt.trim() && { negativePrompt: negativePrompt.trim() }),
          cfgScale: cfgScale[0],
        }
      } else if (tool.category === "fashion") {
        const personImageUrl = await uploadImage(imageFile!)
        const garmentImageUrl = await uploadImage(garmentFile!)
        parameters = {
          personImageUrl,
          garmentImageUrl,
          garmentType,
          fashionStyle,
          fashionBackground,
          fashionLighting,
        }
      } else if (tool.tool_id === "fashion-photoshoot") {
        const garmentImageUrl = await uploadImage(imageFile!)
        const faceImageUrl = await uploadImage(faceFile!)
        parameters = {
          garment_image: garmentImageUrl,
          face_image: faceImageUrl,
          gender: modelGender,
          body_size: bodySize,
          location,
        }
      } else if (tool.category === "creative" && tool.tool_id === "character-generation") {
        const referenceImageUrls = await Promise.all(referenceFiles.map((file) => uploadImage(file)))
        parameters = {
          prompt: prompt.trim(),
          referenceImageUrls,
          quality,
        }
      } else if (tool.tool_id === "nextstep-image-editor" || tool.category === "character") {
        const referenceImageUrls = await Promise.all(referenceFiles.map((file) => uploadImage(file)))
        parameters = {
          prompt: prompt.trim(),
          referenceImageUrls,
          renderingSpeed,
          style: characterStyle,
          numImages: 1,
        }
      } else {
        const imageUrl = await uploadImage(imageFile!)
        parameters = { imageUrl }

        if (tool.tool_id === "age-progression") {
          parameters.ageChange = ageChange
        } else if (tool.category === "artistic") {
          parameters.additionalSettings = {
            plushie_intensity: plushieIntensity[0],
            color_mode: colorMode,
            detail_preservation: detailPreservation[0],
            background_handling: backgroundHandling,
          }
          if (stylePrompt.trim()) {
            parameters.stylePrompt = stylePrompt.trim()
          }
        } else if (stylePrompt.trim()) {
          parameters.stylePrompt = stylePrompt.trim()
        }
      }

      const response = await fetch("/api/ai-tools/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: tool.tool_id,
          parameters,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute tool")
      }

      if (data.result.videoUrl) {
        setVideoResult(data.result.videoUrl)
      } else {
        setResult(data.result.imageUrl)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isTextToImage = tool.category === "text-to-image" || tool.tool_id === "text-to-image" // Added tool_id check for text-to-image detection
  const isTextToVideo = tool.category === "text-to-video" // Added text-to-video check
  const isImageToVideo = tool.category === "image-to-video"
  const isVirtualTryOn = tool.category === "fashion"
  const isCharacterGeneration = tool.category === "creative" && tool.tool_id === "character-generation"
  const isStyleTransfer = tool.category === "artistic"
  const isAgeProgression = tool.tool_id === "age-progression" // Declared isAgeProgression variable
  const isNextstepEditor = tool.tool_id === "nextstep-image-editor" || tool.category === "character" // Updated nextstep tool detection to include character category
  const isFashionPhotoshoot = tool.tool_id === "fashion-photoshoot" // Declared isFashionPhotoshoot variable
  const isIdeogramV2 = tool.tool_id === "ideogram-v2-generator"

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {isTextToVideo || isImageToVideo ? (
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            ) : (
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
            )}
            <CardTitle className="text-xl font-semibold text-gray-800">
              {isTextToImage
                ? "Generate Image with Imagen4"
                : isTextToVideo
                  ? "Generate Video from Text"
                  : isImageToVideo
                    ? "Generate Video from Image"
                    : isVirtualTryOn
                      ? "Upload Images"
                      : isCharacterGeneration
                        ? "Character Generation"
                        : isNextstepEditor
                          ? "Character Generator" // Updated title for ideogram character model
                          : isFashionPhotoshoot
                            ? "Fashion Photoshoot"
                            : isIdeogramV2
                              ? "Ideogram V2 Generator"
                              : "Upload Your Image"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIdeogramV2 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image, poster, or logo you want to generate with Ideogram V2..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ideogram V2 excels at typography and text generation. Be specific about text content and style.
                </p>
              </div>

              <div>
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    <SelectItem value="10:16">Tall Portrait (10:16)</SelectItem>
                    <SelectItem value="16:10">Wide Landscape (16:10)</SelectItem>
                    <SelectItem value="1:3">Very Tall (1:3)</SelectItem>
                    <SelectItem value="3:1">Very Wide (3:1)</SelectItem>
                    <SelectItem value="3:2">Classic (3:2)</SelectItem>
                    <SelectItem value="2:3">Classic Portrait (2:3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={characterStyle} onValueChange={setCharacterStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Recommended)</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="render_3D">3D Render</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Describe what you don't want in the image..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Specify elements to avoid in the generated image</p>
              </div>

              <div>
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="Enter seed for reproducible results"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the same seed with the same prompt to get consistent results
                </p>
              </div>
            </div>
          ) : isNextstepEditor ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reference-images">Reference Images (1-5 images)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="reference-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReferenceFilesChange}
                    className="hidden"
                  />
                  <label htmlFor="reference-images" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {referenceFiles.length > 0
                        ? `${referenceFiles.length} reference image(s) selected`
                        : "Upload reference images for character consistency"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each (max 5 images)</p>
                  </label>
                </div>
                {referenceFiles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {referenceFiles.map((file, index) => (
                      <div key={index}>• {file.name}</div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="character-prompt">Character Description</Label>
                <Textarea
                  id="character-prompt"
                  placeholder="Describe the character you want to generate (e.g., 'A confident business woman in a modern office setting', 'A medieval knight in shining armor')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about the character's appearance, clothing, and setting
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rendering-speed">Rendering Speed</Label>
                  <Select value={renderingSpeed} onValueChange={setRenderingSpeed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rendering speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TURBO">Turbo (Fastest)</SelectItem>
                      <SelectItem value="BALANCED">Balanced (Recommended)</SelectItem>
                      <SelectItem value="QUALITY">Quality (Best Results)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="character-style">Style</Label>
                  <Select value={characterStyle} onValueChange={setCharacterStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTO">Auto (Recommended)</SelectItem>
                      <SelectItem value="REALISTIC">Realistic</SelectItem>
                      <SelectItem value="FICTION">Fiction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : isTextToVideo ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="source-image" className="text-sm font-medium text-gray-700">
                  Source Image (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="source-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="source-image" className="cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : "Upload an image to enhance video generation (optional)"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Adding an image can help guide the video generation and improve results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-prompt" className="text-sm font-medium text-gray-700">
                  Video Prompt
                </Label>
                <Textarea
                  id="video-prompt"
                  placeholder="Describe the video you want to generate (e.g., 'A serene sunset over mountains with gentle clouds moving', 'A bustling city street with cars and people walking')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
                <p className="text-xs text-gray-500">
                  Be descriptive about the scene, movement, and atmosphere you want in your video
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-duration" className="text-sm font-medium text-gray-700">
                    Video Duration
                  </Label>
                  <Select value={videoDuration} onValueChange={setVideoDuration}>
                    <SelectTrigger className="border-gray-200 focus:border-purple-400">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {tool.credits_per_use} credits for {videoDuration} seconds
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-aspect-ratio" className="text-sm font-medium text-gray-700">
                    Aspect Ratio
                  </Label>
                  <Select value={videoAspectRatio} onValueChange={setVideoAspectRatio}>
                    <SelectTrigger className="border-gray-200 focus:border-purple-400">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="negative-prompt" className="text-sm font-medium text-gray-700">
                  Negative Prompt (Optional)
                </Label>
                <Input
                  id="negative-prompt"
                  placeholder="What to avoid (e.g., 'blur, distortion, low quality, static')"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="cfg-scale" className="text-sm font-medium text-gray-700">
                  Prompt Adherence
                </Label>
                <div className="px-3">
                  <Slider
                    id="cfg-scale"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={cfgScale}
                    onValueChange={setCfgScale}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Creative</span>
                    <span className="font-medium">{cfgScale[0]}</span>
                    <span>Strict</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lower values allow more creative interpretation, higher values follow the prompt more strictly
                </p>
              </div>
            </div>
          ) : isTextToImage ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate with Google's Imagen4..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific and detailed for best results with Imagen4's advanced AI
                </p>
              </div>

              <div>
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    <SelectItem value="21:9">Ultra Wide (21:9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="num-images">Number of Images</Label>
                <Select value={numImages.toString()} onValueChange={(value) => setNumImages(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of images" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Image</SelectItem>
                    <SelectItem value="2">2 Images</SelectItem>
                    <SelectItem value="3">3 Images</SelectItem>
                    <SelectItem value="4">4 Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="output-format">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (High Quality)</SelectItem>
                    <SelectItem value="jpeg">JPEG (Smaller Size)</SelectItem>
                    <SelectItem value="webp">WebP (Modern Format)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="Enter seed for reproducible results"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the same seed with the same prompt to get consistent results
                </p>
              </div>
            </div>
          ) : isImageToVideo ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Source Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{imageFile ? imageFile.name : "Upload an image to animate"}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="video-prompt">Motion Prompt</Label>
                <Textarea
                  id="video-prompt"
                  placeholder="Describe the motion you want to see (e.g., 'Snowflakes fall as a car moves along the road', 'Gentle waves in the ocean', 'Leaves rustling in the wind')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about the motion and movement you want to see in the video
                </p>
              </div>

              <div>
                <Label htmlFor="video-duration">Video Duration</Label>
                <Select value={videoDuration} onValueChange={setVideoDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-aspect-ratio">Aspect Ratio</Label>
                <Select value={videoAspectRatio} onValueChange={setVideoAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="4:3">Standard (4:3)</SelectItem>
                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                <Input
                  id="negative-prompt"
                  placeholder="What to avoid (e.g., 'blur, distort, low quality')"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cfg-scale">Prompt Adherence</Label>
                <div className="px-3">
                  <Slider
                    id="cfg-scale"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={cfgScale}
                    onValueChange={setCfgScale}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Creative</span>
                    <span>{cfgScale[0]}</span>
                    <span>Strict</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lower values allow more creative interpretation, higher values follow the prompt more strictly
                </p>
              </div>
            </div>
          ) : isCharacterGeneration ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="character-prompt">Character Description</Label>
                <Textarea
                  id="character-prompt"
                  placeholder="Describe the character you want to generate (e.g., 'A confident business woman in a modern office setting')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="reference-images">Reference Images (1-5 images)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="reference-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReferenceFilesChange}
                    className="hidden"
                  />
                  <label htmlFor="reference-images" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {referenceFiles.length > 0
                        ? `${referenceFiles.length} reference image(s) selected`
                        : "Upload reference images for character consistency"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each (max 5 images)</p>
                  </label>
                </div>
                {referenceFiles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {referenceFiles.map((file, index) => (
                      <div key={index}>• {file.name}</div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="quality">Quality Level</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TURBO">Turbo (Fastest, Lower Cost)</SelectItem>
                    <SelectItem value="BALANCED">Balanced (Good Quality & Speed)</SelectItem>
                    <SelectItem value="QUALITY">Quality (Best Results, Higher Cost)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : isVirtualTryOn ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="person-image">Person Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="person-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="person-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{imageFile ? imageFile.name : "Upload a photo of yourself"}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="garment-image">Garment Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="garment-image"
                    type="file"
                    accept="image/*"
                    onChange={handleGarmentFileChange}
                    className="hidden"
                  />
                  <label htmlFor="garment-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {garmentFile ? garmentFile.name : "Upload the clothing item to try on"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="garment-type">Garment Type</Label>
                <Select value={garmentType} onValueChange={setGarmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select garment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top (T-shirt, Blouse, Shirt)</SelectItem>
                    <SelectItem value="bottom">Bottom (Pants, Skirt, Shorts)</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="outerwear">Outerwear (Jacket, Coat)</SelectItem>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : isFashionPhotoshoot ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="garment-image">Garment Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="garment-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="garment-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : "Upload garment/clothing image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 4MB</p>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="face-image">Face Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="face-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFaceFileChange}
                    className="hidden"
                  />
                  <label htmlFor="face-image" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{faceFile ? faceFile.name : "Upload face/person image"}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 4MB</p>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="model-gender">Model Gender</Label>
                  <Select value={modelGender} onValueChange={setModelGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="body-size">Body Size</Label>
                  <Select value={bodySize} onValueChange={setBodySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="park">Park</SelectItem>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="street">Street</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="image">Select Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : "Click to select an image or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleExecute}
            disabled={loading || userCredits < currentCredits}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isTextToVideo || isImageToVideo ? "Generating Video..." : "Processing with AI..."}
              </>
            ) : (
              `${
                isTextToImage
                  ? "Generate with Imagen4"
                  : isTextToVideo
                    ? "Generate Video"
                    : isImageToVideo
                      ? "Generate Video"
                      : isVirtualTryOn
                        ? "Try On"
                        : isCharacterGeneration
                          ? "Generate Character"
                          : isNextstepEditor
                            ? "Generate Character" // Updated button text for ideogram character model
                            : isFashionPhotoshoot
                              ? "Generate Photoshoot"
                              : isIdeogramV2
                                ? "Generate with Ideogram V2"
                                : "Process"
              } with AI (${currentCredits} credits)`
            )}
          </Button>

          {userCredits < currentCredits && (
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">
                You need {currentCredits} credits but only have {userCredits}.
                <a href="/credits" className="underline ml-1 font-medium hover:text-red-700">
                  Buy more credits
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {(result || videoResult) && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                {videoResult ? (
                  <Video className="w-6 h-6 text-green-600" />
                ) : (
                  <Upload className="w-6 h-6 text-green-600" />
                )}
              </div>
              {videoResult ? "Generated Video" : "Processed Image"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoResult ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={videoResult}
                    controls
                    className="w-full h-auto max-h-96 object-contain"
                    onError={(e) => {
                      console.error("Video failed to load:", videoResult)
                      const target = e.target as HTMLVideoElement
                      target.style.display = "none"
                      const errorDiv = target.nextElementSibling as HTMLElement
                      if (errorDiv) errorDiv.style.display = "block"
                    }}
                  />
                  <div className="hidden p-4 text-center text-gray-500">
                    <p>Video failed to load. Please try again.</p>
                  </div>
                </div>
              ) : result ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={result || "/placeholder.svg"}
                    alt="Processed result"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                    onError={(e) => {
                      console.error("Image failed to load:", result)
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const errorDiv = target.nextElementSibling as HTMLElement
                      if (errorDiv) errorDiv.style.display = "block"
                    }}
                  />
                  <div className="hidden p-4 text-center text-gray-500">
                    <p>Image failed to load. Please try again.</p>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    const url = videoResult || result
                    if (url) {
                      const link = document.createElement("a")
                      link.href = url
                      link.download = `processed-${Date.now()}.${videoResult ? "mp4" : "jpg"}`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }
                  }}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Download {videoResult ? "Video" : "Image"}
                </Button>
                <Button
                  onClick={() => {
                    setResult(null)
                    setVideoResult(null)
                    setImageFile(null)
                    setGarmentFile(null)
                    setReferenceFiles([])
                    setPrompt("")
                    setNegativePrompt("")
                    setStylePrompt("")
                    setFashionStyle("professional")
                    setFashionBackground("studio")
                    setFashionLighting("natural")
                  }}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Process Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
