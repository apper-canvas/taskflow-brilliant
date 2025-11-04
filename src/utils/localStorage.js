const STORAGE_KEYS = {
  TASKS: "taskflow_tasks",
  LISTS: "taskflow_lists",
  SETTINGS: "taskflow_settings"
}

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS[key])
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(STORAGE_KEYS[key])
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

// Initialize default data if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveToStorage("TASKS", [])
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.LISTS)) {
    const defaultLists = [
      {
        Id: 1,
        name: "Personal",
        color: "#6366f1",
        order: 1,
        createdAt: new Date().toISOString()
      },
      {
        Id: 2,
        name: "Work",
        color: "#8b5cf6",
        order: 2,
        createdAt: new Date().toISOString()
      }
    ]
    saveToStorage("LISTS", defaultLists)
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    const defaultSettings = {
      theme: "light",
      defaultList: 1,
      showCompleted: false
    }
    saveToStorage("SETTINGS", defaultSettings)
  }
}