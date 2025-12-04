import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return profile with user email
  return NextResponse.json({
    email: user.email,
    full_name: profile?.full_name || null,
    phone_number: profile?.phone_number || null,
    gender: profile?.gender || null,
    created_at: profile?.created_at || user.created_at,
  })
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { full_name, phone_number, gender } = body

  // Upsert profile
  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      full_name,
      phone_number,
      gender,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
