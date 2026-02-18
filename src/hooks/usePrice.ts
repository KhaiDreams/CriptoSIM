'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UsePriceReturn {
  price: number | null
  previousPrice: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

interface BinanceResponse {
  symbol: string
  price: string
}

const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
const FETCH_INTERVAL = 12000 // 12 seconds (between 10-15 seconds as specified)
const STORAGE_KEY = 'cryptosim_last_price'

/**
 * Custom hook for fetching real-time BTC price from Binance API
 * Features: polling, error handling, fallback to last valid price
 */
export function usePrice(): UsePriceReturn {
  const [price, setPrice] = useState<number | null>(null)
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get fallback price from localStorage
  const getFallbackPrice = useCallback((): number | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.price || null
      }
    } catch {
      // Silent fail
    }
    return null
  }, [])

  // Save price to localStorage
  const savePriceToStorage = useCallback((priceValue: number) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ price: priceValue, timestamp: Date.now() })
      )
    } catch {
      // Silent fail
    }
  }, [])

  // Fetch price from Binance API
  const fetchPrice = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(BINANCE_API_URL, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: BinanceResponse = await response.json()
      const newPrice = parseFloat(data.price)

      if (isNaN(newPrice) || newPrice <= 0) {
        throw new Error('Invalid price received')
      }

      // Update previous price before setting new price
      setPrice((currentPrice) => {
        if (currentPrice !== null) {
          setPreviousPrice(currentPrice)
        }
        return newPrice
      })

      savePriceToStorage(newPrice)
      setLastUpdated(new Date())
      setError(null)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch price'
      setError(errorMessage)

      // Use fallback price if available
      const fallback = getFallbackPrice()
      if (fallback && price === null) {
        setPrice(fallback)
      }

      setIsLoading(false)
    }
  }, [getFallbackPrice, savePriceToStorage, price])

  // Initial fetch and polling setup
  useEffect(() => {
    // Initial fetch
    fetchPrice()

    // Set up polling interval
    intervalRef.current = setInterval(fetchPrice, FETCH_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchPrice()
  }, [fetchPrice])

  return {
    price,
    previousPrice,
    isLoading,
    error,
    lastUpdated,
    refetch,
  }
}
