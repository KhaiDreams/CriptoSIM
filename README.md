# CryptoSim

A modern, frontend-only Bitcoin trading simulator with real-time market data.

![CryptoSim](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

- **Real-time BTC prices** from Binance API
- **Buy/Sell simulation** with fake money
- **Profit/Loss tracking** with visual indicators
- **Persistent state** using localStorage
- **Beautiful dark mode UI** with glassmorphism effects
- **Fully responsive** design for all devices
- **Smooth animations** with Framer Motion

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## How to Play

1. You start with **$10,000 USD**
2. Click **Buy BTC** to convert all USD to Bitcoin
3. Click **Sell BTC** to convert all Bitcoin back to USD
4. Watch your **Profit/Loss** based on price changes
5. Click **Reset Portfolio** to start over

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Binance API** - Real-time price data

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── Header.tsx       # App header with live price
│   ├── PortfolioCard.tsx# Portfolio value display
│   ├── BalanceCard.tsx  # USD and BTC balances
│   ├── PriceDisplay.tsx # BTC price with indicators
│   └── TradeButtons.tsx # Buy/Sell buttons
├── hooks/
│   ├── useLocalStorage.ts # localStorage persistence
│   ├── usePrice.ts        # Binance API fetching
│   └── usePortfolio.ts    # Trading logic
└── utils/
    └── format.ts          # Number formatting utilities
```

## License

MIT License - feel free to use this project for your portfolio!
