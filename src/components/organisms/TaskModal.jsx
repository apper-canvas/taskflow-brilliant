import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import DatePicker from "@/components/molecules/DatePicker"

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  lists = []
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: null,
    listId: lists[0]?.Id || ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "",
        dueDate: task.dueDate || null,
        listId: task.listId || lists[0]?.Id || ""
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "",
        dueDate: null,
        listId: lists[0]?.Id || ""
      })
    }
    setErrors({})
  }, [task, lists, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    
    if (!formData.listId) {
      newErrors.listId = "Please select a list"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      }

      await onSave?.(taskData)
      
      toast.success(task ? "Task updated successfully!" : "Task created successfully!")
      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task. Please try again.")
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title..."
              error={errors.title}
              autoFocus
            />

            <Textarea
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="">No Priority</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>

              <Select
                label="List"
                value={formData.listId}
                onChange={(e) => handleChange("listId", e.target.value)}
                error={errors.listId}
              >
                {lists.map(list => (
                  <option key={list.Id} value={list.Id}>
                    {list.name}
                  </option>
                ))}
              </Select>
            </div>

            <DatePicker
              value={formData.dueDate}
              onChange={(date) => handleChange("dueDate", date)}
              placeholder="Select due date (optional)"
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal