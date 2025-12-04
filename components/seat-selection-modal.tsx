"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Armchair } from "lucide-react"

interface SeatSelectionModalProps {
  workshop: {
    id: string
    title: string
    total_quota: number
  }
  open: boolean
  onClose: () => void
  onConfirm: (seats: string[]) => Promise<void>
}

const generateSeatLayout = (totalSeats: number) => {
  const SEATS_PER_ROW = 10
  const numRows = Math.ceil(totalSeats / SEATS_PER_ROW)
  const rows = []

  for (let i = 0; i < numRows; i++) {
    rows.push(String.fromCharCode(65 + i)) // A, B, C, D...
  }

  return { rows, seatsPerRow: SEATS_PER_ROW }
}

export function SeatSelectionModal({ workshop, open, onClose, onConfirm }: SeatSelectionModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { rows, seatsPerRow } = generateSeatLayout(workshop.total_quota)

  useEffect(() => {
    if (open) {
      console.log("[v0] Modal opened, fetching occupied seats for workshop:", workshop.id)
      setSelectedSeats([])
      setOccupiedSeats([])
      fetchOccupiedSeats()
    }
  }, [open, workshop.id])

  const fetchOccupiedSeats = async () => {
    try {
      console.log("[v0] Fetching occupied seats from API...")
      const response = await fetch(`/api/workshops/${workshop.id}/seats`, {
        cache: "no-store", // Force fresh data, no caching
      })
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Received occupied seats:", data.occupiedSeats)
        setOccupiedSeats(data.occupiedSeats || [])
      } else {
        console.error("[v0] Failed to fetch occupied seats, status:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error fetching occupied seats:", error)
    }
  }

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId)
      } else if (prev.length < 2) {
        return [...prev, seatId]
      }
      return prev
    })
  }

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) return

    setIsLoading(true)
    try {
      await onConfirm(selectedSeats)
      alert("Registration successful! Your seats have been confirmed.")
      await fetchOccupiedSeats()
      onClose()
    } catch (error) {
      console.error("[v0] Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getSeatColor = (seatId: string) => {
    if (selectedSeats.includes(seatId)) return "bg-green-500 hover:bg-green-600"
    if (occupiedSeats.includes(seatId)) return "bg-gray-400 cursor-not-allowed"
    return "bg-red-500 hover:bg-red-600"
  }

  const getSeatNumber = (row: string, seatIndex: number) => {
    const rowIndex = rows.indexOf(row)
    const seatNumber = rowIndex * seatsPerRow + seatIndex + 1
    return seatNumber <= workshop.total_quota ? seatIndex + 1 : null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workshop.title}</DialogTitle>
          <DialogDescription>Select your seats (maximum 2 seats per registration)</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="border-2 border-foreground p-4 text-center">
            <div className="text-lg font-semibold">STAGE</div>
          </div>

          {/* Seating Chart */}
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row} className="flex items-center justify-center gap-1">
                <div className="w-8 text-center font-semibold">{row}</div>
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNumber = getSeatNumber(row, i)

                  if (seatNumber === null) {
                    return <div key={i} className="h-8 w-8" />
                  }

                  const seatId = `${row}${seatNumber}`
                  const isOccupied = occupiedSeats.includes(seatId)

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isOccupied}
                      className={`h-8 w-8 rounded-t-lg transition-all flex items-center justify-center ${getSeatColor(
                        seatId,
                      )}`}
                      title={seatId}
                    >
                      <Armchair className="h-4 w-4 text-white" />
                    </button>
                  )
                })}
                <div className="w-8 text-center font-semibold">{row}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-red-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-green-500" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gray-400" />
              <span>Occupied</span>
            </div>
          </div>

          {/* Selected Seats Display */}
          {selectedSeats.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Selected Seats:</span>
              {selectedSeats.map((seat) => (
                <Badge key={seat} variant="default">
                  {seat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedSeats.length === 0 || isLoading}>
            {isLoading ? "Confirming..." : `Confirm ${selectedSeats.length} Seat(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
