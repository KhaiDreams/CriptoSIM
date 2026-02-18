'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface Trade {
  id: string
  type: 'buy' | 'sell'
  usdAmount: number
  btcAmount: number
  price: number
  timestamp: number
}

interface PortfolioState {
  balance: number
  btcAmount: number
  trades: Trade[]
}

interface UsePortfolioReturn {
  balance: number
  btcAmount: number
  portfolioValue: number
  profitLoss: number
  profitLossPercentage: number
  isProfitable: boolean
  trades: Trade[]
  buy: (usdAmount: number) => boolean
  sell: (btcAmount: number) => boolean
  buyAll: () => void
  sellAll: () => void
  canBuy: boolean
  canSell: boolean
  reset: () => void
}

const INITIAL_BALANCE = 10000
const INITIAL_STATE: PortfolioState = {
  balance: INITIAL_BALANCE,
  btcAmount: 0,
  trades: [],
}

/**
 * Custom hook for managing trading portfolio state
 * Handles buy/sell operations with custom amounts and tracks trade history
 */
export function usePortfolio(currentPrice: number | null): UsePortfolioReturn {
  const [state, setState] = useLocalStorage<PortfolioState>(
    'cryptosim_portfolio_v2',
    INITIAL_STATE
  )

  const { balance, btcAmount, trades } = state

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    if (currentPrice === null) return balance
    return balance + btcAmount * currentPrice
  }, [balance, btcAmount, currentPrice])

  // Calculate profit/loss
  const profitLoss = useMemo(() => {
    return portfolioValue - INITIAL_BALANCE
  }, [portfolioValue])

  // Calculate profit/loss percentage
  const profitLossPercentage = useMemo(() => {
    return (profitLoss / INITIAL_BALANCE) * 100
  }, [profitLoss])

  // Check if profitable
  const isProfitable = profitLoss >= 0

  // Check if can buy (has USD balance)
  const canBuy = balance > 0 && currentPrice !== null && currentPrice > 0

  // Check if can sell (has BTC)
  const canSell = btcAmount > 0 && currentPrice !== null && currentPrice > 0

  // Buy specific USD amount
  const buy = useCallback(
    (usdAmount: number): boolean => {
      if (!currentPrice || usdAmount <= 0 || usdAmount > balance) return false

      const btcToBuy = usdAmount / currentPrice
      const trade: Trade = {
        id: Date.now().toString(),
        type: 'buy',
        usdAmount,
        btcAmount: btcToBuy,
        price: currentPrice,
        timestamp: Date.now(),
      }

      setState((prev) => ({
        balance: prev.balance - usdAmount,
        btcAmount: prev.btcAmount + btcToBuy,
        trades: [trade, ...prev.trades].slice(0, 50),
      }))

      return true
    },
    [currentPrice, balance, setState]
  )

  // Sell specific BTC amount
  const sell = useCallback(
    (btcToSell: number): boolean => {
      if (!currentPrice || btcToSell <= 0 || btcToSell > btcAmount) return false

      const usdToReceive = btcToSell * currentPrice
      const trade: Trade = {
        id: Date.now().toString(),
        type: 'sell',
        usdAmount: usdToReceive,
        btcAmount: btcToSell,
        price: currentPrice,
        timestamp: Date.now(),
      }

      setState((prev) => ({
        balance: prev.balance + usdToReceive,
        btcAmount: prev.btcAmount - btcToSell,
        trades: [trade, ...prev.trades].slice(0, 50),
      }))

      return true
    },
    [currentPrice, btcAmount, setState]
  )

  // Buy all - convert all USD to BTC
  const buyAll = useCallback(() => {
    if (!canBuy || currentPrice === null) return
    buy(balance)
  }, [canBuy, currentPrice, balance, buy])

  // Sell all - convert all BTC to USD
  const sellAll = useCallback(() => {
    if (!canSell || currentPrice === null) return
    sell(btcAmount)
  }, [canSell, currentPrice, btcAmount, sell])

  // Reset portfolio to initial state
  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [setState])

  return {
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
  }
}
