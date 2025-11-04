import { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { taskService } from "@/services/api/taskService"
import Header from "@/components/organisms/Header"
import TaskCard from "@/components/organisms/TaskCard"
import TaskModal from "@/components/organisms/TaskModal"
import QuickAddTask from "@/components/organisms/QuickAddTask"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const ListView = () => {
  const { listId } = useParams()
  const { lists, onMenuToggle, refreshData } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCompleted, setShowCompleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const currentList = lists.find(list => list.Id === parseInt(listId))

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await taskService.getAll()
      
      // Filter tasks for current list
      const listTasks = data.filter(task => task.listId === parseInt(listId))
      
      // Sort by priority and creation date
      const sortedTasks = listTasks.sort((a, b) => {
        // Incomplete tasks first
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1
        }
        
        // Then by priority
        const priorityOrder = { high: 3, medium: 2, low: 1, "": 0 }
        const priorityDiff = priorityOrder[b.priority || ""] - priorityOrder[a.priority || ""]
        if (priorityDiff !== 0) return priorityDiff
        
        // Finally by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      
      setTasks(sortedTasks)
    } catch (err) {
      console.error("Error loading list tasks:", err)
      setError("Failed to load tasks for this list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lists.length > 0 && listId) {
      loadTasks()
    }
  }, [lists, listId])

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

  const handleAddTask = async (taskData) => {
    try {
      const taskWithList = {
        ...taskData,
        listId: parseInt(listId)
      }
      
      await taskService.create(taskWithList)
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
          ...taskData,
          listId: parseInt(listId) // Ensure task stays in current list
        })
      } else {
        await taskService.create({
          ...taskData,
          listId: parseInt(listId)
        })
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

  if (!currentList) {
    return (
      <div className="h-full">
        <Header
          title="List Not Found"
          onMenuToggle={onMenuToggle}
          showSearch={false}
          showAddButton={false}
        />
        <div className="p-4 lg:p-6">
          <Error message="The requested list could not be found." />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full">
        <Header
          title={currentList.name}
          subtitle="Loading tasks..."
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
          title={currentList.name}
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
        title={currentList.name}
        subtitle={`${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'} • ${completedTasks} completed`}
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentList.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {currentList.name}
              </span>
            </div>
            
            {totalTasks > 0 && (
              <>
                <div className="text-sm text-slate-600">
                  Progress: {Math.round((completedTasks / totalTasks) * 100)}%
                </div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(completedTasks / totalTasks) * 100}%`
                    }}
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  />
                </div>
              </>
            )}
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

      <div className="flex-1 p-4 lg:p-6 space-y-4">
        <QuickAddTask onAddTask={handleAddTask} lists={lists.filter(l => l.Id === parseInt(listId))} />

        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <Empty
              type={searchQuery ? "search" : "tasks"}
              title={`No tasks in ${currentList.name}`}
              description={searchQuery 
                ? "Try adjusting your search terms"
                : `Add your first task to ${currentList.name}`
              }
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
                  showList={false}
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
        lists={lists.filter(l => l.Id === parseInt(listId))}
      />
    </div>
  )
}

export default ListView