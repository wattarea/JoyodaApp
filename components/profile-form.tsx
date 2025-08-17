"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions"
import { useActionState } from "react"

interface ProfileFormProps {
  userData: any
  userEmail: string
}

export function ProfileForm({ userData, userEmail }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, { success: false, error: "" })

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="email" value={userEmail} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" defaultValue={userData?.first_name || ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" defaultValue={userData?.last_name || ""} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={userEmail} disabled className="bg-gray-50" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input id="company" name="company" defaultValue={userData?.company || ""} placeholder="Your company name" />
      </div>

      {state.error && <div className="text-red-600 text-sm">{state.error}</div>}

      {state.success && <div className="text-green-600 text-sm">Profile updated successfully!</div>}

      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        Save Changes
      </Button>
    </form>
  )
}
