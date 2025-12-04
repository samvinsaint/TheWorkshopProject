import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's registrations with workshop details
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select(`
        *,
        workshops (
          id,
          title,
          description,
          start_time,
          total_quota
        )
      `)
      .eq("user_id", user.id)
      .order("registered_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("[v0] Error fetching user registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
