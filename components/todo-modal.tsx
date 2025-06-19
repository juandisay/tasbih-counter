"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TodoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, targetCount: number) => void
}

export default function TodoModal({ isOpen, onClose, onSubmit }: TodoModalProps) {
  const [name, setName] = useState("")
  const [count, setCount] = useState("")
  const [errors, setErrors] = useState<{ name?: string; count?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; count?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!count.trim()) {
      newErrors.count = "Count is required"
    } else if (isNaN(Number(count)) || Number(count) <= 0) {
      newErrors.count = "Count must be a positive number"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(name.trim(), Number(count))
      setName("")
      setCount("")
      setErrors({})
    }
  }

  const handleClose = () => {
    setName("")
    setCount("")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-purple-700">New To Do</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Task Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full h-12 text-base ${errors.name ? "border-red-500" : "border-purple-200 focus:border-purple-500"}`}
              autoFocus
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="count" className="text-sm font-medium text-gray-700">
              Target Count
            </Label>
            <Input
              id="count"
              type="number"
              placeholder="Enter target count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={`w-full h-12 text-base ${errors.count ? "border-red-500" : "border-purple-200 focus:border-purple-500"}`}
              min="1"
            />
            {errors.count && <p className="text-sm text-red-500">{errors.count}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto h-12 sm:h-10 border-gray-300 text-gray-700 hover:bg-gray-50 touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-12 sm:h-10 bg-purple-600 hover:bg-purple-700 text-white touch-manipulation"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
