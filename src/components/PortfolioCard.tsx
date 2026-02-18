'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatPercentage } from '@/utils/format'

interface PortfolioCardProps {
  portfolioValue: number
  profitLoss: number
  profitLossPercentage: number
  isProfitable: boolean
  isLoading: boolean
}

export function PortfolioCard({
  portfolioValue,
  profitLoss,
  profitLossPercentage,
  isProfitable,
  isLoading,
}: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 opacity-20 blur-3xl ${
          isProfitable
            ? 'bg-gradient-to-br from-accent-green/30 to-transparent'
            : 'bg-gradient-to-br from-accent-red/30 to-transparent'
        }`}
      />

      <div className="relative z-10">
        <p className="text-sm sm:text-base text-gray-400 mb-2">Portfolio Value</p>

        {isLoading ? (
          <div className="h-12 w-48 bg-dark-600 rounded-lg animate-pulse mb-4" />
        ) : (
          <motion.h2
            key={portfolioValue}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {formatCurrency(portfolioValue)}
          </motion.h2>
        )}

        {/* Profit/Loss indicator */}
        <div className="flex items-center gap-3 flex-wrap">
          {isLoading ? (
            <div className="h-8 w-32 bg-dark-600 rounded-lg animate-pulse" />
          ) : (
            <>
              <motion.div
                key={profitLoss}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-2 ${
                  isProfitable
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-accent-red/20 text-accent-red'
                }`}
              >
                <span className="text-lg">{isProfitable ? '↑' : '↓'}</span>
                <span className="font-semibold">
                  {isProfitable ? '+' : ''}
                  {formatCurrency(profitLoss)}
                </span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm font-medium ${
                  isProfitable ? 'text-accent-green' : 'text-accent-red'
                }`}
              >
                {formatPercentage(profitLossPercentage)}
              </motion.span>
            </>
          )}
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500 mt-4">
          Starting balance: $10,000.00
        </p>
      </div>
    </motion.div>
  )
}
