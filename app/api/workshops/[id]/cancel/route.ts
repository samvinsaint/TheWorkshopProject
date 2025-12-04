import { createClient } from "@/lib/supabase/server"
import { getRedisClient } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workshopId } = await params
    const supabase = await createClient()
    const redis = getRedisClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user's registration
    const { data: registration, error: findError } = await supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("workshop_id", workshopId)
      .eq("status", "CONFIRMED")
      .single()

    if (findError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Update registration status to CANCELLED
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ status: "CANCELLED" })
      .eq("id", registration.id)

    if (updateError) throw updateError

    // Increment Redis counter to free up the seat
    const key = `workshop:${workshopId}:available`
    await redis.incr(key)

    console.log(`[v0] Successfully cancelled registration for user ${user.id} from workshop ${workshopId}`)

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully",
    })
  } catch (error) {
    console.error("[v0] Error cancelling registration:", error)
    return NextResponse.json({ error: "Failed to cancel registration" }, { status: 500 })
  }
}
