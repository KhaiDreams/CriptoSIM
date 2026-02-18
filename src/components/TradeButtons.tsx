'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatBTC } from '@/utils/format'

interface TradeButtonsProps {
  onBuy: () => void
  onSell: () => void
  onReset: () => void
  canBuy: boolean
  canSell: boolean
  balance: number
  btcAmount: number
  btcPrice: number | null
}

export function TradeButtons({
  onBuy,
  onSell,
  onReset,
  canBuy,
  canSell,
  balance,
  btcAmount,
  btcPrice,
}: TradeButtonsProps) {
  const btcToBuy = btcPrice && balance > 0 ? balance / btcPrice : 0
  const usdToReceive = btcPrice && btcAmount > 0 ? btcAmount * btcPrice : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Buy Button */}
        <motion.button
          whileHover={canBuy ? { scale: 1.02 } : {}}
          whileTap={canBuy ? { scale: 0.98 } : {}}
          onClick={onBuy}
          disabled={!canBuy}
          className={`relative group w-full py-4 sm:py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            canBuy
              ? 'bg-gradient-to-r from-accent-green to-emerald-500 text-white shadow-lg shadow-accent-green/25 hover:shadow-xl hover:shadow-accent-green/40'
              : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-2">
              <span className="text-xl">🟢</span>
              Buy BTC
            </span>
            {canBuy && btcToBuy > 0 && (
              <span className="text-xs font-normal opacity-80">
                ≈ {formatBTC(btcToBuy)} BTC
              </span>
            )}
          </div>
          
          {/* Glow effect on hover */}
          {canBuy && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-green to-emerald-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          )}
        </motion.button>

        {/* Sell Button */}
        <motion.button
          whileHover={canSell ? { scale: 1.02 } : {}}
          whileTap={canSell ? { scale: 0.98 } : {}}
          onClick={onSell}
          disabled={!canSell}
          className={`relative group w-full py-4 sm:py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            canSell
              ? 'bg-gradient-to-r from-accent-red to-rose-500 text-white shadow-lg shadow-accent-red/25 hover:shadow-xl hover:shadow-accent-red/40'
              : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-2">
              <span className="text-xl">🔴</span>
              Sell BTC
            </span>
            {canSell && usdToReceive > 0 && (
              <span className="text-xs font-normal opacity-80">
                ≈ {formatCurrency(usdToReceive)}
              </span>
            )}
          </div>
          
          {/* Glow effect on hover */}
          {canSell && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-red to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          )}
        </motion.button>
      </div>

      {/* Reset Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onReset}
        className="w-full py-3 px-6 rounded-xl border border-dark-600 text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-300 text-sm"
      >
        🔄 Reset Portfolio
      </motion.button>
    </motion.div>
  )
}
