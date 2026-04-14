"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ── Inline SVG Icons — no external dependency ─────────────────────────────────
const Icons = {
  wallet: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none"/>
      <path d="M22 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  addCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  bell: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  logout: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  star: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  gamepad: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="6"/>
      <path d="M6 12h4M8 10v4"/>
      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none"/>
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  gift: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  cupStar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M6 5h12v8a6 6 0 0 1-12 0V5z"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
      <path d="M12 8l1 2h2l-1.5 1.5.5 2L12 12.5l-2 1 .5-2L9 10h2z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  lightbulb: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="9" y1="18" x2="15" y2="18"/>
      <line x1="10" y1="22" x2="14" y2="22"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  money: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  tv: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="15" rx="2"/>
      <polyline points="17 2 12 7 7 2"/>
    </svg>
  ),
  history: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
      <polyline points="12 7 12 12 16 14"/>
    </svg>
  ),
}

export default function Dashboard() {
  const router = useRouter()
  const stakeMin = 10
  const stakeMax = 1000
  const [stake, setStake] = useState(250)
  const [userName, setUserName] = useState('Player')
  const stakePercent = ((stake - stakeMin) / (stakeMax - stakeMin)) * 100

  // ── Auth Guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('gc_auth')
    if (!raw) { router.push('/'); return }
    const auth = JSON.parse(raw)
    if (auth.role !== 'player') { router.push('/'); return }
    setUserName(auth.name || 'Player')
  }, [router])

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('gc_auth')
    router.push('/')
  }

  return (
    <>
      <style>{`
        :root {
          --gc-background: #09090d;
          --gc-card:       #111117;
          --gc-primary:    #f5c518;
          --gc-secondary:  #1a1800;
          --gc-danger:     #ff3c3c;
          --foreground:    #ffffff;
        }
        * { box-sizing: border-box; }

        .gc-live-dot {
          animation: gc-blink 1.2s ease-in-out infinite;
        }
        @keyframes gc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }

        .gc-range {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          background: transparent;
          cursor: pointer;
        }
        .gc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #f5c518;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(245,197,24,0.4);
          margin-top: -7px;
        }
        .gc-range::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
          border-radius: 2px;
        }

        .gc-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          background: transparent; color: #666;
          border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
          transition: color .15s, border-color .15s, background .15s;
          font-family: 'Inter', sans-serif;
        }
        .gc-logout-btn:hover {
          color: #ff5252;
          border-color: rgba(255,82,82,0.3);
          background: rgba(255,82,82,0.06);
        }

        .gc-nav-link:hover { color: #fff !important; }
        .gc-qa-btn:hover { background: rgba(255,255,255,0.04) !important; }
        .gc-player-row:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      <div style={{
        background: 'var(--gc-background)',
        minHeight: '100vh',
        color: 'var(--foreground)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Ambient glows ── */}
        <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', left: -96, top: 64, width: 384, height: 384, borderRadius: '50%', background: 'rgba(245,197,24,0.08)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', right: 0, top: 144, width: 384, height: 384, borderRadius: '50%', background: 'rgba(255,215,0,0.08)', filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '25%', width: 540, height: 540, transform: 'translateX(-50%)', borderRadius: '50%', background: 'rgba(255,75,75,0.07)', filter: 'blur(140px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ══════════════ HEADER ══════════════ */}
          <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 28px',
            position: 'sticky', top: 0, zIndex: 50,
            background: 'rgba(10, 10, 14, 0.55)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                position: 'relative', width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg,#1c1800,#2c2000)',
                border: '2px solid #f5c518',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}>
                <img src="goldenChanceLogo.png" alt="logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 58%, rgba(10,10,14,0.48) 100%)' }} />
              </div>
              <span style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 16 }}>
                <span style={{ color: '#f5c518' }}>GOLDEN </span>
                <span style={{ color: '#fff' }}>CHANCE</span>
              </span>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
              {(['Home', 'Missions', 'Challenges', 'Rewards'] as const).map((item) => (
                <a key={item} href="#" className="gc-nav-link" style={{
                  color: item === 'Home' ? '#fff' : '#666',
                  fontWeight: item === 'Home' ? 600 : 400,
                  fontSize: 15, textDecoration: 'none',
                  position: 'relative', paddingBottom: 6,
                  transition: 'color .15s',
                }}>
                  {item}
                  {item === 'Home' && (
                    <span style={{
                      position: 'absolute', bottom: -7, left: 0, right: 0,
                      height: 2, background: '#f5c518', borderRadius: '2px 2px 0 0',
                    }} />
                  )}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

              {/* Balance pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--gc-card)', borderRadius: 999,
                padding: '8px 6px 8px 14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Icons.wallet style={{ color: 'var(--gc-primary)', width: 16, height: 16 }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  12,450 <span style={{ color: '#555', fontWeight: 400 }}>GC</span>
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <Icons.addCircle style={{ color: '#777', width: 15, height: 15 }} />
                </div>
              </div>

              {/* Bell */}
              <button style={{
                width: 38, height: 38, borderRadius: '50%', background: 'var(--gc-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}>
                <Icons.bell style={{ color: '#777', width: 18, height: 18 }} />
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 7, height: 7, background: 'var(--gc-danger)',
                  borderRadius: '50%', border: '1.5px solid var(--gc-card)',
                }} />
              </button>

              {/* ── LOGOUT BUTTON ── */}
              <button className="gc-logout-btn" onClick={handleLogout}>
                <Icons.logout style={{ width: 14, height: 14 }} />
                Logout
              </button>

              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '2px solid rgba(245,197,24,0.35)', overflow: 'hidden', cursor: 'pointer',
              }}>
                <img src="https://i.pravatar.cc/150?img=33" alt="User"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </header>

          {/* ══════════════ MAIN ══════════════ */}
          <main style={{ padding: '24px 28px', maxWidth: 1600, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

              {/* ═══ LEFT COLUMN ═══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* ── HERO ── */}
                <section style={{
                  borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden', position: 'relative', minHeight: 370,
                  display: 'flex', alignItems: 'center',
                  background: 'radial-gradient(ellipse at 60% 40%, #18203e 0%, #10121a 55%, #0d0e16 100%)',
                }}>
                  <div style={{ position: 'absolute', top: -30, right: 180, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(65,45,210,0.24) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 160, background: 'linear-gradient(180deg, rgba(245,197,24,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />

                  <div style={{ padding: '52px 52px', position: 'relative', zIndex: 2, width: '50%', flexShrink: 0 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.22)',
                      borderRadius: 999, padding: '5px 14px', marginBottom: 26,
                    }}>
                      <Icons.star style={{ color: '#f5c518', width: 14, height: 14 }} />
                      <span style={{ color: '#f5c518', fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>WEEKEND SPECIAL EVENT</span>
                    </div>

                    <h1 style={{ fontSize: '64px', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 20px 0', color: '#ffffff', maxWidth: '460px' }}>
                      The Grand<br />
                      <span style={{ color: '#f5c518' }}>Prediction</span>{' '}
                      <span style={{ color: '#ffffff' }}>Cup</span>
                    </h1>

                    <p style={{ fontSize: 15, color: '#777', lineHeight: 1.75, marginBottom: 34, maxWidth: 400 }}>
                      Test your skill against thousands of players. Predict match outcomes, climb the global leaderboard, and claim your share of the massive{' '}
                      <span style={{ color: 'var(--gc-primary)', fontWeight: 600 }}>100,000 GC</span> prize pool.
                    </p>

                    <div style={{ display: 'flex', gap: 14 }}>
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '13px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700,
                        background: 'var(--gc-primary)', color: '#111', border: 'none', cursor: 'pointer',
                        boxShadow: '0 12px 40px rgba(245,197,24,0.22)',
                      }}>
                        Play Now
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3.33325L10 7.99992L6 12.6666" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button style={{
                        padding: '13px 26px', borderRadius: 999, fontSize: 15, fontWeight: 500,
                        background: 'transparent', color: '#dcdcdc',
                        border: '1.5px solid rgba(255,255,255,0.18)', cursor: 'pointer',
                      }}>
                        Claim Reward
                      </button>
                    </div>
                  </div>

                  <div style={{
                    position: 'absolute', right: 0, bottom: 0, top: 0, width: '50%',
                    zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none',
                  }}>
                    <img
                      src="/goldenChanceHeroSection.png"
                      alt="Hero Character"
                      style={{
                        height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain',
                        objectPosition: 'bottom right',
                        filter: 'drop-shadow(0 0 40px rgba(245,197,24,0.18))',
                        display: 'block', alignSelf: 'flex-end',
                      }}
                    />
                  </div>
                </section>

                {/* ── DAILY MISSIONS ── */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 17, fontWeight: 700 }}>Daily Missions</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#555', fontSize: 13 }}>
                        <Icons.clock style={{ width: 14, height: 14 }} />
                        <span>Resets in</span>
                        <span style={{ color: 'var(--gc-primary)', fontWeight: 600, marginLeft: 3 }}>04:12:39</span>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer' }}>View all</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* Mission 1 */}
                    <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icons.gamepad style={{ color: '#f5c518', width: 18, height: 18 }} />
                        </div>
                        <span style={{ background: 'rgba(0,230,118,0.12)', color: '#00e676', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>+50 GC</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Play 3 Prediction Game</div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 20, flexGrow: 1 }}>
                        Participate in any active prediction challenge to earn progress.
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444', marginBottom: 7 }}>
                          <span>Progress</span><span>2 / 3</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '66%', background: '#f5c518', borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>

                    {/* Mission 2 */}
                    <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245,197,24,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icons.calendar style={{ color: '#f5c518', width: 18, height: 18 }} />
                          </div>
                          <span style={{ background: 'rgba(245,197,24,0.12)', color: '#f5c518', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>+100 GC</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>7-Day Login Streak</div>
                        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 22, flexGrow: 1 }}>
                          Log in for 7 consecutive days to earn a bonus reward box.
                        </div>
                        <button style={{
                          width: '100%', padding: '11px 0', borderRadius: 10,
                          border: '1px solid rgba(245,197,24,0.25)', background: 'transparent',
                          color: '#f5c518', fontWeight: 600, fontSize: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer',
                        }}>
                          <Icons.gift style={{ width: 16, height: 16 }} />
                          Claim Reward
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── ACTIVE CHALLENGES ── */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Active Challenges</div>
                      <div style={{ fontSize: 13, color: '#555' }}>Skill-based games and predictions</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer' }}>Browse all</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Challenge 1 */}
                    <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icons.cupStar style={{ color: '#f5c518', width: 20, height: 20 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>CS:GO Major Final Predictor</span>
                            <span style={{ background: 'rgba(255,82,82,0.12)', color: '#ff5252', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>Closing soon</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#555', fontSize: 13 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Icons.users style={{ width: 13, height: 13 }} />1,284 Joined
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Icons.money style={{ width: 13, height: 13 }} />
                              Pool: <span style={{ color: '#bbb', fontWeight: 500, marginLeft: 3 }}>50,000 GC</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#444', marginBottom: 3 }}>Entry</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>100 GC</div>
                        </div>
                        <button style={{ background: '#f5c518', color: '#111', fontWeight: 700, border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, cursor: 'pointer' }}>Join</button>
                      </div>
                    </div>

                    {/* Challenge 2 */}
                    <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icons.lightbulb style={{ color: '#666', width: 20, height: 20 }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 7 }}>Weekly Crypto Trivia</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#555', fontSize: 13 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Icons.users style={{ width: 13, height: 13 }} />856 Joined
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Icons.money style={{ width: 13, height: 13 }} />
                              Pool: <span style={{ color: '#bbb', fontWeight: 500, marginLeft: 3 }}>15,000 GC</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#444', marginBottom: 3 }}>Entry</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676' }}>Free</div>
                        </div>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '9px 22px', fontSize: 14, cursor: 'pointer' }}>Join</button>
                      </div>
                    </div>
                  </div>
                </section>

              </div>{/* ═══ END LEFT ═══ */}

              {/* ═══ RIGHT COLUMN ═══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── LIVE MATCH ── */}
                <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 22, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,197,24,0.5), transparent)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15 }}>
                      <Icons.tv style={{ color: '#666', width: 16, height: 16 }} />
                      Live Match
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: 999, padding: '4px 10px' }}>
                      <span className="gc-live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gc-danger)', display: 'inline-block' }} />
                      <span style={{ color: 'var(--gc-danger)', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, padding: '0 6px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>NA</div>
                      <span style={{ fontSize: 12, color: '#555' }}>Team Alpha</span>
                    </div>
                    <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -2, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>2</span>
                      <span style={{ color: '#333', fontSize: 28, fontWeight: 300 }}>-</span>
                      <span>1</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gc-secondary)', border: '1px solid rgba(245,197,24,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'var(--gc-primary)' }}>EU</div>
                      <span style={{ fontSize: 12, color: '#555' }}>Team Beta</span>
                    </div>
                  </div>

                  {/* Stake */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 14 }}>
                      <span style={{ color: '#666' }}>Your Stake (GC)</span>
                      <span style={{ color: 'var(--gc-primary)', fontWeight: 700 }}>{stake} GC</span>
                    </div>
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', borderRadius: 2, pointerEvents: 'none' }}>
                        <div style={{ height: '100%', width: `${stakePercent}%`, background: 'linear-gradient(90deg,#f5c518,#ffd700)', borderRadius: 2 }} />
                      </div>
                      <input type="range" className="gc-range" min={stakeMin} max={stakeMax} value={stake}
                        onChange={(e) => setStake(Number(e.target.value))}
                        style={{ position: 'relative', zIndex: 1, width: '100%', display: 'block' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444', marginBottom: 20 }}>
                      <span>{stakeMin}</span><span>{stakeMax}</span>
                    </div>
                    <button style={{
                      width: '100%', padding: '14px 0', borderRadius: 12,
                      background: 'linear-gradient(90deg,#f5c518,#ffd700)',
                      color: '#111', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                      boxShadow: '0 0 28px rgba(245,197,24,0.2)',
                    }}>
                      Lock Prediction
                    </button>
                  </div>
                </div>

                {/* ── QUICK ACTIONS ── */}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { Icon: Icons.wallet,  label: 'Deposit' },
                      { Icon: Icons.history, label: 'History' },
                    ].map(({ Icon, label }) => (
                      <button key={label} className="gc-qa-btn" style={{
                        aspectRatio: '1', background: 'var(--gc-card)',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: 'pointer', transition: 'background .2s',
                      }}>
                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon style={{ color: '#f5c518', width: 22, height: 22 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#999' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── TOP PLAYERS ── */}
                <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>Top Players</span>
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, gap: 2 }}>
                      {(['Daily', 'Weekly'] as const).map((tab, i) => (
                        <button key={tab} style={{
                          padding: '5px 14px', fontSize: 12, border: 'none', cursor: 'pointer', borderRadius: 6,
                          fontWeight: i === 0 ? 700 : 400,
                          background: i === 0 ? '#262626' : 'transparent',
                          color: i === 0 ? '#fff' : '#666',
                        }}>{tab}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { rank: 1, name: 'AlexCrypto', score: '14,250', img: 11 },
                      { rank: 2, name: 'SarahBet',   score: '12,100', img: 5  },
                      { rank: 3, name: 'JohnnyWin',  score: '11,850', img: 12 },
                    ].map(({ rank, name, score, img }) => (
                      <div key={rank} className="gc-player-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', borderRadius: 10, transition: 'background .15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ width: 16, textAlign: 'center', fontSize: 13, color: '#444', fontWeight: 600 }}>{rank}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <span style={{ fontSize: 14, fontWeight: 500, color: rank === 1 ? '#fff' : '#aaa' }}>{name}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gc-primary)' }}>{score}</span>
                      </div>
                    ))}

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

                    {/* You */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: 'rgba(245,197,24,0.04)', border: '1px solid rgba(245,197,24,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ width: 16, textAlign: 'center', fontSize: 13, color: '#f5c518', fontWeight: 700 }}>42</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(245,197,24,0.3)', overflow: 'hidden' }}>
                            <img src="https://i.pravatar.cc/150?img=33" alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{userName}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#f5c518' }}>3,450</span>
                    </div>
                  </div>

                  <a href="#" style={{ display: 'block', textAlign: 'center', marginTop: 18, fontSize: 11, fontWeight: 700, color: '#444', letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase' }}>
                    View Full Leaderboard
                  </a>
                </div>

              </div>{/* ═══ END RIGHT ═══ */}

            </div>
          </main>
        </div>
      </div>
    </>
  )
}
