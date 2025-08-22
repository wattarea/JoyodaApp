"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Calculator, CreditCard } from "lucide-react"
import { toast } from "sonner"
import MyVideosSection from "@/components/my-videos-section"

interface FormData {
  story: string
  numberOfScenes: number
  aspectRatio: string
  resolution: string
  duration: number
}

export default function MovieTeaserWorkflow() {
  const [formData, setFormData] = useState<FormData>({
    story: "",
    numberOfScenes: 5,
    aspectRatio: "16:9",
    resolution: "480p",
    duration: 5,
  })
  const [userCredits, setUserCredits] = useState<number>(0)
  const [calculatedCredits, setCalculatedCredits] = useState<number>(75)
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  // Fetch user credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits")
        if (response.ok) {
          const data = await response.json()
          setUserCredits(data.credits)
        }
      } catch (error) {
        console.error("Error fetching credits:", error)
      }
    }
    fetchCredits()
  }, [])

  // Calculate credits based on pricing rules
  useEffect(() => {
    const calculateCredits = () => {
      // Base cost: 13 credits per scene
      const baseCredits = formData.numberOfScenes * 13

      // Aspect ratio multiplier
      let aspectMultiplier = 1
      switch (formData.aspectRatio) {
        case "16:9":
          aspectMultiplier = 1.3
          break
        case "9:16":
          aspectMultiplier = 1
          break
        case "1:1":
          aspectMultiplier = 1
          break
      }

      // Resolution multiplier
      let resolutionMultiplier = 1
      switch (formData.resolution) {
        case "480p":
          resolutionMultiplier = 1
          break
        case "1080p":
          resolutionMultiplier = 2
          break
      }

      // Duration multiplier
      let durationMultiplier = 1
      switch (formData.duration) {
        case 5:
          durationMultiplier = 1
          break
        case 10:
          durationMultiplier = 2
          break
      }

      const totalCredits = Math.ceil(baseCredits * aspectMultiplier * resolutionMultiplier * durationMultiplier)
      setCalculatedCredits(totalCredits)
    }

    calculateCredits()
  }, [formData])

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExecuteWorkflow = async () => {
    if (!formData.story.trim()) {
      toast.error("Please enter a story for your video")
      return
    }

    if (userCredits < calculatedCredits) {
      toast.error("Insufficient credits to run this workflow")
      return
    }

    setIsExecuting(true)
    try {
      const response = await fetch("/api/n8n/execute-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflowUrl: "https://6yjhno4b.rpcld.app/webhook-test/9be0d32f-2882-4136-9321-5c94a768c02d",
          formData,
          creditsRequired: calculatedCredits,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success("Workflow started successfully! Check 'My Videos' below for progress.")
        // Update user credits
        setUserCredits((prev) => prev - calculatedCredits)
        setFormData({
          story: "",
          numberOfScenes: 5,
          aspectRatio: "16:9",
          resolution: "480p",
          duration: 5,
        })
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to start workflow")
      }
    } catch (error) {
      console.error("Error executing workflow:", error)
      toast.error("Failed to start workflow")
    } finally {
      setIsExecuting(false)
    }
  }

  const canExecute = formData.story.trim() && userCredits >= calculatedCredits

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Movie Teaser Creator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create stunning AI-powered movie teasers with Seedance technology. Customize every aspect of your video from
            story to resolution.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Create Your Video</CardTitle>
                <CardDescription className="text-purple-100">
                  Fill in the details below to generate your movie teaser
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Story Input */}
                <div className="space-y-2">
                  <Label htmlFor="story" className="text-lg font-semibold text-gray-700">
                    Story <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="story"
                    placeholder="Describe your movie story here..."
                    value={formData.story}
                    onChange={(e) => handleInputChange("story", e.target.value)}
                    className="min-h-[120px] text-base"
                  />
                </div>

                {/* Number of Scenes */}
                <div className="space-y-2">
                  <Label htmlFor="scenes" className="text-lg font-semibold text-gray-700">
                    Number of Scenes
                  </Label>
                  <Input
                    id="scenes"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.numberOfScenes}
                    onChange={(e) => handleInputChange("numberOfScenes", Number.parseInt(e.target.value) || 1)}
                    className="text-base"
                  />
                  <p className="text-sm text-gray-500">13 credits per scene</p>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">
                    Aspect Ratio <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.aspectRatio}
                    onValueChange={(value) => handleInputChange("aspectRatio", value)}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resolution */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">
                    Resolution <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.resolution} onValueChange={(value) => handleInputChange("resolution", value)}>
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => handleInputChange("duration", Number.parseInt(value))}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Calculator & Execute */}
          <div className="space-y-6">
            {/* Credit Calculation */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Credit Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base ({formData.numberOfScenes} scenes)</span>
                    <span className="font-semibold">{formData.numberOfScenes * 13}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aspect Ratio</span>
                    <span className="font-semibold">{formData.aspectRatio === "16:9" ? "1.2x" : "1x"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resolution</span>
                    <span className="font-semibold">{formData.resolution === "1080p" ? "2x" : "1x"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{formData.duration === 10 ? "2x" : "1x"}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Credits</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {calculatedCredits}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Credits & Execute */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{userCredits}</div>
                  <div className="text-gray-600">Available Credits</div>
                </div>

                {userCredits < calculatedCredits && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">
                      You need {calculatedCredits - userCredits} more credits to run this workflow.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleExecuteWorkflow}
                  disabled={!canExecute || isExecuting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
                  size="lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Starting Workflow...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Workflow ({calculatedCredits} credits)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Videos section to show workflow progress and results */}
        <MyVideosSection />
      </div>
    </div>
  )
}
