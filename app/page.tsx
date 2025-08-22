"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Users,
  ImageIcon,
  Clock,
  CheckCircle,
  Scissors,
  Sparkles,
  Video,
  Palette,
  Heart,
  Play,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [tools, setTools] = useState<any[]>([])

  useEffect(() => {
    async function fetchTools() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("ai_tools")
          .select("*")
          .eq("is_active", true)
          .order("usage_count", { ascending: false })
          .limit(8)

        if (data && !error) {
          setTools(data)
        }
      } catch (error) {
        // Use fallback tools if database is not available
        console.log("Database not available, using fallback tools")
      }
    }

    fetchTools()
  }, [])

  const iconMap: Record<string, any> = {
    "background-remover": Scissors,
    "face-enhancer": Sparkles,
    "image-upscaler": ImageIcon,
    "style-transfer": Palette,
    "text-to-image": ImageIcon,
    imagen4: ImageIcon,
    "face-swap": Users,
    "virtual-try-on": Users,
    "age-progression": Clock,
    "text-to-video-kling": Video,
    "text-to-video-hailuo": Video,
    "Image Editing": ImageIcon,
    Enhancement: ImageIcon,
    Creative: Palette,
    Generation: ImageIcon,
    Fashion: Users,
  }

  const fallbackTools = [
    {
      id: 1,
      tool_id: "background-remover",
      name: "Background Remover",
      description: "Remove backgrounds from images instantly",
      credits_per_use: 1,
      category: "Image Editing",
      rating: 4.8,
      usage_count: 1200,
    },
    {
      id: 2,
      tool_id: "face-enhancer",
      name: "Face Enhancer",
      description: "Enhance facial features with AI",
      credits_per_use: 2,
      category: "Enhancement",
      rating: 4.7,
      usage_count: 900,
    },
    {
      id: 3,
      tool_id: "image-upscaler",
      name: "Image Upscaler",
      description: "Upscale images without quality loss",
      credits_per_use: 2,
      category: "Enhancement",
      rating: 4.9,
      usage_count: 1500,
    },
    {
      id: 4,
      tool_id: "style-transfer",
      name: "Style Transfer",
      description: "Apply artistic styles to your images",
      credits_per_use: 3,
      category: "Creative",
      rating: 4.6,
      usage_count: 800,
    },
    {
      id: 5,
      tool_id: "text-to-image",
      name: "Text to Image",
      description: "Generate images from text descriptions",
      credits_per_use: 4,
      category: "Generation",
      rating: 4.5,
      usage_count: 1100,
    },
    {
      id: 6,
      tool_id: "face-swap",
      name: "Face Swap",
      description: "Swap faces between images",
      credits_per_use: 3,
      category: "Creative",
      rating: 4.4,
      usage_count: 700,
    },
    {
      id: 7,
      tool_id: "virtual-try-on",
      name: "Virtual Try-On",
      description: "Try on clothes virtually",
      credits_per_use: 3,
      category: "Fashion",
      rating: 4.3,
      usage_count: 600,
    },
    {
      id: 8,
      tool_id: "age-progression",
      name: "Age Progression",
      description: "See how you'll look in the future",
      credits_per_use: 2,
      category: "Creative",
      rating: 4.2,
      usage_count: 500,
    },
  ]

  const displayTools = tools.length > 0 ? tools : fallbackTools

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white scroll-smooth">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Joyoda
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="#tools" className="text-gray-600 hover:text-purple-600 transition-colors">
              Tools
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100">✨ Powered by Advanced AI</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transform Images with AI Magic
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Professional AI-powered image editing tools that deliver stunning results in seconds. Remove backgrounds,
            upscale images, enhance photos and more with cutting-edge artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                Get Started Now
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-lg px-8 py-3 bg-transparent"
              >
                Explore Tools
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src="/ai-image-editing-dashboard-purple.png"
              alt="AI Visual Editor Dashboard"
              className="rounded-2xl shadow-2xl mx-auto border"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Images Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                Rating
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features tools" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to edit images like a pro</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools handles every aspect of professional image editing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTools.slice(0, 8).map((tool) => {
              const IconComponent = iconMap[tool.tool_id] || iconMap[tool.category] || ImageIcon
              return (
                <Link key={tool.id} href={`/tools/${tool.tool_id}`}>
                  <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    {/* Hero Visual Area */}
                    <div className="relative h-32 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                      </div>

                      <div className="absolute inset-0">
                        {tool.image_url ? (
                          <img
                            src={tool.image_url || "/placeholder.svg"}
                            alt={tool.name}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : null}
                        <div
                          className={`${tool.image_url ? "hidden" : ""} w-full h-full flex items-center justify-center absolute inset-0`}
                        >
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs z-10"
                      >
                        {tool.category?.replace("-", " ") || "AI Tool"}
                      </Badge>

                      {/* Bottom Stats */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs z-10">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{tool.rating || "4.5"}</span>
                          </div>
                          <span className="opacity-70">•</span>
                          <span className="opacity-90">{tool.usage_count || 0} uses</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          <span className="font-semibold">{tool.credits_per_use}</span>
                        </div>
                      </div>

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <CardContent className="p-3 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-sm">
                          {tool.name}
                        </h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 -mt-1 p-1">
                          <Heart className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-gray-600 text-xs leading-tight line-clamp-2 flex-1">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/tools">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                View All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transform your images in 3 easy steps</h2>
            <p className="text-xl text-gray-600">Simple, fast, and professional results every time</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Your Image</h3>
              <p className="text-gray-600">
                Drag and drop or click to upload your image. We support PNG, JPG, and GIF formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose Your Tool</h3>
              <p className="text-gray-600">
                Select from our suite of AI-powered tools to enhance your image exactly how you want.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Download Result</h3>
              <p className="text-gray-600">
                Get your professionally edited image in seconds. High-quality results guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by creators worldwide</h2>
            <p className="text-xl text-gray-600">See what our users are saying about their experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "This tool has revolutionized my workflow. Background removal that used to take hours now takes
                  seconds!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Miller</div>
                    <div className="text-sm text-gray-500">Graphic Designer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The image upscaling feature is incredible. My old photos look brand new with amazing detail and
                  clarity."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Davis</div>
                    <div className="text-sm text-gray-500">Photographer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Perfect for my e-commerce business. Professional product photos in minutes, not hours."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">EW</span>
                  </div>
                  <div>
                    <div className="font-semibold">Emily Wilson</div>
                    <div className="text-sm text-gray-500">Business Owner</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose the perfect plan for you</h2>
            <p className="text-xl text-gray-600">Flexible pricing options for individuals and teams</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 border-2">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Basic</h3>
                  <div className="text-3xl font-bold mb-4">
                    $5.9<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Perfect for getting started</p>
                  <Link href="/pricing">
                    <Button className="w-full mb-6 bg-transparent" variant="outline">
                      Get Started
                    </Button>
                  </Link>
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">100 credits per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All AI tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Standard quality</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-purple-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">Most Popular</Badge>
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Pro</h3>
                  <div className="text-3xl font-bold mb-4">
                    $14.9<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For professionals and creators</p>
                  <Link href="/pricing">
                    <Button className="w-full mb-6 bg-purple-600 hover:bg-purple-700">Get Started</Button>
                  </Link>
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">500 credits per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All AI tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">High quality results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-2">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-4">
                    $24.9<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For teams and businesses</p>
                  <Link href="/pricing">
                    <Button className="w-full mb-6 bg-transparent" variant="outline">
                      Get Started
                    </Button>
                  </Link>
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">1000 credits per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All AI tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Premium quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">24/7 dedicated support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">API access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your images?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators using Joyoda Smart to create stunning visuals
          </p>
          <div className="flex justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Joyoda
                </span>
              </div>
              <p className="text-gray-400">Transform your images with the power of artificial intelligence.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
                <div>Documentation</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Community</div>
                <div>Status</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Joyoda Smart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
