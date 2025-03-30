export const useLocalStorage = () => {
    const setItem = (key, value) => {
        if (process.client) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }
  
    const getItem = (key) => {
        if (process.client) {
            const value = localStorage.getItem(key)
            
            return value ? JSON.parse(value) : null
        }

        return null
    }
  
    const removeItem = (key) => {
        if (process.client) {
            localStorage.setItem(key, '')
        }
    }
  
    return {
        setItem,
        getItem,
        removeItem
    }
  }