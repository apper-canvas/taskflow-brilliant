import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  lists = [],
  showCompleted = false,
  onToggleCompleted 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange?.({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange?.({
      priority: "",
      listId: "",
      dueDate: ""
    })
  }

  const hasActiveFilters = Object.values(filters || {}).some(value => value !== "")

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 p-4"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filters:</span>
        </div>

        <Select
          value={filters?.priority || ""}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="w-32"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          value={filters?.listId || ""}
          onChange={(e) => handleFilterChange("listId", e.target.value)}
          className="w-32"
        >
          <option value="">All Lists</option>
          {lists.map(list => (
            <option key={list.Id} value={list.Id}>
              {list.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters?.dueDate || ""}
          onChange={(e) => handleFilterChange("dueDate", e.target.value)}
          className="w-32"
        >
          <option value="">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This Week</option>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={onToggleCompleted}
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
    </motion.div>
  )
}

export default FilterBar