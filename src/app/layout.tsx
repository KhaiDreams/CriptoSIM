import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CryptoSim - Bitcoin Trading Simulator',
  description: 'A modern crypto trading simulator with real-time BTC prices. Practice trading with fake money and track your profit/loss.',
  keywords: ['bitcoin', 'trading', 'simulator', 'crypto', 'BTC', 'USDT'],
  authors: [{ name: 'CryptoSim' }],
  openGraph: {
    title: 'CryptoSim - Bitcoin Trading Simulator',
    description: 'Practice Bitcoin trading with real-time prices',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoSim - Bitcoin Trading Simulator',
    description: 'Practice Bitcoin trading with real-time prices',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
