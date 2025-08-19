"use server"

import { createClient } from "@/lib/supabase/server"

// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting here
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")

  if (!email || !password || !firstName || !lastName) {
    return { error: "Email, password, first name, and last name are required" }
  }

  const supabase = await createClient()

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      const { error: dbError } = await supabase.from("users").insert({
        email: email.toString(),
        first_name: firstName.toString(),
        last_name: lastName.toString(),
        credits: 10, // Default credits
        subscription_plan: "free", // Default plan
        email_verified: false, // Will be updated when email is verified
        password_hash: "managed_by_supabase_auth", // Placeholder since auth is handled by Supabase
      })

      if (dbError) {
        console.error("Error creating user record:", dbError)
      }
    }

    return {
      success:
        "Account created successfully! Please check your email and click the verification link. If you don't see the email, check your spam folder.",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  const supabase = await createClient()

  try {
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

export async function forgotPassword(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")

  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toString())

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email for password reset instructions." }
  } catch (error) {
    console.error("Forgot password error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update user profile
export async function updateProfile(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const company = formData.get("company")

  if (!email || !firstName || !lastName) {
    return { error: "Email, first name, and last name are required" }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("users")
      .update({
        first_name: firstName.toString(),
        last_name: lastName.toString(),
        company: company?.toString() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email.toString())

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update notification preferences
export async function updateNotifications(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const userId = formData.get("userId")
  const emailNotifications = formData.get("emailNotifications") === "on"
  const lowCreditWarnings = formData.get("lowCreditWarnings") === "on"
  const featureUpdates = formData.get("featureUpdates") === "on"

  if (!userId) {
    return { error: "User ID is required" }
  }

  const supabase = await createClient()

  try {
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", Number.parseInt(userId.toString()))
      .single()

    if (existing) {
      const { error } = await supabase
        .from("user_preferences")
        .update({
          email_notifications: emailNotifications,
          low_credit_warnings: lowCreditWarnings,
          feature_updates: featureUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", Number.parseInt(userId.toString()))

      if (error) {
        return { error: error.message }
      }
    } else {
      const { error } = await supabase.from("user_preferences").insert({
        user_id: Number.parseInt(userId.toString()),
        email_notifications: emailNotifications,
        low_credit_warnings: lowCreditWarnings,
        feature_updates: featureUpdates,
      })

      if (error) {
        return { error: error.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Notification update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update password
export async function updatePassword(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const currentPassword = formData.get("currentPassword")
  const newPassword = formData.get("newPassword")
  const confirmPassword = formData.get("confirmPassword")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required" }
  }

  if (newPassword.toString() !== confirmPassword.toString()) {
    return { error: "New passwords do not match" }
  }

  if (newPassword.toString().length < 8) {
    return { error: "New password must be at least 8 characters long" }
  }

  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return { error: "User not authenticated" }
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword.toString(),
    })

    if (verifyError) {
      return { error: "Current password is incorrect" }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.toString(),
    })

    if (updateError) {
      return { error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Password update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error("Google sign in error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function handleGoogleUser(user: any) {
  const supabase = await createClient()

  try {
    // Check if user already exists in our users table
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!existingUser) {
      // Create user record if it doesn't exist
      const { error: dbError } = await supabase.from("users").insert({
        email: user.email,
        first_name: user.user_metadata?.full_name?.split(" ")[0] || user.user_metadata?.name?.split(" ")[0] || "",
        last_name:
          user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
          user.user_metadata?.name?.split(" ").slice(1).join(" ") ||
          "",
        credits: 10, // Default credits
        subscription_plan: "free", // Default plan
        email_verified: true, // Google users are pre-verified
        password_hash: "managed_by_supabase_auth", // Placeholder since auth is handled by Supabase
      })

      if (dbError) {
        console.error("Error creating Google user record:", dbError)
      }
    }
  } catch (error) {
    console.error("Handle Google user error:", error)
  }
}
