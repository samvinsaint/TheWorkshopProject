"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, X } from "lucide-react"
import { useState } from "react"

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

interface RegistrationCardProps {
  registration: Registration
  onCancel: (workshopId: string) => Promise<void>
}

export function RegistrationCard({ registration, onCancel }: RegistrationCardProps) {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this registration?")) {
      return
    }

    setIsCancelling(true)
    try {
      await onCancel(registration.workshops.id)
    } finally {
      setIsCancelling(false)
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

  const getStatusBadge = () => {
    switch (registration.status) {
      case "CONFIRMED":
        return <Badge variant="default">Confirmed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{registration.status}</Badge>
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl text-balance">{registration.workshops.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-pretty">{registration.workshops.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(registration.workshops.start_time)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Capacity: {registration.workshops.total_quota} seats</span>
        </div>
        <div className="text-xs text-muted-foreground">Registered on {formatDate(registration.registered_at)}</div>
      </CardContent>
      {registration.status === "CONFIRMED" && (
        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleCancel} disabled={isCancelling}>
            <X className="mr-2 h-4 w-4" />
            {isCancelling ? "Cancelling..." : "Cancel Registration"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
