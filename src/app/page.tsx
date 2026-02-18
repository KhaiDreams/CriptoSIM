'use client'

import { motion } from 'framer-motion'
import { usePrice, usePortfolio, useKlines } from '@/hooks'
import {
  Header,
  PortfolioCard,
  BalanceCard,
  PriceDisplay,
  ClientOnly,
  CandlestickChart,
  TradingPanel,
  TradeHistory,
} from '@/components'

// Loading skeleton for SSR
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-dark-700 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-dark-700 rounded animate-pulse" />
              <div className="h-3 w-24 bg-dark-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-12 w-48 bg-dark-700 rounded-2xl animate-pulse" />
        </div>
      </div>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-dark-700 rounded-3xl animate-pulse" />
            <div className="h-80 bg-dark-700 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-dark-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}

function TradingApp() {
  const { price, previousPrice, isLoading, error, lastUpdated } = usePrice()
  const { klines, isLoading: klinesLoading } = useKlines()
  const {
    balance,
    btcAmount,
    portfolioValue,
    profitLoss,
    profitLossPercentage,
    isProfitable,
    trades,
    buy,
    sell,
    buyAll,
    sellAll,
    canBuy,
    canSell,
    reset,
  } = usePortfolio(price)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        price={price}
        previousPrice={previousPrice}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Card - Main highlight */}
            <PortfolioCard
              portfolioValue={portfolioValue}
              profitLoss={profitLoss}
              profitLossPercentage={profitLossPercentage}
              isProfitable={isProfitable}
              isLoading={isLoading && !price}
            />

            {/* Candlestick Chart */}
            <CandlestickChart data={klines} isLoading={klinesLoading} />

            {/* Price Display */}
            <PriceDisplay
              price={price}
              previousPrice={previousPrice}
              isLoading={isLoading}
              error={error}
              lastUpdated={lastUpdated}
            />

            {/* Balance Cards */}
            <BalanceCard
              balance={balance}
              btcAmount={btcAmount}
              btcPrice={price}
              isLoading={isLoading && !price}
            />
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-6">
            {/* Trading Panel */}
            <TradingPanel
              balance={balance}
              btcAmount={btcAmount}
              btcPrice={price}
              onBuy={buy}
              onSell={sell}
              onBuyAll={buyAll}
              onSellAll={sellAll}
              canBuy={canBuy}
              canSell={canSell}
            />

            {/* Trade History */}
            <TradeHistory trades={trades} />

            {/* Reset Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={reset}
              className="w-full py-3 px-6 rounded-xl border border-dark-600 text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-300 text-sm"
            >
              🔄 Reset Portfolio
            </motion.button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass-card rounded-xl p-4 border-accent-red/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm text-accent-red font-medium">
                  Connection Error
                </p>
                <p className="text-xs text-gray-400">
                  {error}. Using last known price.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500"
        >
          CryptoSim • Real-time prices from Binance • For educational purposes only
        </motion.p>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <TradingApp />
    </ClientOnly>
  )
}
