import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { workflowUrl, formData, creditsRequired } = await request.json()

    // Create Supabase client
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, credits, email")
      .eq("email", user.email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user has enough credits
    if (userData.credits < creditsRequired) {
      return NextResponse.json(
        {
          message: "Insufficient credits",
          required: creditsRequired,
          available: userData.credits,
        },
        { status: 400 },
      )
    }

    // Deduct credits from user account
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - creditsRequired })
      .eq("email", user.email)

    if (updateError) {
      console.error("Error updating user credits:", updateError)
      return NextResponse.json({ message: "Failed to deduct credits" }, { status: 500 })
    }

    const { error: transactionError } = await supabase.from("credit_transactions").insert({
      user_id: userData.id,
      amount: -creditsRequired,
      transaction_type: "usage",
      description: `Movie Teaser Workflow - ${formData.numberOfScenes} scenes, ${formData.aspectRatio}, ${formData.resolution}, ${formData.duration}s`,
      tool_used: "movie_teaser_workflow",
    })

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
    }

    const { data: executionRecord, error: executionError } = await supabase
      .from("workflow_executions")
      .insert({
        user_id: userData.id,
        workflow_type: "movie_teaser",
        workflow_name: "Movie Teaser Creator",
        status: "pending",
        input_data: formData,
        credits_used: creditsRequired,
        webhook_url: workflowUrl,
      })
      .select()
      .single()

    if (executionError) {
      console.error("Error creating workflow execution record:", executionError)
      // Continue execution even if tracking fails
    }

    // Prepare data for n8n webhook
    const webhookData = {
      story: formData.story,
      numberOfScenes: formData.numberOfScenes,
      aspectRatio: formData.aspectRatio,
      resolution: formData.resolution,
      duration: formData.duration,
      userEmail: user.email,
      creditsUsed: creditsRequired,
      executionId: executionRecord?.id,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/n8n/webhook-callback`,
    }

    // Send data to n8n webhook
    const webhookResponse = await fetch(workflowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      // If webhook fails, refund the credits and update execution status
      await supabase.from("users").update({ credits: userData.credits }).eq("email", user.email)

      if (executionRecord) {
        await supabase
          .from("workflow_executions")
          .update({
            status: "failed",
            error_message: "Webhook execution failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", executionRecord.id)
      }

      return NextResponse.json(
        {
          message: "Failed to start workflow",
          error: "Webhook execution failed",
        },
        { status: 500 },
      )
    }

    const webhookResult = await webhookResponse.json()

    if (executionRecord && webhookResult.executionId) {
      await supabase
        .from("workflow_executions")
        .update({
          status: "processing",
          n8n_execution_id: webhookResult.executionId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", executionRecord.id)
    }

    return NextResponse.json({
      message: "Workflow started successfully",
      creditsUsed: creditsRequired,
      remainingCredits: userData.credits - creditsRequired,
      workflowResult: webhookResult,
      executionId: executionRecord?.id,
    })
  } catch (error) {
    console.error("Error executing workflow:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
