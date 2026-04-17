import type { Metadata } from 'next'
import './globals.css'
import HeaderClient from '../components/nav/HeaderClient'

export const metadata: Metadata = {
  title: 'GoldenChance',
  description: 'Play Smart. Earn Rewards. Win Daily.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <HeaderClient />
        {children}
      </body>
    </html>
  )
}