import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Download, Calendar, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { NotificationForm } from "@/components/notification-form"
import { SecurityForm } from "@/components/security-form"
import { UnifiedHeader } from "@/components/unified-header"

export default async function ProfilePage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signin")
  }

  // Fetch user data from database
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  // Fetch user preferences
  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", userData?.id).single()

  // Fetch transaction history
  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userData?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch usage statistics from tool_executions table
  const { data: toolExecutions } = await supabase.from("tool_executions").select("*").eq("user_id", userData?.id)

  const totalImages = toolExecutions?.length || 0
  const thisMonth =
    toolExecutions?.filter((execution) => {
      const executionDate = new Date(execution.created_at)
      const now = new Date()
      return executionDate.getMonth() === now.getMonth() && executionDate.getFullYear() === now.getFullYear()
    }).length || 0

  // Calculate total credits used from tool_executions
  const totalCreditsUsed = toolExecutions?.reduce((sum, execution) => sum + (execution.credits_used || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <UnifiedHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {userData?.first_name} {userData?.last_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{user.email}</p>
                <Badge className="bg-purple-100 text-purple-700 mb-4">
                  {userData?.subscription_plan || "Free Plan"}
                </Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-medium">{userData?.credits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm userData={userData} userEmail={user.email} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{totalImages}</div>
                        <div className="text-sm text-gray-600">Total Images</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{thisMonth}</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{totalCreditsUsed}</div>
                        <div className="text-sm text-gray-600">Credits Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{userData?.credits || 0}</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{userData?.subscription_plan || "Free Plan"}</h3>
                        <p className="text-sm text-gray-600">
                          {userData?.credits || 0} credits •{" "}
                          {userData?.subscription_plan === "Free Plan" ? "Basic features" : "Premium features"}
                        </p>
                      </div>
                      <Link href="/pricing">
                        <Button className="bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Transaction History
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between py-3 border-b last:border-b-0"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{transaction.description}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div
                                  className={`font-semibold text-sm ${
                                    transaction.transaction_type === "purchase" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {transaction.transaction_type === "purchase" ? "+" : ""}
                                  {transaction.amount}
                                </div>
                                {transaction.cost_usd && (
                                  <div className="text-xs text-gray-500">${transaction.cost_usd}</div>
                                )}
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  transaction.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100"
                                }`}
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No transactions yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotificationForm preferences={preferences} userId={userData?.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SecurityForm />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Download Your Data</h4>
                        <p className="text-sm text-gray-600">Export all your account data and usage history</p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Delete Account</h4>
                        <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
