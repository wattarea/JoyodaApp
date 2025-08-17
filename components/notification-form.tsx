"use client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { updateNotifications } from "@/lib/actions"
import { useActionState } from "react"

interface NotificationFormProps {
  preferences: any
  userId: number
}

export function NotificationForm({ preferences, userId }: NotificationFormProps) {
  const [state, formAction] = useActionState(updateNotifications, { success: false, error: "" })

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Email Notifications</h4>
          <p className="text-sm text-gray-600">Receive updates about your account and usage</p>
        </div>
        <Switch name="emailNotifications" defaultChecked={preferences?.email_notifications || false} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Low Credit Warnings</h4>
          <p className="text-sm text-gray-600">Get notified when your credits are running low</p>
        </div>
        <Switch name="lowCreditWarnings" defaultChecked={preferences?.low_credit_warnings || false} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Feature Updates</h4>
          <p className="text-sm text-gray-600">Stay informed about new AI tools and features</p>
        </div>
        <Switch name="featureUpdates" defaultChecked={preferences?.feature_updates || false} />
      </div>

      {state.error && <div className="text-red-600 text-sm">{state.error}</div>}

      {state.success && <div className="text-green-600 text-sm">Notification preferences updated!</div>}

      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        Save Preferences
      </Button>
    </form>
  )
}
