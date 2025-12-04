import { createClient } from "@/lib/supabase/server"
import { getRedisClient } from "@/lib/redis"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const redis = getRedisClient()

    // Fetch all active workshops
    const { data: workshops, error } = await supabase
      .from("workshops")
      .select("*")
      .eq("is_active", true)
      .order("start_time", { ascending: true })

    if (error) throw error

    // Enrich workshops with real-time availability from Redis
    const enrichedWorkshops = await Promise.all(
      workshops.map(async (workshop) => {
        const key = `workshop:${workshop.id}:available`
        let available = await redis.get<number>(key)

        // If not in Redis, calculate from database and cache it
        if (available === null) {
          const { data: registrations } = await supabase
            .from("registrations")
            .select("seats")
            .eq("workshop_id", workshop.id)
            .eq("status", "CONFIRMED")

          const totalSeatsUsed = registrations?.reduce((sum, reg) => sum + (reg.seats?.length || 0), 0) || 0
          available = workshop.total_quota - totalSeatsUsed

          // Cache in Redis for future requests
          await redis.set(key, available)
        }

        return {
          ...workshop,
          available_seats: Math.max(0, available),
          is_full: available <= 0,
        }
      }),
    )

    return NextResponse.json(enrichedWorkshops)
  } catch (error) {
    console.error("[v0] Error fetching workshops:", error)
    return NextResponse.json({ error: "Failed to fetch workshops" }, { status: 500 })
  }
}
