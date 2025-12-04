"use client"

import { RegistrationCard } from "@/components/registration-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, LogOut, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Registration {
  id: string
  status: string
  registered_at: string
  workshops: {
    id: string
    title: string
    description: string
    start_time: string
    total_quota: number
  }
}

export default function MyWorkshopsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    fetchRegistrations()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || "")
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/my-registrations")
      if (!response.ok) throw new Error("Failed to fetch registrations")
      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (workshopId: string) => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}/cancel`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel registration")
      }

      // Refresh registrations list
      await fetchRegistrations()

      alert("Registration cancelled successfully!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel")
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const confirmedRegistrations = registrations.filter((r) => r.status === "CONFIRMED")
  const cancelledRegistrations = registrations.filter((r) => r.status === "CANCELLED")

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading your workshops...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/workshops">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">The Workshop</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{userEmail}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-balance">My Workshops</h2>
              <p className="text-muted-foreground text-balance">View and manage your workshop registrations</p>
            </div>

            <Tabs defaultValue="confirmed" className="w-full">
              <TabsList>
                <TabsTrigger value="confirmed">Active ({confirmedRegistrations.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledRegistrations.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="confirmed" className="mt-6">
                {confirmedRegistrations.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {confirmedRegistrations.map((registration) => (
                      <RegistrationCard key={registration.id} registration={registration} onCancel={handleCancel} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="mb-4 text-muted-foreground">You haven&apos;t registered for any workshops yet.</p>
                    <Button asChild>
                      <Link href="/workshops">Browse Workshops</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                {cancelledRegistrations.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cancelledRegistrations.map((registration) => (
                      <RegistrationCard key={registration.id} registration={registration} onCancel={handleCancel} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">No cancelled registrations.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
