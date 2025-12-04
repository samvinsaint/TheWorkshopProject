import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workshopId } = await params
    const supabase = await createClient()

    console.log(`[v0] Fetching occupied seats for workshop ${workshopId}`)

    // Fetch all confirmed registrations with their seats
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("seats, user_id")
      .eq("workshop_id", workshopId)
      .eq("status", "CONFIRMED")

    if (error) {
      console.error("[v0] Error fetching registrations:", error)
      throw error
    }

    console.log(`[v0] Found ${registrations?.length || 0} confirmed registrations`)
    console.log("[v0] Registration data:", JSON.stringify(registrations, null, 2))

    // Flatten all occupied seats into a single array, filtering out null/undefined
    const occupiedSeats = registrations
      .flatMap((reg) => {
        // Handle both array and null cases
        if (!reg.seats || !Array.isArray(reg.seats)) {
          console.log(`[v0] Registration has no seats array:`, reg)
          return []
        }
        return reg.seats
      })
      .filter((seat) => seat) // Remove any null/undefined values

    console.log(`[v0] Total occupied seats: ${occupiedSeats.length}`, occupiedSeats)

    return NextResponse.json({ occupiedSeats })
  } catch (error) {
    console.error("[v0] Error fetching occupied seats:", error)
    return NextResponse.json({ error: "Failed to fetch seats" }, { status: 500 })
  }
}
