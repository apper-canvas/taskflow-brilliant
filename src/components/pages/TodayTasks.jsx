import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { isToday, isPast, startOfDay } from "date-fns"
import { taskService } from "@/services/api/taskService"
import Header from "@/components/organisms/Header"
import TaskCard from "@/components/organisms/TaskCard"
import TaskModal from "@/components/organisms/TaskModal"
import QuickAddTask from "@/components/organisms/QuickAddTask"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const TodayTasks = () => {
  const { lists, onMenuToggle, refreshData } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCompleted, setShowCompleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await taskService.getAll()
      
      // Filter for today's tasks and overdue tasks
      const todayTasks = data.filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return isToday(taskDate) || (isPast(startOfDay(taskDate)) && !task.completed)
      })
      
      // Add list name to tasks for display
      const tasksWithListNames = todayTasks.map(task => ({
        ...task,
        listName: lists.find(list => list.Id === task.listId)?.name || "Unknown"
      }))
      
      // Sort: overdue first, then by priority
      const sortedTasks = tasksWithListNames.sort((a, b) => {
        const aOverdue = isPast(startOfDay(new Date(a.dueDate))) && !isToday(new Date(a.dueDate))
        const bOverdue = isPast(startOfDay(new Date(b.dueDate))) && !isToday(new Date(b.dueDate))
        
        if (aOverdue && !bOverdue) return -1
        if (!aOverdue && bOverdue) return 1
        
        // Then by priority
        const priorityOrder = { high: 3, medium: 2, low: 1, "": 0 }
        return priorityOrder[b.priority || ""] - priorityOrder[a.priority || ""]
      })
      
      setTasks(sortedTasks)
    } catch (err) {
      console.error("Error loading today's tasks:", err)
      setError("Failed to load today's tasks")
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

    return true
  })

  // Group tasks
  const overdueTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    return isPast(startOfDay(taskDate)) && !isToday(taskDate)
  })

  const todayTasks = filteredTasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    return isToday(taskDate)
  })

  const handleAddTask = async (taskData) => {
    try {
      // Set due date to today for new tasks
      const taskWithDate = {
        ...taskData,
        dueDate: new Date().toISOString()
      }
      
      await taskService.create(taskWithDate)
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
          title="Today"
          subtitle="Focus on what's due today"
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
          title="Today"
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

  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.completed).length

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Today"
        subtitle={`${totalTasks} tasks • ${completedTasks} completed`}
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Progress: {totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)}%
            </div>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: totalTasks === 0 ? "0%" : `${(completedTasks / totalTasks) * 100}%`
                }}
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              />
            </div>
          </div>

          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showCompleted
                ? "bg-primary-100 text-primary-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
            <span>Show Completed</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <QuickAddTask onAddTask={handleAddTask} lists={lists} />

        <AnimatePresence mode="wait">
          {totalTasks === 0 ? (
            <Empty
              type="tasks"
              title="No tasks for today"
              description="Add some tasks to get started with your day"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-6">
              {/* Overdue Tasks */}
              {overdueTasks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-red-700">
                      Overdue ({overdueTasks.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {overdueTasks.map((task) => (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        showList={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Today's Tasks */}
              {todayTasks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-slate-700">
                      Today ({todayTasks.length})
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        showList={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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

export default TodayTasks