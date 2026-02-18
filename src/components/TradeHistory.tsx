'use client'

import { motion } from 'framer-motion'
import { Trade } from '@/hooks/usePortfolio'
import { formatCurrency, formatBTC } from '@/utils/format'

interface TradeHistoryProps {
  trades: Trade[]
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
            <span className="text-sm">📜</span>
          </div>
          <h3 className="text-sm font-medium text-white">Trade History</h3>
        </div>
        <p className="text-center text-gray-500 py-8">
          No trades yet. Start trading to see your history!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center">
            <span className="text-sm">📜</span>
          </div>
          <h3 className="text-sm font-medium text-white">Trade History</h3>
        </div>
        <span className="text-xs text-gray-500">{trades.length} trades</span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {trades.map((trade, index) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-3 px-3 bg-dark-700/30 rounded-xl hover:bg-dark-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  trade.type === 'buy'
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-accent-red/20 text-accent-red'
                }`}
              >
                {trade.type === 'buy' ? '↓' : '↑'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {trade.type === 'buy' ? 'Bought' : 'Sold'} {formatBTC(trade.btcAmount)} BTC
                </p>
                <p className="text-xs text-gray-500">
                  @ {formatCurrency(trade.price)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  trade.type === 'buy' ? 'text-accent-red' : 'text-accent-green'
                }`}
              >
                {trade.type === 'buy' ? '-' : '+'}
                {formatCurrency(trade.usdAmount)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(trade.timestamp)} {formatTime(trade.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
