import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { formatDateRelative, getDueDateColor, isOverdue } from "@/utils/dateUtils"
import ApperIcon from "@/components/ApperIcon"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import PriorityIndicator from "@/components/molecules/PriorityIndicator"

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  showList = true 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    if (task.completed) {
      onToggleComplete?.(task.Id)
      return
    }

    setIsCompleting(true)
    
    // Delay to show animation
    setTimeout(() => {
      onToggleComplete?.(task.Id)
    }, 600)
  }

  const dueDateColor = getDueDateColor(task.dueDate)
  const taskIsOverdue = isOverdue(task.dueDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isCompleting ? 0.6 : 1, 
        y: 0,
        x: isCompleting ? -10 : 0
      }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group ${
        isCompleting ? "task-completing fade-out" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {task.priority && (
                  <PriorityIndicator priority={task.priority} size="sm" />
                )}
                <h3 className={`text-sm font-medium truncate ${
                  task.completed 
                    ? "text-slate-400 line-through" 
                    : "text-slate-800"
                }`}>
                  {task.title}
                </h3>
                {taskIsOverdue && !task.completed && (
                  <Badge variant="error" className="text-xs">
                    <ApperIcon name="AlertTriangle" className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>

              {task.description && (
                <p className={`text-sm mb-2 line-clamp-2 ${
                  task.completed ? "text-slate-400" : "text-slate-600"
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-2 text-xs">
                {task.dueDate && (
                  <Badge className={dueDateColor}>
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {formatDateRelative(task.dueDate)}
                  </Badge>
                )}
                
                {showList && task.listName && (
                  <Badge variant="default">
                    <ApperIcon name="Folder" className="w-3 h-3 mr-1" />
                    {task.listName}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="p-1 h-auto"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(task)}
                className="p-1 h-auto text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard