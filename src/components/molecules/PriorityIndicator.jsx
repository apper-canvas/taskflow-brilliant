import { cn } from "@/utils/cn"

const PriorityIndicator = ({ priority, size = "sm", showLabel = false }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "priority-high",
          label: "High",
          textColor: "text-pink-700"
        }
      case "medium":
        return {
          color: "priority-medium",
          label: "Medium", 
          textColor: "text-purple-700"
        }
      case "low":
        return {
          color: "priority-low",
          label: "Low",
          textColor: "text-blue-700"
        }
      default:
        return null
    }
  }

  const config = getPriorityConfig(priority)
  
  if (!config) return null

  const sizeClasses = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  return (
    <div className="flex items-center space-x-1">
      <div 
        className={cn(
          "rounded-full shadow-sm",
          config.color,
          sizeClasses[size]
        )}
      />
      {showLabel && (
        <span className={cn("text-xs font-medium", config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

export default PriorityIndicator