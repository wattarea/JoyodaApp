import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/signin")
  }

  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    redirect("/dashboard") // Redirect non-admin users to dashboard
  }

  return { user, userData }
}

export async function isAdmin(email: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: userData, error } = await supabase.from("users").select("role").eq("email", email).single()

  return !error && userData?.role === "admin"
}
