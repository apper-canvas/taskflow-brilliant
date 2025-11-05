import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class ListService {
  constructor() {
    this.tableName = 'list_c'
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      // Transform database fields to UI format
      return response.data.map(list => ({
        Id: list.Id,
        name: list.name_c || '',
        color: list.color_c || '#6366f1',
        order: list.order_c || 0,
        createdAt: list.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching lists:", error?.response?.data?.message || error)
      toast.error("Failed to load lists")
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
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
      const list = response.data
      return {
        Id: list.Id,
        name: list.name_c || '',
        color: list.color_c || '#6366f1',
        order: list.order_c || 0,
        createdAt: list.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching list ${Id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load list")
      return null
    }
  }

  async create(listData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Get current lists to determine order
      const currentLists = await this.getAll()
      const maxOrder = currentLists.length > 0 ? Math.max(...currentLists.map(l => l.order || 0)) : 0

      const params = {
        records: [{
          name_c: listData.name || '',
          color_c: listData.color || '#6366f1',
          order_c: maxOrder + 1
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
          console.error(`Failed to create ${failed.length} lists:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const createdList = successful[0].data
          toast.success("List created successfully")
          
          // Transform to UI format
          return {
            Id: createdList.Id,
            name: createdList.name_c || '',
            color: createdList.color_c || '#6366f1',
            order: createdList.order_c || 0,
            createdAt: createdList.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating list:", error?.response?.data?.message || error)
      toast.error("Failed to create list")
      return null
    }
  }

  async update(Id, listData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const updateData = {}
      if (listData.name !== undefined) updateData.name_c = listData.name
      if (listData.color !== undefined) updateData.color_c = listData.color
      if (listData.order !== undefined) updateData.order_c = listData.order

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
          console.error(`Failed to update ${failed.length} lists:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          const updatedList = successful[0].data
          toast.success("List updated successfully")
          
          // Transform to UI format
          return {
            Id: updatedList.Id,
            name: updatedList.name_c || '',
            color: updatedList.color_c || '#6366f1',
            order: updatedList.order_c || 0,
            createdAt: updatedList.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating list:", error?.response?.data?.message || error)
      toast.error("Failed to update list")
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
          console.error(`Failed to delete ${failed.length} lists:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }

        if (successful.length > 0) {
          toast.success("List deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting list:", error?.response?.data?.message || error)
      toast.error("Failed to delete list")
      return false
    }
  }

  async reorder(listIds) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const updateRecords = listIds.map((Id, index) => ({
        Id: Id,
        order_c: index + 1
      }))

      const params = {
        records: updateRecords
      }

      const response = await apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return await this.getAll()
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to reorder ${failed.length} lists:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        } else {
          toast.success("Lists reordered successfully")
        }
      }

      return await this.getAll()
    } catch (error) {
      console.error("Error reordering lists:", error?.response?.data?.message || error)
      toast.error("Failed to reorder lists")
      return await this.getAll()
    }
  }
}

export const listService = new ListService()