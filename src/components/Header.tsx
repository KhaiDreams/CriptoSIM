'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/format'

interface HeaderProps {
  price: number | null
  previousPrice: number | null
  isLoading: boolean
  lastUpdated: Date | null
}

export function Header({ price, previousPrice, isLoading, lastUpdated }: HeaderProps) {
  const priceDirection = 
    price && previousPrice 
      ? price > previousPrice 
        ? 'up' 
        : price < previousPrice 
        ? 'down' 
        : 'neutral'
      : 'neutral'

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-gold via-accent-purple to-accent-blue flex items-center justify-center">
              <span className="text-xl sm:text-2xl">₿</span>
            </div>
            <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent-gold via-accent-purple to-accent-blue blur-lg opacity-50" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              CryptoSim
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              Trading Simulator
            </p>
          </div>
        </motion.div>

        {/* Live BTC Price */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card px-4 py-2 sm:px-6 sm:py-3 rounded-2xl flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-accent-green'}`} />
              <div className={`absolute inset-0 w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-accent-green'} animate-ping`} />
            </div>
            <span className="text-xs sm:text-sm text-gray-400">BTC/USDT</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isLoading && !price ? (
              <div className="h-6 w-24 bg-dark-600 rounded animate-pulse" />
            ) : (
              <motion.span
                key={price}
                initial={{ opacity: 0, y: priceDirection === 'up' ? 10 : priceDirection === 'down' ? -10 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-lg sm:text-xl font-bold ${
                  priceDirection === 'up'
                    ? 'text-accent-green'
                    : priceDirection === 'down'
                    ? 'text-accent-red'
                    : 'text-white'
                }`}
              >
                {price ? formatCurrency(price, 2) : '--'}
              </motion.span>
            )}
            
            {priceDirection !== 'neutral' && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-sm ${
                  priceDirection === 'up' ? 'text-accent-green' : 'text-accent-red'
                }`}
              >
                {priceDirection === 'up' ? '↑' : '↓'}
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  )
}
