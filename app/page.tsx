"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TodoModal from "@/components/todo-modal"
import TodoList from "@/components/todo-list"
import TodoCounter from "@/components/todo-counter"

export interface Todo {
  id: string
  name: string
  targetCount: number
  currentCount: number
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (name: string, targetCount: number) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      name,
      targetCount,
      currentCount: 0,
    }
    setTodos((prev) => [...prev, newTodo])
    setIsModalOpen(false)
  }

  const updateTodoCount = (id: string, newCount: number) => {
    const clampedCount = Math.max(0, newCount)
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, currentCount: clampedCount } : todo)))

    // Update selectedTodo if it's the one being modified
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, currentCount: clampedCount } : null))
    }
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    if (selectedTodo?.id === id) {
      setSelectedTodo(null)
    }
  }

  const selectTodo = (todo: Todo) => {
    setSelectedTodo(todo)
  }

  // Keep selectedTodo in sync with todos array
  useEffect(() => {
    if (selectedTodo) {
      const updatedTodo = todos.find((todo) => todo.id === selectedTodo.id)
      if (updatedTodo) {
        setSelectedTodo(updatedTodo)
      }
    }
  }, [todos, selectedTodo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Mobile-Optimized Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tasbih Counter</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 text-base font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            New To Do
          </Button>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Todo List - Full width on mobile, left column on desktop */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Your Todos</h2>
            <TodoList todos={todos} selectedTodo={selectedTodo} onSelectTodo={selectTodo} onDeleteTodo={deleteTodo} />
          </div>

          {/* Counter Section - Full width on mobile, right column on desktop */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Counter</h2>
              {selectedTodo && (
                <Button variant="outline" size="sm" onClick={() => setSelectedTodo(null)} className="lg:hidden text-xs">
                  Close
                </Button>
              )}
            </div>
            {selectedTodo ? (
              <TodoCounter todo={selectedTodo} onUpdateCount={updateTodoCount} />
            ) : (
              <div className="text-center text-gray-500 py-8 sm:py-12">
                <p className="text-base sm:text-lg">Select a todo to start counting</p>
                <p className="text-sm mt-2">Tap on any todo from the list above</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addTodo} />
      </div>
    </div>
  )
}
