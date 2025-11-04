import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

const Header = ({ 
  title = "All Tasks", 
  subtitle,
  onMenuToggle,
  onAddTask,
  searchValue = "",
  onSearchChange,
  showSearch = true,
  showAddButton = true
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {showAddButton && (
          <Button onClick={onAddTask} className="hidden sm:flex">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {showSearch && (
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search tasks..."
            />
          </div>
        </div>
      )}

      {/* Mobile Add Button */}
      {showAddButton && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTask}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg flex items-center justify-center z-30"
        >
          <ApperIcon name="Plus" className="w-6 h-6" />
        </motion.button>
      )}

      <Button onClick={() => {
        const data = [
          {
            "success": false,
            "message": "Failed to create 1 records: Error: You don't have permission to perform create operation."
          }
        ]

        console.error(data)
      }}>Permission</Button>
      <Button onClick={() => {
        const data = [
          {
            "success": false,
            "message": "Public profile not enabled for this app"
          }
        ]

        console.error(data)
      }}>Public Profile</Button>
      <Button onClick={() => {
        let abcd = {};
        console.error(abcd.length());
      }}>Error</Button>
    </motion.header>
  )
}

export default Header