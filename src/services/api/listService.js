import mockLists from "@/services/mockData/lists.json"
import { saveToStorage, loadFromStorage } from "@/utils/localStorage"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ListService {
  constructor() {
    this.lists = loadFromStorage("LISTS", mockLists)
  }

  async getAll() {
    await delay(200)
    return [...this.lists].sort((a, b) => a.order - b.order)
  }

  async getById(Id) {
    await delay(150)
    const list = this.lists.find(l => l.Id === Id)
    if (!list) {
      throw new Error(`List with Id ${Id} not found`)
    }
    return { ...list }
  }

  async create(listData) {
    await delay(300)
    
    const highestId = this.lists.length > 0 
      ? Math.max(...this.lists.map(l => l.Id))
      : 0
    
    const newList = {
      Id: highestId + 1,
      name: listData.name,
      color: listData.color || "#6366f1",
      order: this.lists.length + 1,
      createdAt: new Date().toISOString()
    }
    
    this.lists.push(newList)
    saveToStorage("LISTS", this.lists)
    
    return { ...newList }
  }

  async update(Id, listData) {
    await delay(250)
    
    const index = this.lists.findIndex(l => l.Id === Id)
    if (index === -1) {
      throw new Error(`List with Id ${Id} not found`)
    }
    
    const updatedList = {
      ...this.lists[index],
      ...listData,
      Id // Ensure Id doesn't change
    }
    
    this.lists[index] = updatedList
    saveToStorage("LISTS", this.lists)
    
    return { ...updatedList }
  }

  async delete(Id) {
    await delay(200)
    
    const index = this.lists.findIndex(l => l.Id === Id)
    if (index === -1) {
      throw new Error(`List with Id ${Id} not found`)
    }
    
    const deletedList = this.lists.splice(index, 1)[0]
    saveToStorage("LISTS", this.lists)
    
    return { ...deletedList }
  }

  async reorder(listIds) {
    await delay(300)
    
    listIds.forEach((Id, index) => {
      const list = this.lists.find(l => l.Id === Id)
      if (list) {
        list.order = index + 1
      }
    })
    
    saveToStorage("LISTS", this.lists)
    return this.getAll()
  }
}

export const listService = new ListService()