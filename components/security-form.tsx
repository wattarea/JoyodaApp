"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/actions"
import { useActionState } from "react"

export function SecurityForm() {
  const [state, formAction] = useActionState(updatePassword, { success: false, error: "" })

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
      </div>

      {state.error && <div className="text-red-600 text-sm">{state.error}</div>}

      {state.success && <div className="text-green-600 text-sm">Password updated successfully!</div>}

      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        Update Password
      </Button>
    </form>
  )
}
