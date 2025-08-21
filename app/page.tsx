"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, ImageIcon, Clock, CheckCircle, Scissors, Sparkles, Video, Palette } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

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

  const fallbackTools = [
    {
      id: 1,
      tool_id: "background-remover",
      name: "Background Remover",
      description: "Remove backgrounds from images instantly",
      credits_per_use: 1,
      category: "Image Editing",
    },
    {
      id: 2,
      tool_id: "face-enhancer",
      name: "Face Enhancer",
      description: "Enhance facial features with AI",
      credits_per_use: 2,
      category: "Enhancement",
    },
    {
      id: 3,
      tool_id: "image-upscaler",
      name: "Image Upscaler",
      description: "Upscale images without quality loss",
      credits_per_use: 2,
      category: "Enhancement",
    },
    {
      id: 4,
      tool_id: "style-transfer",
      name: "Style Transfer",
      description: "Apply artistic styles to your images",
      credits_per_use: 3,
      category: "Creative",
    },
    {
      id: 5,
      tool_id: "text-to-image",
      name: "Text to Image",
      description: "Generate images from text descriptions",
      credits_per_use: 4,
      category: "Generation",
    },
    {
      id: 6,
      tool_id: "face-swap",
      name: "Face Swap",
      description: "Swap faces between images",
      credits_per_use: 3,
      category: "Creative",
    },
    {
      id: 7,
      tool_id: "virtual-try-on",
      name: "Virtual Try-On",
      description: "Try on clothes virtually",
      credits_per_use: 3,
      category: "Fashion",
    },
    {
      id: 8,
      tool_id: "age-progression",
      name: "Age Progression",
      description: "See how you'll look in the future",
      credits_per_use: 2,
      category: "Creative",
    },
  ]

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
  }

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
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors scroll-smooth">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors scroll-smooth">
              Pricing
            </a>
            <a href="#tools" className="text-gray-600 hover:text-purple-600 transition-colors scroll-smooth">
              Tools
            </a>
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
      <section id="features" className="py-20 px-4 scroll-mt-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to edit images like a pro</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools handles every aspect of professional image editing
            </p>
          </div>

          <div id="tools" className="scroll-mt-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayTools.slice(0, 8).map((tool) => {
                const IconComponent = iconMap[tool.tool_id] || ImageIcon
                return (
                  <Link key={tool.id} href={`/tools/${tool.tool_id}`}>
                    <Card className="hover:shadow-lg transition-shadow border-purple-100 cursor-pointer overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-32 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                          {tool.image_url ? (
                            <img
                              src={tool.image_url || "/placeholder.svg"}
                              alt={tool.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : null}
                          <div
                            className={`absolute inset-0 flex items-center justify-center ${tool.image_url ? "hidden" : ""}`}
                          >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold mb-2">{tool.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-600 font-medium">{tool.credits_per_use} credits</span>
                            <span className="text-gray-500">{tool.category}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
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
      <section id="pricing" className="py-20 bg-gray-50 scroll-mt-20">
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
