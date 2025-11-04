import mockTasks from "@/services/mockData/tasks.json"
import { saveToStorage, loadFromStorage } from "@/utils/localStorage"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = loadFromStorage("TASKS", mockTasks)
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(Id) {
    await delay(200)
    const task = this.tasks.find(t => t.Id === Id)
    if (!task) {
      throw new Error(`Task with Id ${Id} not found`)
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    
    const highestId = this.tasks.length > 0 
      ? Math.max(...this.tasks.map(t => t.Id))
      : 0
    
    const newTask = {
      Id: highestId + 1,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "",
      dueDate: taskData.dueDate || null,
      completed: false,
      listId: taskData.listId,
      order: this.tasks.length + 1,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    
    this.tasks.push(newTask)
    saveToStorage("TASKS", this.tasks)
    
    return { ...newTask }
  }

  async update(Id, taskData) {
    await delay(350)
    
    const index = this.tasks.findIndex(t => t.Id === Id)
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`)
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      Id // Ensure Id doesn't change
    }
    
    this.tasks[index] = updatedTask
    saveToStorage("TASKS", this.tasks)
    
    return { ...updatedTask }
  }

  async delete(Id) {
    await delay(250)
    
    const index = this.tasks.findIndex(t => t.Id === Id)
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`)
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0]
    saveToStorage("TASKS", this.tasks)
    
    return { ...deletedTask }
  }

  async getByListId(listId) {
    await delay(300)
    return this.tasks.filter(task => task.listId === listId).map(task => ({ ...task }))
  }

  async getByStatus(completed = false) {
    await delay(300)
    return this.tasks.filter(task => task.completed === completed).map(task => ({ ...task }))
  }

  async markComplete(Id) {
    return this.update(Id, { 
      completed: true, 
      completedAt: new Date().toISOString() 
    })
  }

  async markIncomplete(Id) {
    return this.update(Id, { 
      completed: false, 
      completedAt: null 
    })
  }
}

export const taskService = new TaskService()