"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/actions"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function TurkishSignOutButton() {
  const router = useRouter()
  const [state, formAction] = useActionState(signOut, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/signin")
    }
  }, [state, router])

  return (
    <form action={formAction}>
      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" type="submit">
        <LogOut className="w-4 h-4 mr-1" />
        SignOut
      </Button>
    </form>
  )
}
