"use client"

import Header from './Header'
import { usePathname } from 'next/navigation'

export default function HeaderClient() {
  const pathname = usePathname()
  const showHeader = pathname !== '/' && !pathname.startsWith('/admin')

  if (!showHeader) {
    return null
  }

  return <Header />
}
