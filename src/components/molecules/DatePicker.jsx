import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const DatePicker = ({ value, onChange, placeholder = "Select date", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    onChange?.(date.toISOString())
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setSelectedDate(null)
    onChange?.(null)
  }

  const generateCalendar = () => {
    const today = new Date()
    const currentMonth = selectedDate || today
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return { days, year, month }
  }

  const { days, year, month } = generateCalendar()
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
          <span className={selectedDate ? "text-slate-900" : "text-slate-400"}>
            {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {selectedDate && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ApperIcon name="X" className="w-3 h-3" />
            </button>
          )}
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 w-72"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(selectedDate || new Date())
                  newDate.setMonth(newDate.getMonth() - 1)
                  setSelectedDate(newDate)
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4 text-slate-600" />
              </button>
              <h3 className="font-semibold text-slate-800">
                {monthNames[month]} {year}
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(selectedDate || new Date())
                  newDate.setMonth(newDate.getMonth() + 1)
                  setSelectedDate(newDate)
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                <div key={day} className="text-xs font-medium text-slate-500 text-center p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === month
                const isToday = day.toDateString() === new Date().toDateString()
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      "text-sm p-2 rounded hover:bg-slate-100 transition-colors",
                      !isCurrentMonth && "text-slate-300",
                      isCurrentMonth && "text-slate-700",
                      isToday && "bg-primary-100 text-primary-700 font-semibold",
                      isSelected && "bg-primary-500 text-white hover:bg-primary-600"
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleDateSelect(new Date())}
              >
                Today
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default DatePicker