import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class TaskService {
  constructor() {
    this.tableName = 'task_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "list_id_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || '',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        listId: task.list_id_c?.Id || task.list_id_c,
        order: task.order_c || 0,
        completedAt: task.completed_at_c || null,
        createdAt: task.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      toast.error("Failed to load tasks")
      return []
    }
  }

  async getById(Id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "list_id_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, Id, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      // Transform database fields to UI format
      const task = response.data
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || '',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        listId: task.list_id_c?.Id || task.list_id_c,
        order: task.order_c || 0,
        completedAt: task.completed_at_c || null,
        createdAt: task.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching task ${Id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load task")
      return null
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Get current tasks to determine order
      const currentTasks = await this.getAll()
      const maxOrder = currentTasks.length > 0 ? Math.max(...currentTasks.map(t => t.order || 0)) : 0

      const params = {
        records: [{
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          priority_c: taskData.priority || '',
          due_date_c: taskData.dueDate || null,
          completed_c: false,
          list_id_c: parseInt(taskData.listId),
          order_c: maxOrder + 1,
          completed_at_c: null
        }]
      }

      const response = await apperClient.createRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const createdTask = successful[0].data
          toast.success("Task created successfully")
          
          // Transform to UI format
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || '',
            description: createdTask.description_c || '',
            priority: createdTask.priority_c || '',
            dueDate: createdTask.due_date_c || null,
            completed: createdTask.completed_c || false,
            listId: createdTask.list_id_c?.Id || createdTask.list_id_c,
            order: createdTask.order_c || 0,
            completedAt: createdTask.completed_at_c || null,
            createdAt: createdTask.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      toast.error("Failed to create task")
      return null
    }
  }

  async update(Id, taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const updateData = {}
      if (taskData.title !== undefined) updateData.title_c = taskData.title
      if (taskData.description !== undefined) updateData.description_c = taskData.description
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority
      if (taskData.dueDate !== undefined) updateData.due_date_c = taskData.dueDate
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed
      if (taskData.listId !== undefined) updateData.list_id_c = parseInt(taskData.listId)
      if (taskData.order !== undefined) updateData.order_c = taskData.order
      if (taskData.completedAt !== undefined) updateData.completed_at_c = taskData.completedAt

      const params = {
        records: [{
          Id: Id,
          ...updateData
        }]
      }

      const response = await apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data
          toast.success("Task updated successfully")
          
          // Transform to UI format
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || '',
            description: updatedTask.description_c || '',
            priority: updatedTask.priority_c || '',
            dueDate: updatedTask.due_date_c || null,
            completed: updatedTask.completed_c || false,
            listId: updatedTask.list_id_c?.Id || updatedTask.list_id_c,
            order: updatedTask.order_c || 0,
            completedAt: updatedTask.completed_at_c || null,
            createdAt: updatedTask.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      toast.error("Failed to update task")
      return null
    }
  }

  async delete(Id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = { 
        RecordIds: [Id]
      }

      const response = await apperClient.deleteRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          toast.success("Task deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      toast.error("Failed to delete task")
      return false
    }
  }

  async getByListId(listId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "list_id_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "list_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(listId)]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || '',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        listId: task.list_id_c?.Id || task.list_id_c,
        order: task.order_c || 0,
        completedAt: task.completed_at_c || null,
        createdAt: task.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching tasks by list ID:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByStatus(completed = false) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "list_id_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "completed_c",
          "Operator": "EqualTo",
          "Values": [completed]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || '',
        dueDate: task.due_date_c || null,
        completed: task.completed_c || false,
        listId: task.list_id_c?.Id || task.list_id_c,
        order: task.order_c || 0,
        completedAt: task.completed_at_c || null,
        createdAt: task.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error)
      return []
    }
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