"use client"

import { useState, useEffect } from "react"
import { CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase.from("users").select("credits").eq("email", userEmail)

        if (error) {
          console.error("Error fetching credits:", error)
          return
        }

        if (data && data.length > 0 && typeof data[0].credits === "number") {
          setCredits(data[0].credits)
          onCreditsChange?.(data[0].credits)
        } else if (data && data.length === 0) {
          console.warn("No user found with email:", userEmail)
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error)
      }
    }

    fetchCredits()

    const interval = setInterval(fetchCredits, 2000)

    const channel = supabase
      .channel("credits-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `email=eq.${userEmail}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.credits === "number") {
            setCredits(payload.new.credits)
            onCreditsChange?.(payload.new.credits)
          }
        },
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [userEmail, supabase, onCreditsChange])

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
