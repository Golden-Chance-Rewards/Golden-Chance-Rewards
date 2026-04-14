"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('gc_auth')
    if (!raw) { router.push('/'); return }
    const auth = JSON.parse(raw)
    if (auth.role !== 'admin') { router.push('/'); return }
    setAdmin({ name: auth.name, email: auth.email })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('gc_auth')
    router.push('/')
  }

  if (!admin) return null

  return (
    <div style={{
      background: 'var(--gc-background)', minHeight: '100vh',
      color: 'var(--foreground)', fontFamily: "'Inter', sans-serif",
    }}>

      {/* Ambient glows */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', left: -80, top: 80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,197,24,0.06)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,0,70,0.06)', filter: 'blur(120px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 28px', position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(10,10,14,0.7)',
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#F5C518,#FFD700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, fontStyle: 'italic' }}>
                <span style={{ color: '#F5C518' }}>GOLDEN </span>
                <span style={{ color: '#fff' }}>CHANCE</span>
              </div>
              <div style={{ fontSize: 10, color: '#F5C518', fontWeight: 600, letterSpacing: 1.5 }}>ADMIN PANEL</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['Overview', 'Players', 'Challenges', 'Payouts'].map((item, i) => (
              <a key={item} href="#" style={{
                color: i === 0 ? '#fff' : '#555', fontWeight: i === 0 ? 600 : 400,
                fontSize: 14, textDecoration: 'none', transition: 'color .15s',
                paddingBottom: 4,
                borderBottom: i === 0 ? '2px solid #F5C518' : '2px solid transparent',
              }}>{item}</a>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{admin.name}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{admin.email}</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#F5C518,#FFD700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: '#111',
            }}>
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'transparent', color: '#555',
              border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
            }}>
              Logout
            </button>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ padding: '28px 28px', maxWidth: 1400, margin: '0 auto' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Welcome back, <span style={{ color: '#F5C518' }}>{admin.name}</span> 👋
            </h1>
            <p style={{ fontSize: 14, color: '#555' }}>Here's your platform overview for today</p>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Players',     value: '12,450', change: '+124 today', icon: '👥', up: true  },
              { label: 'Active Challenges', value: '38',      change: '+5 new',    icon: '🎯', up: true  },
              { label: 'Total Prize Pool',  value: '₹4.2L',   change: 'This month',icon: '💰', up: true  },
              { label: 'Pending Payouts',   value: '₹18,500', change: '12 requests',icon: '⏳',up: false },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 22 }}>{stat.icon}</div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 10, fontWeight: 500 }}>{stat.label}</div>
                <div className="mono-num" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: stat.up ? '#00E676' : '#FF5252', fontWeight: 500 }}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

            {/* ── LEFT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Players Table */}
              <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Recent Players</div>
                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Latest registrations</div>
                  </div>
                  <button style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(245,197,24,0.1)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.2)', cursor: 'pointer' }}>
                    View All
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '12px 22px', background: 'rgba(255,255,255,0.02)', fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: 0.5 }}>
                  <span>PLAYER</span><span>EMAIL</span><span>GAMES</span><span>BALANCE</span><span>STATUS</span>
                </div>

                {[
                  { name: 'Wade Warren', email: 'wade@gc.com', games: 24, balance: '₹1,200', status: 'Active',   img: 11 },
                  { name: 'Esther Howard',  email: 'howard@gc.com', games: 18, balance: '₹850',   status: 'Active',   img: 5  },
                  { name: 'Leslie Alexander',   email: 'leslie@gc.com',  games: 9,  balance: '₹320',   status: 'Inactive', img: 12 },
                  { name: 'Robert Fox',  email: 'fox@gc.com', games: 31, balance: '₹2,100', status: 'Active',   img: 47 },
                  { name: 'Robert Fox',  email: 'fox@gc.com', games: 5,  balance: '₹150',   status: 'Banned',   img: 33 },
                ].map((player, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                    padding: '14px 22px', alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.04)', transition: 'background .15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={`https://i.pravatar.cc/150?img=${player.img}`} alt={player.name}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{player.name}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#555' }}>{player.email}</span>
                    <span className="mono-num" style={{ fontSize: 13 }}>{player.games}</span>
                    <span className="mono-num" style={{ fontSize: 13, color: '#F5C518', fontWeight: 600 }}>{player.balance}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block',
                      background: player.status === 'Active' ? 'rgba(0,230,118,0.12)' : player.status === 'Banned' ? 'rgba(255,82,82,0.12)' : 'rgba(255,255,255,0.06)',
                      color:      player.status === 'Active' ? '#00E676'              : player.status === 'Banned' ? '#FF5252'              : '#666',
                    }}>{player.status}</span>
                  </div>
                ))}
              </div>

              {/* Challenges Table */}
              <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Active Challenges</div>
                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Live and upcoming</div>
                  </div>
                  <button style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(245,197,24,0.1)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.2)', cursor: 'pointer' }}>
                    + New Challenge
                  </button>
                </div>

                {[
                  { name: 'CS:GO Major Final Predictor', players: 1284, pool: '₹50,000',   ends: '2h 15m', status: 'Live'     },
                  { name: 'Weekly Crypto Trivia',        players: 856,  pool: '₹15,000',   ends: '1d 4h',  status: 'Live'     },
                  { name: 'IPL Prediction Special',      players: 0,    pool: '₹1,00,000', ends: '3d',     status: 'Upcoming' },
                ].map((ch, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 80px',
                    padding: '14px 22px', alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{ch.name}</span>
                    <span className="mono-num" style={{ fontSize: 13 }}>{ch.players}</span>
                    <span className="mono-num" style={{ fontSize: 13, color: '#F5C518', fontWeight: 600 }}>{ch.pool}</span>
                    <span style={{ fontSize: 13, color: '#555' }}>{ch.ends}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textAlign: 'center',
                      background: ch.status === 'Live' ? 'rgba(255,82,82,0.12)' : 'rgba(245,197,24,0.1)',
                      color:      ch.status === 'Live' ? '#FF5252'              : '#F5C518',
                    }}>{ch.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Quick Actions */}
              <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 22 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Create New Challenge', icon: '🎯' },
                    { label: 'Approve Payouts',      icon: '💸' },
                    { label: 'Ban / Unban Player',   icon: '🚫' },
                    { label: 'Send Announcement',    icon: '📢' },
                  ].map(action => (
                    <button key={action.label} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 12, width: '100%', textAlign: 'left',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      color: '#ccc', fontSize: 14, cursor: 'pointer', transition: 'background .15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    >
                      <span style={{ fontSize: 18 }}>{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout Requests */}
              <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 22 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Payout Requests</div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>Pending approvals</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { name: 'Wade Warren', amount: '₹1,200', img: 11 },
                    { name: 'Esther Howard',  amount: '₹850',   img: 5  },
                    { name: 'Robert Fox',  amount: '₹2,100', img: 47 },
                  ].map((req, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={`https://i.pravatar.cc/150?img=${req.img}`} alt={req.name}
                          style={{ width: 30, height: 30, borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{req.name}</div>
                          <div className="mono-num" style={{ fontSize: 12, color: '#F5C518' }}>{req.amount}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(0,230,118,0.12)', color: '#00E676', border: 'none', cursor: 'pointer' }}>✓ Approve</button>
                        <button style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(255,82,82,0.12)', color: '#FF5252', border: 'none', cursor: 'pointer' }}>✕ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}