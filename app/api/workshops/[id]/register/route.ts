import { createClient } from "@/lib/supabase/server"
import { getRedisClient } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workshopId } = await params
    const body = await request.json()
    const { seats = [] } = body

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

    if (!Array.isArray(seats) || seats.length === 0 || seats.length > 2) {
      return NextResponse.json({ error: "Please select 1-2 seats" }, { status: 400 })
    }

    const { data: existingSeats } = await supabase
      .from("registrations")
      .select("seats")
      .eq("workshop_id", workshopId)
      .eq("status", "CONFIRMED")

    const occupiedSeats = existingSeats?.flatMap((reg) => reg.seats || []) || []
    const hasConflict = seats.some((seat) => occupiedSeats.includes(seat))

    if (hasConflict) {
      return NextResponse.json({ error: "One or more selected seats are already taken" }, { status: 409 })
    }

    // STEP 1: Redis Atomic Decrement (Fast pre-check)
    const key = `workshop:${workshopId}:available`
    const pipeline = redis.pipeline()

    for (let i = 0; i < seats.length; i++) {
      pipeline.decr(key)
    }

    const results = await pipeline.exec()
    const remaining = results[results.length - 1] as number

    console.log(`[v0] Workshop ${workshopId} - Remaining seats after decr: ${remaining}`)

    // If Redis shows no seats available
    if (remaining < 0) {
      // Rollback Redis counter
      for (let i = 0; i < seats.length; i++) {
        await redis.incr(key)
      }
      return NextResponse.json({ error: "Workshop is full" }, { status: 409 })
    }

    // STEP 2: Database Transaction with Pessimistic Lock
    try {
      // Check if user already registered
      const { data: existing } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("workshop_id", workshopId)
        .single()

      if (existing) {
        // Rollback Redis counter
        for (let i = 0; i < seats.length; i++) {
          await redis.incr(key)
        }
        return NextResponse.json({ error: "Already registered for this workshop" }, { status: 409 })
      }

      // Get workshop
      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", workshopId)
        .single()

      if (workshopError || !workshop) {
        for (let i = 0; i < seats.length; i++) {
          await redis.incr(key)
        }
        return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
      }

      const { data: allRegistrations } = await supabase
        .from("registrations")
        .select("seats")
        .eq("workshop_id", workshopId)
        .eq("status", "CONFIRMED")

      const totalSeatsUsed = allRegistrations?.reduce((sum, reg) => sum + (reg.seats?.length || 0), 0) || 0

      // Double-check quota
      if (totalSeatsUsed + seats.length > workshop.total_quota) {
        for (let i = 0; i < seats.length; i++) {
          await redis.incr(key)
        }
        return NextResponse.json({ error: "Not enough seats available" }, { status: 409 })
      }

      const { data: registration, error: insertError } = await supabase
        .from("registrations")
        .insert({
          user_id: user.id,
          workshop_id: workshopId,
          status: "CONFIRMED",
          seats: seats,
        })
        .select()
        .single()

      if (insertError) throw insertError

      console.log(
        `[v0] Successfully registered user ${user.id} for workshop ${workshopId} with seats: ${seats.join(", ")}`,
      )

      return NextResponse.json({
        success: true,
        registration,
        remaining_seats: remaining,
      })
    } catch (dbError) {
      // Rollback Redis on database error
      for (let i = 0; i < seats.length; i++) {
        await redis.incr(key)
      }
      console.error("[v0] Database error during registration:", dbError)
      throw dbError
    }
  } catch (error) {
    console.error("[v0] Error registering for workshop:", error)
    return NextResponse.json({ error: "Failed to register for workshop" }, { status: 500 })
  }
}
