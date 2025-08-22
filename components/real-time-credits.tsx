"use client"

import { useState, useEffect, useRef } from "react"
import { CreditCard } from "lucide-react"

interface RealTimeCreditsProps {
  initialCredits: number
  userEmail: string
  showIcon?: boolean
  showText?: boolean
  onCreditsChange?: (credits: number) => void
}

export function RealTimeCredits({
  initialCredits,
  userEmail,
  showIcon = true,
  showText = false,
  onCreditsChange,
}: RealTimeCreditsProps) {
  const [credits, setCredits] = useState(initialCredits)
  const isMountedRef = useRef(true)
  const onCreditsChangeRef = useRef(onCreditsChange)

  useEffect(() => {
    onCreditsChangeRef.current = onCreditsChange
  }, [onCreditsChange])

  useEffect(() => {
    isMountedRef.current = true

    const fetchCredits = async (retryCount = 0) => {
      if (!isMountedRef.current) return

      try {
        console.log("[v0] Fetching credits, attempt:", retryCount + 1)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch("/api/credits", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "no-cache",
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Credits fetched successfully:", data.credits)

        if (isMountedRef.current && typeof data.credits === "number") {
          setCredits(data.credits)
          onCreditsChangeRef.current?.(data.credits)
        }
      } catch (error) {
        console.error("[v0] Error fetching credits:", error)

        if (retryCount < 2 && (error instanceof TypeError || error.name === "AbortError")) {
          console.log("[v0] Retrying credits fetch due to browser extension interference")
          setTimeout(
            () => {
              if (isMountedRef.current) {
                fetchCredits(retryCount + 1)
              }
            },
            1000 * (retryCount + 1),
          )
          return
        }

        console.log("[v0] Using initial credits as fallback:", initialCredits)
        if (isMountedRef.current) {
          setCredits(initialCredits)
        }
      }
    }

    fetchCredits()

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchCredits()
      }
    }, 30000)

    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [userEmail, initialCredits]) // Removed onCreditsChange from dependencies to prevent infinite loops

  return (
    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
      {showIcon && <CreditCard className="w-4 h-4 text-purple-600" />}
      <span className="text-purple-600 font-medium">
        {credits}
        {showText ? " Credits" : ""}
      </span>
    </div>
  )
}
