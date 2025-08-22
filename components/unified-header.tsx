"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RealTimeCredits } from "@/components/real-time-credits"
import { TurkishSignOutButton } from "@/components/turkish-sign-out-button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface UnifiedHeaderProps {
  currentPage?: string
}

export function UnifiedHeader({ currentPage = "" }: UnifiedHeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function getUser() {
      try {
        console.log("[v0] UnifiedHeader: Fetching user data")
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.error("[v0] UnifiedHeader: Auth error:", authError)
          setLoading(false)
          return
        }

        setUser(authUser)

        if (authUser?.email) {
          console.log("[v0] UnifiedHeader: Fetching user credits for:", authUser.email)
          const { data: userInfo, error: userError } = await supabase
            .from("users")
            .select("credits")
            .eq("email", authUser.email)
            .single()

          if (userError) {
            console.error("[v0] UnifiedHeader: User data error:", userError)
            setUserData({ credits: 5 })
          } else {
            console.log("[v0] UnifiedHeader: User data fetched:", userInfo)
            setUserData(userInfo)
          }
        }
      } catch (error) {
        console.error("[v0] UnifiedHeader: Unexpected error:", error)
        setUserData({ credits: 5 })
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[v0] UnifiedHeader: Auth state changed:", event)
      if (event === "SIGNED_OUT") {
        setUser(null)
        setUserData(null)
      } else if (session?.user) {
        setUser(session.user)
        if (session.user.email) {
          supabase
            .from("users")
            .select("credits")
            .eq("email", session.user.email)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.error("[v0] UnifiedHeader: Error refetching user data:", error)
                setUserData({ credits: 5 })
              } else {
                setUserData(data)
              }
            })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, mounted])

  if (!mounted || loading) {
    return (
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Joyoda
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-14 h-6 bg-gray-200 animate-pulse rounded"></div>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  const isAuthenticated = !!user

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Joyoda
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            // Authenticated Navigation
            <>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  currentPage === "dashboard" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/tools"
                className={`transition-colors ${
                  currentPage === "tools" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Tools
              </Link>
              <Link
                href="/n8n"
                className={`transition-colors ${
                  currentPage === "n8n" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Workflows
              </Link>
              <Link
                href="/my-documents"
                className={`transition-colors ${
                  currentPage === "my-documents" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                My Documents
              </Link>
              <Link
                href="/pricing"
                className={`transition-colors ${
                  currentPage === "pricing" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/profile"
                className={`transition-colors ${
                  currentPage === "profile" ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Profile
              </Link>
            </>
          ) : (
            // Unauthenticated Navigation
            <>
              <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
                Pricing
              </Link>
              <Link href="/tools" className="text-gray-600 hover:text-purple-600 transition-colors">
                Tools
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            // Authenticated Actions
            <>
              <RealTimeCredits initialCredits={userData?.credits || 5} userEmail={user?.email || ""} />
              <TurkishSignOutButton />
            </>
          ) : (
            // Unauthenticated Actions
            <>
              <Link href="/signin">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
