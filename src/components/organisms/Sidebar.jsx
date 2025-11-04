import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const Sidebar = ({ lists = [], taskCounts = {}, isOpen, onClose }) => {
  const location = useLocation()

  const navigationItems = [
    { 
      path: "", 
      label: "All Tasks", 
      icon: "List",
      count: taskCounts.all || 0
    },
    { 
      path: "today", 
      label: "Today", 
      icon: "Calendar",
      count: taskCounts.today || 0
    },
    { 
      path: "upcoming", 
      label: "Upcoming", 
      icon: "Clock",
      count: taskCounts.upcoming || 0
    }
  ]

  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/"
    }
    return location.pathname === `/${path}`
  }

  const isListActive = (listId) => {
    return location.pathname === `/list/${listId}`
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%"
        }}
        className="lg:translate-x-0 lg:static lg:h-auto fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                onClick={() => onClose?.()}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={item.icon} 
                    className={`w-4 h-4 ${
                      isActive(item.path) 
                        ? "text-white" 
                        : "text-slate-500 group-hover:text-slate-700"
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <Badge 
                    className={
                      isActive(item.path)
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {item.count}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Lists Section */}
          <div>
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Lists
              </h3>
            </div>
            
            <div className="space-y-1">
              {lists.map((list) => (
                <Link
                  key={list.Id}
                  to={`/list/${list.Id}`}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isListActive(list.Id)
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="truncate">{list.name}</span>
                  </div>
                  {(taskCounts[`list_${list.Id}`] || 0) > 0 && (
                    <Badge 
                      className={
                        isListActive(list.Id)
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {taskCounts[`list_${list.Id}`] || 0}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Stay organized, stay productive
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar