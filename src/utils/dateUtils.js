import { format, isToday, isTomorrow, isThisWeek, isPast, startOfDay, addDays } from "date-fns"

export const formatDate = (date, formatStr = "MMM d") => {
  if (!date) return ""
  return format(new Date(date), formatStr)
}

export const formatDateRelative = (date) => {
  if (!date) return ""
  
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) return "Today"
  if (isTomorrow(dateObj)) return "Tomorrow"
  if (isThisWeek(dateObj)) return format(dateObj, "EEEE")
  
  return format(dateObj, "MMM d")
}

export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return "none"
  
  const date = new Date(dueDate)
  const today = startOfDay(new Date())
  const dueDateStart = startOfDay(date)
  
  if (dueDateStart < today) return "overdue"
  if (isToday(date)) return "today"
  if (isTomorrow(date)) return "tomorrow"
  
  return "upcoming"
}

export const getDueDateColor = (dueDate) => {
  const status = getDueDateStatus(dueDate)
  
  switch (status) {
    case "overdue":
      return "text-red-600 bg-red-50"
    case "today":
      return "text-orange-600 bg-orange-50"
    case "tomorrow":
      return "text-blue-600 bg-blue-50"
    case "upcoming":
      return "text-slate-600 bg-slate-50"
    default:
      return "text-slate-600 bg-slate-50"
  }
}

export const groupTasksByDate = (tasks) => {
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)
  const thisWeekEnd = addDays(today, 7)
  
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  }
  
  tasks.forEach(task => {
    if (!task.dueDate) {
      groups.later.push(task)
      return
    }
    
    const dueDate = startOfDay(new Date(task.dueDate))
    
    if (dueDate < today) {
      groups.overdue.push(task)
    } else if (dueDate.getTime() === today.getTime()) {
      groups.today.push(task)
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      groups.tomorrow.push(task)
    } else if (dueDate < thisWeekEnd) {
      groups.thisWeek.push(task)
    } else {
      groups.later.push(task)
    }
  })
  
  return groups
}

export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return isPast(startOfDay(new Date(dueDate))) && !isToday(new Date(dueDate))
}