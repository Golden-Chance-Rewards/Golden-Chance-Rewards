"use client"

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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
  const router = useRouter()
  const current = active ?? getActiveLabel(pathname)
  const [balance, setBalance] = useState('12,450')
  const [userName, setUserName] = useState('Player')

  useEffect(() => {
    const rawAuth = localStorage.getItem('gc_auth')
    if (!rawAuth) return
    try {
      const auth = JSON.parse(rawAuth)
      if (auth.balance) {
        setBalance(String(auth.balance).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }
      if (auth.name) {
        setUserName(auth.name)
      }
    } catch {
      // ignore invalid auth data
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gc_auth')
    router.push('/')
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,14,0.96)',
      backdropFilter: 'blur(22px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
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
            <img src="/goldenChanceLogo.png" alt="logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          </div>
          <span style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 16 }}>
            <span style={{ color: '#F5C518' }}>GOLDEN </span>
            <span style={{ color: '#fff' }}>CHANCE</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 36, flexGrow: 1, justifyContent: 'center' }}>
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(245,197,24,0.18)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: 'nowrap',
            }}>
              <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,197,24,0.12)', color: '#F5C518', fontSize: 12 }}>
                GC
              </span>
              <span>{balance} GC</span>
            </div>

            <button type="button" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              cursor: 'pointer',
            }} aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
            }} aria-label="Profile">
              {userName.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()}
            </div>

            <button type="button" onClick={handleLogout} style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(245,197,24,0.25)',
              background: 'rgba(245,197,24,0.12)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
