import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { taskService } from "@/services/api/taskService"
import Header from "@/components/organisms/Header"
import TaskCard from "@/components/organisms/TaskCard"
import TaskModal from "@/components/organisms/TaskModal"
import QuickAddTask from "@/components/organisms/QuickAddTask"
import FilterBar from "@/components/molecules/FilterBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const AllTasks = () => {
  const { lists, onMenuToggle, refreshData } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    priority: "",
    listId: "",
    dueDate: ""
  })
  const [showCompleted, setShowCompleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await taskService.getAll()
      
      // Add list name to tasks for display
      const tasksWithListNames = data.map(task => ({
        ...task,
        listName: lists.find(list => list.Id === task.listId)?.name || "Unknown"
      }))
      
      setTasks(tasksWithListNames)
    } catch (err) {
      console.error("Error loading tasks:", err)
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lists.length > 0) {
      loadTasks()
    }
  }, [lists])

  const filteredTasks = tasks.filter(task => {
    // Show/hide completed tasks
    if (!showCompleted && task.completed) return false

    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) return false

    // List filter
    if (filters.listId && task.listId !== parseInt(filters.listId)) return false

    // Due date filter
    if (filters.dueDate) {
      const today = new Date()
      const taskDate = task.dueDate ? new Date(task.dueDate) : null
      
      switch (filters.dueDate) {
        case "overdue":
          if (!taskDate || taskDate >= today) return false
          break
        case "today":
          if (!taskDate || taskDate.toDateString() !== today.toDateString()) return false
          break
        case "tomorrow":
          const tomorrow = new Date(today)
          tomorrow.setDate(today.getDate() + 1)
          if (!taskDate || taskDate.toDateString() !== tomorrow.toDateString()) return false
          break
        case "week":
          const weekEnd = new Date(today)
          weekEnd.setDate(today.getDate() + 7)
          if (!taskDate || taskDate > weekEnd || taskDate < today) return false
          break
      }
    }

    return true
  })

  const handleAddTask = async (taskData) => {
    try {
      await taskService.create(taskData)
      await loadTasks()
      await refreshData()
    } catch (error) {
      console.error("Error adding task:", error)
      throw error
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      if (!task) return

      await taskService.update(taskId, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      })
      
      await loadTasks()
      await refreshData()
      
      if (!task.completed) {
        toast.success("Task completed! 🎉")
      }
    } catch (error) {
      console.error("Error toggling task:", error)
      toast.error("Failed to update task")
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, {
          ...editingTask,
          ...taskData
        })
      } else {
        await taskService.create(taskData)
      }
      
      await loadTasks()
      await refreshData()
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
      throw error
    }
  }

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return
    }

    try {
      await taskService.delete(task.Id)
      await loadTasks()
      await refreshData()
      toast.success("Task deleted")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  if (loading) {
    return (
      <div className="h-full">
        <Header
          title="All Tasks"
          subtitle="Manage all your tasks in one place"
          onMenuToggle={onMenuToggle}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-4 lg:p-6">
          <Loading type="tasks" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full">
        <Header
          title="All Tasks"
          onMenuToggle={onMenuToggle}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-4 lg:p-6">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Header
        title="All Tasks"
        subtitle={`${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'} found`}
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        lists={lists}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
      />

      <div className="flex-1 p-4 lg:p-6 space-y-4">
        <QuickAddTask onAddTask={handleAddTask} lists={lists} />

        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <Empty
              type={searchQuery || Object.values(filters).some(f => f) ? "search" : "tasks"}
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  showList={true}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        task={editingTask}
        lists={lists}
      />
    </div>
  )
}

export default AllTasks