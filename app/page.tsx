import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">The Workshop</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                The Workshop
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance md:text-xl">
                Make your workshop registration easy, a new community and learning awaits you.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Redis-powered atomic operations ensure instant quota checks with zero race conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">High Concurrency</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Handle 500+ simultaneous registrations without breaking a sweat. Tested and proven.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      See workshop availability in real-time. Know exactly what&apos;s available when you need it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          Built with Next.js, Supabase, and Upstash Redis
        </div>
      </footer>
    </div>
  )
}
