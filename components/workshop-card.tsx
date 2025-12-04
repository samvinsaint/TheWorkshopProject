"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface Workshop {
  id: string
  title: string
  description: string
  total_quota: number
  start_time: string
  available_seats: number
  is_full: boolean
  image_url?: string
}

interface WorkshopCardProps {
  workshop: Workshop
  onRegister: (workshopId: string) => Promise<void>
}

export function WorkshopCard({ workshop, onRegister }: WorkshopCardProps) {
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      await onRegister(workshop.id)
    } finally {
      setIsRegistering(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const availabilityPercentage = (workshop.available_seats / workshop.total_quota) * 100

  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "bg-green-500"
    if (availabilityPercentage > 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      {workshop.image_url && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={workshop.image_url || "/placeholder.svg"}
            alt={workshop.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl text-balance">{workshop.title}</CardTitle>
          {workshop.is_full ? (
            <Badge variant="destructive">Full</Badge>
          ) : workshop.available_seats <= 5 ? (
            <Badge variant="secondary">Almost Full</Badge>
          ) : (
            <Badge variant="default">Available</Badge>
          )}
        </div>
        <CardDescription className="text-pretty">{workshop.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(workshop.start_time)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {workshop.available_seats} / {workshop.total_quota} seats available
              </span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${getAvailabilityColor()}`}
              style={{
                width: `${Math.min(100, availabilityPercentage)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleRegister} disabled={workshop.is_full || isRegistering}>
          {isRegistering ? "Registering..." : workshop.is_full ? "Workshop Full" : "Register Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
