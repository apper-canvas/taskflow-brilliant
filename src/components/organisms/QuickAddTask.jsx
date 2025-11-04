import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"

const QuickAddTask = ({ onAddTask, lists = [] }) => {
  const [title, setTitle] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }

    try {
      await onAddTask?.({
        title: title.trim(),
        description: "",
        priority: "",
        dueDate: null,
        listId: lists[0]?.Id || ""
      })
      
      setTitle("")
      setIsExpanded(false)
      toast.success("Task added successfully!")
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task. Please try again.")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setTitle("")
      setIsExpanded(false)
    }
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-lg border border-slate-200 shadow-sm"
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 text-left flex items-center space-x-3 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add a task...</span>
        </button>
      ) : (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="p-4"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              autoFocus
              className="border-0 shadow-none p-0 text-base placeholder:text-slate-400 focus:ring-0"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Could open detailed modal here
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Could set priority here
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="Flag" className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTitle("")
                    setIsExpanded(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!title.trim()}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  )
}

export default QuickAddTask