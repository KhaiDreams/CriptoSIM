'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Time } from 'lightweight-charts'

export interface CandlestickData {
  time: Time
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface UseKlinesReturn {
  klines: CandlestickData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const BINANCE_KLINES_URL = 'https://api.binance.com/api/v3/klines'
const FETCH_INTERVAL = 15000 // 15 seconds

/**
 * Custom hook for fetching candlestick data from Binance API
 * Fetches 1-minute klines for the last hour
 */
export function useKlines(): UseKlinesReturn {
  const [klines, setKlines] = useState<CandlestickData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchKlines = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      // Fetch 60 1-minute candles (1 hour of data)
      const response = await fetch(
        `${BINANCE_KLINES_URL}?symbol=BTCUSDT&interval=1m&limit=60`,
        {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Parse Binance kline data
      // [openTime, open, high, low, close, volume, closeTime, ...]
      const parsed: CandlestickData[] = data.map((kline: (string | number)[]) => ({
        time: Math.floor(Number(kline[0]) / 1000) as Time, // Convert to seconds for lightweight-charts
        open: parseFloat(String(kline[1])),
        high: parseFloat(String(kline[2])),
        low: parseFloat(String(kline[3])),
        close: parseFloat(String(kline[4])),
        volume: parseFloat(String(kline[5])),
      }))

      setKlines(parsed)
      setError(null)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch klines'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKlines()
    intervalRef.current = setInterval(fetchKlines, FETCH_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchKlines])

  return { klines, isLoading, error, refetch: fetchKlines }
}
