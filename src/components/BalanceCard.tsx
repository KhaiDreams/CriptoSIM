'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatBTC } from '@/utils/format'

interface BalanceCardProps {
  balance: number
  btcAmount: number
  btcPrice: number | null
  isLoading: boolean
}

export function BalanceCard({ balance, btcAmount, btcPrice, isLoading }: BalanceCardProps) {
  const btcValueInUSD = btcPrice ? btcAmount * btcPrice : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* USD Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <span className="text-xl">💵</span>
          </div>
          <p className="text-sm text-gray-400">USD Balance</p>
        </div>
        
        {isLoading ? (
          <div className="h-8 w-32 bg-dark-600 rounded animate-pulse" />
        ) : (
          <motion.p
            key={balance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            {formatCurrency(balance)}
          </motion.p>
        )}
      </motion.div>

      {/* BTC Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
            <span className="text-xl">₿</span>
          </div>
          <p className="text-sm text-gray-400">BTC Holdings</p>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-40 bg-dark-600 rounded animate-pulse" />
            <div className="h-4 w-24 bg-dark-600 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <motion.p
              key={btcAmount}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-white"
            >
              {formatBTC(btcAmount)} BTC
            </motion.p>
            {btcAmount > 0 && btcPrice && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400 mt-1"
              >
                ≈ {formatCurrency(btcValueInUSD)}
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
