"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Target } from "lucide-react"
import type { Todo } from "@/app/page"

interface TodoListProps {
  todos: Todo[]
  selectedTodo: Todo | null
  onSelectTodo: (todo: Todo) => void
  onDeleteTodo: (id: string) => void
}

export default function TodoList({ todos, selectedTodo, onSelectTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 sm:py-8">
        <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
        <p className="text-base sm:text-lg">No todos yet</p>
        <p className="text-sm mt-2">Tap "New To Do" to create your first task</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
      {todos.map((todo) => {
        const progressPercentage = Math.min((todo.currentCount / todo.targetCount) * 100, 100)
        const isSelected = selectedTodo?.id === todo.id
        const isCompleted = todo.currentCount >= todo.targetCount

        return (
          <div
            key={todo.id}
            className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 touch-manipulation ${
              isSelected
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm active:bg-purple-100"
            } ${isCompleted ? "ring-2 ring-green-200" : ""}`}
            onClick={() => onSelectTodo(todo)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold text-base sm:text-lg truncate ${isCompleted ? "text-green-700" : "text-gray-800"}`}
                  >
                    {todo.name}
                  </h3>
                  {isCompleted && <span className="text-green-500 flex-shrink-0">✅</span>}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Target: {todo.targetCount} | Current: {todo.currentCount}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTodo(todo.id)
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 p-2 touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar - Mobile Optimized */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div
                className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-green-500" : "bg-purple-600"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className={isCompleted ? "text-green-600 font-semibold" : ""}>
                {Math.round(progressPercentage)}% complete
              </span>
              <span>
                {todo.currentCount}/{todo.targetCount}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
