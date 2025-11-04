import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "Plus",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks yet",
          description: "Create your first task to get organized and boost your productivity",
          actionLabel: "Add Task"
        }
      case "search":
        return {
          icon: "Search",
          title: "No tasks found",
          description: "Try adjusting your search terms or filters",
          actionLabel: "Clear Filters"
        }
      case "completed":
        return {
          icon: "Trophy",
          title: "No completed tasks",
          description: "Complete some tasks to see them here",
          actionLabel: null
        }
      default:
        return { icon, title, description, actionLabel }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={content.icon} className="w-10 h-10 text-slate-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-slate-700 mb-2"
      >
        {content.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-500 mb-6 max-w-sm"
      >
        {content.description}
      </motion.p>

      {content.actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onAction}>
            <ApperIcon name={content.icon} className="w-4 h-4 mr-2" />
            {content.actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Empty