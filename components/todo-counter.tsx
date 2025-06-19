"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Maximize2, Minimize2, X } from "lucide-react"
import type { Todo } from "@/app/page"
import { useState, useEffect } from "react"

interface TodoCounterProps {
  todo: Todo
  onUpdateCount: (id: string, newCount: number) => void
  onClose?: () => void
}

export default function TodoCounter({ todo, onUpdateCount, onClose }: TodoCounterProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const progressPercentage = (todo.currentCount / todo.targetCount) * 100
  const isCompleted = todo.currentCount >= todo.targetCount

  const handleDecrease = async () => {
    if (todo.currentCount > 0 && !isUpdating) {
      setIsUpdating(true)
      onUpdateCount(todo.id, todo.currentCount - 1)
      setTimeout(() => setIsUpdating(false), 100)
    }
  }

  const handleIncrease = async () => {
    if (!isUpdating) {
      setIsUpdating(true)
      onUpdateCount(todo.id, todo.currentCount + 1)
      setTimeout(() => setIsUpdating(false), 100)
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    window.addEventListener('keydown', handleEscKey)
    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [isFullScreen])

  // Prevent body scrolling when in full screen
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullScreen])

  const counterContent = (
    <div className={`text-center space-y-4 sm:space-y-6 ${isFullScreen ? 'max-w-md mx-auto' : ''}`}>
      {/* Todo Info - Mobile Optimized */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-1 sm:mb-2 break-words">{todo.name}</h3>
        <p className="text-sm sm:text-base text-purple-600">Target: {todo.targetCount}</p>
      </div>

      {/* Progress Circle - Responsive Size */}
      <div className={`relative mx-auto ${isFullScreen ? 'w-40 h-40 sm:w-48 sm:h-48' : 'w-24 h-24 sm:w-32 sm:h-32'}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={isCompleted ? "#10b981" : "#8b5cf6"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(progressPercentage, 100) / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-gray-800 ${isFullScreen ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-2xl'}`}>
            {Math.round(Math.min(progressPercentage, 100))}%
          </span>
        </div>
      </div>

      {/* Current Count Display - Mobile Optimized */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <p className="text-xs sm:text-sm text-gray-600 mb-2">Current Progress</p>
        <div
          className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-200 ${
            isUpdating ? "scale-110 text-purple-600" : "text-gray-800"
          } ${isFullScreen ? 'text-5xl sm:text-6xl' : ''}`}
        >
          {todo.currentCount}
        </div>

        {/* Counter Controls - Mobile-First Design */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
          <Button
            onClick={handleDecrease}
            disabled={todo.currentCount <= 0 || isUpdating}
            size="lg"
            className={`w-16 h-16 sm:w-14 sm:h-14 rounded-full transition-all duration-200 touch-manipulation ${
              isFullScreen ? 'sm:w-20 sm:h-20' : ''
            } ${
              todo.currentCount <= 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95"
            }`}
          >
            <Minus className={`w-6 h-6 sm:w-6 sm:h-6 ${isFullScreen ? 'sm:w-8 sm:h-8' : ''}`} />
          </Button>

          <div className="text-center px-2 sm:px-4 min-w-[80px] sm:min-w-[100px]">
            <div className="text-sm sm:text-lg font-medium text-gray-600">Monitor</div>
            <div className="text-xs sm:text-sm text-gray-500">Progress</div>
          </div>

          <Button
            onClick={handleIncrease}
            disabled={isUpdating}
            size="lg"
            className={`w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation ${
              isFullScreen ? 'sm:w-20 sm:h-20' : ''
            }`}
          >
            <Plus className={`w-6 h-6 sm:w-6 sm:h-6 ${isFullScreen ? 'sm:w-8 sm:h-8' : ''}`} />
          </Button>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="flex justify-center gap-2 sm:gap-3">
          <Button
            onClick={() => onUpdateCount(todo.id, 0)}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-3 py-2 touch-manipulation"
            disabled={todo.currentCount === 0}
          >
            Reset
          </Button>
          <Button
            onClick={() => onUpdateCount(todo.id, todo.targetCount)}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-3 py-2 touch-manipulation"
            disabled={todo.currentCount === todo.targetCount}
          >
            Complete
          </Button>
        </div>
      </div>

      {/* Progress Details - Mobile Responsive */}
      <div className="bg-white border rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <span className="block text-gray-600 text-xs sm:text-sm">Remaining</span>
            <span className="block font-semibold text-gray-800 text-lg sm:text-xl">
              {Math.max(0, todo.targetCount - todo.currentCount)}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-600 text-xs sm:text-sm">Progress</span>
            <span className="block font-semibold text-gray-800 text-lg sm:text-xl">
              {todo.currentCount}/{todo.targetCount}
            </span>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {isCompleted && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 animate-pulse">
          <p className="text-green-800 font-semibold text-sm sm:text-base">🎉 Congratulations!</p>
          <p className="text-green-700 text-xs sm:text-sm">You've reached your target count!</p>
        </div>
      )}

      {/* Motivational Messages - Mobile Optimized */}
      {!isCompleted && progressPercentage > 0 && (
        <div className="text-center px-2">
          {progressPercentage >= 75 && (
            <p className="text-purple-600 font-medium text-sm sm:text-base">Almost there! Keep going! 💪</p>
          )}
          {progressPercentage >= 50 && progressPercentage < 75 && (
            <p className="text-blue-600 font-medium text-sm sm:text-base">Great progress! You're halfway there! 🚀</p>
          )}
          {progressPercentage < 50 && progressPercentage > 0 && (
            <p className="text-gray-600 font-medium text-sm sm:text-base">Good start! Keep it up! ⭐</p>
          )}
        </div>
      )}

      {/* Full Screen Toggle Button */}
      <div className="flex justify-center mt-2">
        <Button
          onClick={toggleFullScreen}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          {isFullScreen ? (
            <>
              <Minimize2 className="w-4 h-4 mr-1" />
              Exit Focus Mode
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 mr-1" />
              Focus Mode
            </>
          )}
        </Button>
      </div>
    </div>
  )

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col">
        <div className="flex justify-end mb-2">
          <Button
            onClick={toggleFullScreen}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <X className="w-5 h-5 mr-1" />
            Close Focus Mode
          </Button>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          {counterContent}
        </div>
      </div>
    )
  }

  return counterContent
}
