'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatRelativeTime } from '@/utils/format'

interface PriceDisplayProps {
  price: number | null
  previousPrice: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function PriceDisplay({
  price,
  previousPrice,
  isLoading,
  error,
  lastUpdated,
}: PriceDisplayProps) {
  const priceChange = price && previousPrice ? price - previousPrice : 0
  const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0
  const isUp = priceChange > 0
  const isDown = priceChange < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
            <span className="text-xl font-bold text-white">₿</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Bitcoin Price</p>
            <p className="text-xs text-gray-500">BTC/USDT</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {error ? (
            <span className="text-xs text-accent-red">⚠️ Error</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-accent-green'}`}>
                {!isLoading && (
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-ping" />
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isLoading ? 'Updating...' : lastUpdated ? formatRelativeTime(lastUpdated) : 'Live'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Display */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        {isLoading && !price ? (
          <div className="h-10 w-40 bg-dark-600 rounded-lg animate-pulse" />
        ) : (
          <motion.div
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-3xl sm:text-4xl font-bold text-white">
              {price ? formatCurrency(price, 2) : '--'}
            </span>
          </motion.div>
        )}

        {/* Price change indicator */}
        {(isUp || isDown) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
              isUp
                ? 'bg-accent-green/10 text-accent-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}
          >
            <span>{isUp ? '↑' : '↓'}</span>
            <span>
              {isUp ? '+' : ''}
              {formatCurrency(priceChange, 2)}
            </span>
            <span className="text-xs opacity-70">
              ({priceChangePercent >= 0 ? '+' : ''}
              {priceChangePercent.toFixed(3)}%)
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
