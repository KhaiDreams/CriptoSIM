'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatBTC } from '@/utils/format'

interface TradingPanelProps {
  balance: number
  btcAmount: number
  btcPrice: number | null
  onBuy: (amount: number) => boolean
  onSell: (amount: number) => boolean
  onBuyAll: () => void
  onSellAll: () => void
  canBuy: boolean
  canSell: boolean
}

export function TradingPanel({
  balance,
  btcAmount,
  btcPrice,
  onBuy,
  onSell,
  onBuyAll,
  onSellAll,
  canBuy,
  canSell,
}: TradingPanelProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const numAmount = parseFloat(amount) || 0

  // Calculate preview values
  const btcToBuy = btcPrice && numAmount > 0 ? numAmount / btcPrice : 0
  const usdToReceive = btcPrice && numAmount > 0 ? numAmount * btcPrice : 0

  const handleQuickAmount = (percentage: number) => {
    if (activeTab === 'buy') {
      setAmount((balance * percentage).toFixed(2))
    } else {
      setAmount((btcAmount * percentage).toFixed(8))
    }
    setError('')
  }

  const handleTrade = () => {
    setError('')

    if (activeTab === 'buy') {
      if (numAmount <= 0) {
        setError('Enter a valid amount')
        return
      }
      if (numAmount > balance) {
        setError('Insufficient USD balance')
        return
      }
      const success = onBuy(numAmount)
      if (success) {
        setAmount('')
      }
    } else {
      if (numAmount <= 0) {
        setError('Enter a valid amount')
        return
      }
      if (numAmount > btcAmount) {
        setError('Insufficient BTC balance')
        return
      }
      const success = onSell(numAmount)
      if (success) {
        setAmount('')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => {
            setActiveTab('buy')
            setAmount('')
            setError('')
          }}
          className={`flex-1 py-4 text-center font-medium transition-all ${
            activeTab === 'buy'
              ? 'text-accent-green bg-accent-green/10 border-b-2 border-accent-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Buy BTC
        </button>
        <button
          onClick={() => {
            setActiveTab('sell')
            setAmount('')
            setError('')
          }}
          className={`flex-1 py-4 text-center font-medium transition-all ${
            activeTab === 'sell'
              ? 'text-accent-red bg-accent-red/10 border-b-2 border-accent-red'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sell BTC
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Available Balance */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Available</span>
          <span className="text-white font-medium">
            {activeTab === 'buy'
              ? formatCurrency(balance)
              : `${formatBTC(btcAmount)} BTC`}
          </span>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            Amount ({activeTab === 'buy' ? 'USD' : 'BTC'})
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              placeholder={activeTab === 'buy' ? '0.00' : '0.00000000'}
              step={activeTab === 'buy' ? '0.01' : '0.00000001'}
              min="0"
              className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {activeTab === 'buy' ? 'USD' : 'BTC'}
            </span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <button
              key={pct}
              onClick={() => handleQuickAmount(pct)}
              className="flex-1 py-2 text-xs font-medium text-gray-400 bg-dark-600 rounded-lg hover:bg-dark-700 hover:text-white transition-all"
            >
              {pct === 1 ? 'MAX' : `${pct * 100}%`}
            </button>
          ))}
        </div>

        {/* Preview */}
        {numAmount > 0 && btcPrice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-dark-700/50 rounded-xl p-3 space-y-1"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You will {activeTab === 'buy' ? 'receive' : 'get'}</span>
              <span className="text-white font-medium">
                {activeTab === 'buy'
                  ? `≈ ${formatBTC(btcToBuy)} BTC`
                  : `≈ ${formatCurrency(usdToReceive)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price</span>
              <span className="text-gray-300">{formatCurrency(btcPrice)}</span>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-accent-red"
          >
            {error}
          </motion.p>
        )}

        {/* Trade Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleTrade}
          disabled={
            (activeTab === 'buy' && !canBuy) ||
            (activeTab === 'sell' && !canSell) ||
            numAmount <= 0
          }
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            activeTab === 'buy'
              ? 'bg-gradient-to-r from-accent-green to-emerald-500 text-white shadow-lg shadow-accent-green/25 hover:shadow-xl hover:shadow-accent-green/40 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-gradient-to-r from-accent-red to-rose-500 text-white shadow-lg shadow-accent-red/25 hover:shadow-xl hover:shadow-accent-red/40 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {activeTab === 'buy' ? 'Buy BTC' : 'Sell BTC'}
        </motion.button>

        {/* Quick All-in/All-out Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBuyAll}
            disabled={!canBuy}
            className="flex-1 py-2 text-sm font-medium text-accent-green border border-accent-green/30 rounded-lg hover:bg-accent-green/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Buy All
          </button>
          <button
            onClick={onSellAll}
            disabled={!canSell}
            className="flex-1 py-2 text-sm font-medium text-accent-red border border-accent-red/30 rounded-lg hover:bg-accent-red/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Sell All
          </button>
        </div>
      </div>
    </motion.div>
  )
}
