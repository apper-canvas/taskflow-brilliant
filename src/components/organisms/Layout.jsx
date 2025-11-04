import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "@/components/organisms/Sidebar"
import { listService } from "@/services/api/listService"
import { taskService } from "@/services/api/taskService"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lists, setLists] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [listsData, tasksData] = await Promise.all([
        listService.getAll(),
        taskService.getAll()
      ])
      
      setLists(listsData)
      
      // Calculate task counts
      const incompleteTasks = tasksData.filter(task => !task.completed)
      
      const counts = {
        all: incompleteTasks.length,
        today: incompleteTasks.filter(task => {
          if (!task.dueDate) return false
          const today = new Date()
          const taskDate = new Date(task.dueDate)
          return taskDate.toDateString() === today.toDateString()
        }).length,
        upcoming: incompleteTasks.filter(task => {
          if (!task.dueDate) return false
          const today = new Date()
          const taskDate = new Date(task.dueDate)
          return taskDate > today
        }).length
      }
      
      // Add list-specific counts
      listsData.forEach(list => {
        counts[`list_${list.Id}`] = incompleteTasks.filter(task => task.listId === list.Id).length
      })
      
      setTaskCounts(counts)
    } catch (err) {
      console.error("Error loading layout data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} type="page" />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <Sidebar
          lists={lists}
          taskCounts={taskCounts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <Outlet context={{ 
            lists, 
            taskCounts, 
            onMenuToggle: () => setSidebarOpen(!sidebarOpen),
            refreshData: loadData
          }} />
        </motion.main>
      </div>
    </div>
  )
}

export default Layout