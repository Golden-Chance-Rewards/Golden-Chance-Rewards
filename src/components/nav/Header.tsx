"use client"

import Link from 'next/link'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const HEADER_NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Missions', href: '/missions' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Wallet', href: '/wallet' },
  { label: 'Rewards', href: '/rewards' },
] as const

type HeaderNavLabel = (typeof HEADER_NAV)[number]['label']

interface HeaderProps {
  active?: HeaderNavLabel
  rightContent?: ReactNode
}

function getActiveLabel(pathname: string | null): HeaderNavLabel | undefined {
  if (!pathname) return undefined
  if (pathname.startsWith('/dashboard')) return 'Dashboard'
  if (pathname.startsWith('/missions')) return 'Missions'
  if (pathname.startsWith('/challenges')) return 'Challenges'
  if (pathname.startsWith('/leaderboard')) return 'Leaderboard'
  if (pathname.startsWith('/wallet')) return 'Wallet'
  if (pathname.startsWith('/rewards')) return 'Rewards'
  return undefined
}

export default function Header({ active, rightContent }: HeaderProps) {
  const pathname = usePathname()
  const current = active ?? getActiveLabel(pathname)
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,14,0.92)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '13px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#1c1800,#2c2000)',
            border: '2px solid #F5C518',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <img src="goldenChanceLogo.png" alt="logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          </div>
          <span style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 16 }}>
            <span style={{ color: '#F5C518' }}>GOLDEN </span>
            <span style={{ color: '#fff' }}>CHANCE</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
          {HEADER_NAV.map(item => {
            const isActive = item.label === current
            return (
              <Link key={item.label} href={item.href} style={{
                color: isActive ? '#fff' : '#999',
                fontWeight: isActive ? 600 : 500,
                fontSize: 15,
                textDecoration: 'none',
                position: 'relative',
                padding: '6px 0',
                transition: 'color 0.2s ease',
              }}>
                {item.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: -7,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#F5C518',
                    borderRadius: '2px 2px 0 0',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {rightContent ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {rightContent}
          </div>
        ) : null}
      </div>
    </header>
  )
}
