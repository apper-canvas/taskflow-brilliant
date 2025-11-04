import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { groupTasksByDate } from "@/utils/dateUtils"
import { taskService } from "@/services/api/taskService"
import Header from "@/components/organisms/Header"
import TaskCard from "@/components/organisms/TaskCard"
import TaskModal from "@/components/organisms/TaskModal"
import QuickAddTask from "@/components/organisms/QuickAddTask"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const UpcomingTasks = () => {
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
      
      // Add list name to tasks for display
      const tasksWithListNames = data.map(task => ({
        ...task,
        listName: lists.find(list => list.Id === task.listId)?.name || "Unknown"
      }))
      
      setTasks(tasksWithListNames)
    } catch (err) {
      console.error("Error loading upcoming tasks:", err)
      setError("Failed to load upcoming tasks")
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

  const groupedTasks = groupTasksByDate(filteredTasks)

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
          title="Upcoming"
          subtitle="Plan ahead with your upcoming tasks"
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
          title="Upcoming"
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

  const getGroupInfo = (groupKey) => {
    switch (groupKey) {
      case "overdue":
        return { icon: "AlertTriangle", label: "Overdue", color: "text-red-600" }
      case "today":
        return { icon: "Calendar", label: "Today", color: "text-blue-600" }
      case "tomorrow":
        return { icon: "Clock", label: "Tomorrow", color: "text-green-600" }
      case "thisWeek":
        return { icon: "CalendarDays", label: "This Week", color: "text-purple-600" }
      case "later":
        return { icon: "Calendar", label: "Later", color: "text-slate-600" }
      default:
        return { icon: "Calendar", label: groupKey, color: "text-slate-600" }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Upcoming"
        subtitle={`${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'} scheduled`}
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-end">
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
              title="No upcoming tasks"
              description="Schedule some tasks to stay organized"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
                if (groupTasks.length === 0) return null
                
                const groupInfo = getGroupInfo(groupKey)
                
                return (
                  <motion.div
                    key={groupKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={groupInfo.icon} 
                        className={`w-5 h-5 ${groupInfo.color}`} 
                      />
                      <h2 className={`text-lg font-semibold ${groupInfo.color}`}>
                        {groupInfo.label} ({groupTasks.length})
                      </h2>
                    </div>
                    
                    <div className="space-y-3">
                      {groupTasks.map((task) => (
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
                  </motion.div>
                )
              })}
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

export default UpcomingTasks