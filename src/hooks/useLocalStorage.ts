'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for localStorage persistence with SSR safety
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize with a function to avoid SSR issues
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    setIsHydrated(true)
  }, [key])

  // Memoized setter function
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          return valueToStore
        })
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  return [isHydrated ? storedValue : initialValue, setValue]
}
