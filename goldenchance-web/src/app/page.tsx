"use client"

import { type ElementType, useState } from 'react'
import Script from 'next/script'

const IconifyIcon = 'iconify-icon' as ElementType;

export default function Home() {
  const stakeMin = 10
  const stakeMax = 1000
  const [stake, setStake] = useState(250)
  const stakePercent = ((stake - stakeMin) / (stakeMax - stakeMin)) * 100

  return (
    <>
      <Script
        src="https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js"
        strategy="beforeInteractive"
      />
 
      <div style={{
        background: 'var(--gc-background)',
        minHeight: '100vh',
        color: 'var(--foreground)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
 
        {/* ── Global ambient glows ── */}
        <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', left: -96, top: 64,  width: 384, height: 384, borderRadius: '50%', background: 'rgba(245,197,24,0.08)',  filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', right: 0,  top: 144, width: 384, height: 384, borderRadius: '50%', background: 'rgba(255,215,0,0.08)',   filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '25%', width: 540, height: 540, transform: 'translateX(-50%)', borderRadius: '50%', background: 'rgba(255,75,75,0.07)', filter: 'blur(140px)' }} />
        </div>
 
        <div style={{ position: 'relative', zIndex: 10 }}>
 
          {/* ══════════════ HEADER ══════════════ */}
          <header className="gc-header" style={{
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
            <div className="gc-header-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  position: 'relative',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#1c1800,#2c2000)',
                  border: '2px solid #f5c518',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src="goldenChanceLogo.png"
                  alt="logo"
                  style={{ width: 50, height: 50, objectFit: 'contain' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(circle at center, transparent 58%, rgba(10,10,14,0.48) 100%)',
                }} />
              </div>

              <span className="gc-brand-text" style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 16 }}>
                <span style={{ color: '#f5c518' }}>GOLDEN </span>
                <span style={{ color: '#fff' }}>CHANCE</span>
              </span>
            </div>
 
            {/* Nav */}
            <nav className="gc-header-nav" style={{ display: 'flex', alignItems: 'center', gap: 38 }}>
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
            <div className="gc-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Balance pill */}
              <div className="gc-balance-pill" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--gc-card)', borderRadius: 999,
                padding: '8px 6px 8px 14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <IconifyIcon icon="solar:wallet-linear" style={{ color: 'var(--gc-primary)', fontSize: '16px' }} />
                <span style={{ fontWeight: 600, fontSize: 14 }} className="mono-num">
                  12,450 <span style={{ color: '#555', fontWeight: 400 }}>GC</span>
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <IconifyIcon icon="solar:add-circle-linear" style={{ color: '#777', fontSize: '15px' }} />
                </div>
              </div>
 
              {/* Bell */}
              <button style={{
                width: 38, height: 38, borderRadius: '50%', background: 'var(--gc-card)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}>
                <IconifyIcon icon="solar:bell-linear" style={{ color: '#777', fontSize: '18px' }} />
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 7, height: 7, background: 'var(--gc-danger)',
                  borderRadius: '50%', border: '1.5px solid var(--gc-card)',
                }} />
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
          <main className="gc-main" style={{ padding: '24px 28px', maxWidth: 1600, margin: '0 auto' }}>
            <div className="gc-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
 
              {/* ═══ LEFT COLUMN ═══ */}
              <div className="gc-left-col" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
 
                {/* ── HERO ── */}
                <section className="gc-hero" style={{
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 370,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'radial-gradient(ellipse at 60% 40%, #18203e 0%, #10121a 55%, #0d0e16 100%)',
                }}>
                  {/* Purple glow */}
                  <div className="gc-hero-content" style={{
                    position: 'absolute', top: -30, right: 180, width: 260, height: 260,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(65,45,210,0.24) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  {/* Top golden gradient */}
                  <div style={{
                    position: 'absolute', inset: '0 0 auto 0', height: 160,
                    background: 'linear-gradient(180deg, rgba(245,197,24,0.08) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />

                  {/* ── LEFT TEXT CONTENT ── */}
                  <div style={{
                    padding: '52px 52px',
                    position: 'relative',
                    zIndex: 2,
                    width: '50%',          // ✅ FIX: fixed width so text always stays left
                    flexShrink: 0,
                  }}>
                    {/* Badge */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.22)',
                      borderRadius: 999, padding: '5px 14px', marginBottom: 26,
                    }}>
                      <IconifyIcon icon="solar:star-linear" style={{ color: '#f5c518', fontSize: '14px' }} />
                      <span style={{ color: '#f5c518', fontSize: 10, fontWeight: 600, letterSpacing: 1, }}>
                        WEEKEND SPECIAL EVENT
                      </span>
                    </div>
                    
                    {/* ── HERO HEADING ── */}
                    <h1 className="gc-hero-title" style={{
                      fontSize: '64px',
                      fontWeight: 600,
                      lineHeight: 1.05,
                      letterSpacing: '-2px',
                      margin: '0 0 20px 0',
                      color: '#ffffff',
                      maxWidth: '460px',
                    }}>
                      The Grand
                      <br />
                      <span style={{ color: '#f5c518' }}>Prediction</span>
                      {' '}
                      <span style={{ color: '#ffffff' }}>Cup</span>
                    </h1>
 
                    <p style={{ fontSize: 15, color: '#777', lineHeight: 1.75, marginBottom: 34, maxWidth: 400 }}>
                      Test your skill against thousands of players. Predict match outcomes, climb the global
                      leaderboard, and claim your share of the massive{' '}
                      <span className="mono-num" style={{ color: 'var(--gc-primary)', fontWeight: 600 }}>100,000 GC</span> prize pool.
                    </p>
 
                    <div className="gc-hero-cta" style={{ display: 'flex', gap: 14 }}>
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '13px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700,
                        background: 'var(--gc-primary)', color: '#111', border: 'none', cursor: 'pointer',
                        boxShadow: '0 12px 40px rgba(245,197,24,0.22)',
                      }}>
                        Play Now
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3.33325L10 7.99992L6 12.6666" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

                  {/* ── RIGHT: Hero character image ── */}
                  {/* ✅ FIX: width 62% → 50%, maxWidth 130% → 100%, removed negative offsets */}
                  <div className="gc-hero-media" style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    top: 0,
                    width: '50%',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    pointerEvents: 'none',
                  }}>
                    <img
                      src="/goldenChanceHeroSection.png"
                      alt="Hero Character"
                      style={{
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        objectPosition: 'bottom right',
                        filter: 'drop-shadow(0 0 40px rgba(245,197,24,0.18))',
                        display: 'block',
                        alignSelf: 'flex-end',
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
                        <IconifyIcon icon="solar:clock-circle-linear" style={{ fontSize: '14px' }} />
                        <span>Resets in</span>
                        <span className="mono-num" style={{ color: 'var(--gc-primary)', fontWeight: 600, marginLeft: 3 }}>04:12:39</span>
                      </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: '#555', fontSize: 13, cursor: 'pointer' }}>
                      View all
                    </button>
                  </div>
                          
                  <div className="gc-mission-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* Mission 1 */}
                    <div className="gc-challenge-row" style={{
                      background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16, padding: 22,
                      display: 'flex', flexDirection: 'column',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,197,24,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <IconifyIcon icon="solar:gamepad-linear" style={{ color: '#f5c518', fontSize: '18px' }} />
                        </div>
                        <span style={{
                          background: 'rgba(0,230,118,0.12)', color: '#00e676',
                          fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                        }}>+50 GC</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Play 3 Prediction Game</div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 20, flexGrow: 1 }}>
                        Participate in any active prediction challenge to earn progress.
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#444', marginBottom: 7 }}>
                          <span>Progress</span><span className="mono-num">2 / 3</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '66%', background: '#f5c518', borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
 
                    {/* Mission 2 */}
                    <div style={{
                      background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16, padding: 22,
                      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, rgba(245,197,24,0.04) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: '50%', background: 'rgba(245,197,24,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <IconifyIcon icon="solar:calendar-linear" style={{ color: '#f5c518', fontSize: '18px' }} />
                          </div>
                          <span style={{
                            background: 'rgba(245,197,24,0.12)', color: '#f5c518',
                            fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                          }}>+100 GC</span>
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
                          <IconifyIcon icon="solar:gift-linear" style={{ fontSize: '16px' }} />
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
                    <div style={{
                      background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10, background: 'var(--gc-card)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <IconifyIcon icon="solar:cup-star-linear" style={{ color: '#f5c518', fontSize: '20px' }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>CS:GO Major Final Predictor</span>
                            <span style={{
                              background: 'rgba(255,82,82,0.12)', color: '#ff5252',
                              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5,
                            }}>Closing soon</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#555', fontSize: 13 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <IconifyIcon icon="solar:users-group-rounded-linear" style={{ fontSize: '13px' }} />
                              1,284 Joined
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <IconifyIcon icon="solar:wad-of-money-linear" style={{ fontSize: '13px' }} />
                              Pool: <span className="mono-num" style={{ color: '#bbb', fontWeight: 500, marginLeft: 3 }}>50,000 GC</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="gc-challenge-row-right" style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#444', marginBottom: 3 }}>Entry</div>
                          <div style={{ fontSize: 14, fontWeight: 700 }} className="mono-num">100 GC</div>
                        </div>
                        <button style={{
                          background: '#f5c518', color: '#111', fontWeight: 700, border: 'none',
                          borderRadius: 8, padding: '9px 22px', fontSize: 14, cursor: 'pointer',
                        }}>Join</button>
                      </div>
                    </div>
 
                    {/* Challenge 2 */}
                    <div className="gc-challenge-row" style={{
                      background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14, padding: '16px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10, background: 'var(--gc-card)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <IconifyIcon icon="solar:lightbulb-linear" style={{ color: '#666', fontSize: '20px' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 7 }}>Weekly Crypto Trivia</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#555', fontSize: 13 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <IconifyIcon icon="solar:users-group-rounded-linear" style={{ fontSize: '13px' }} />
                              856 Joined
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <IconifyIcon icon="solar:wad-of-money-linear" style={{ fontSize: '13px' }} />
                              Pool: <span className="mono-num" style={{ color: '#bbb', fontWeight: 500, marginLeft: 3 }}>15,000 GC</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="gc-challenge-row-right" style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#444', marginBottom: 3 }}>Entry</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676' }}>Free</div>
                        </div>
                        <button style={{
                          background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 500,
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 8, padding: '9px 22px', fontSize: 14, cursor: 'pointer',
                        }}>Join</button>
                      </div>
                    </div>
                  </div>
                </section>
 
              </div>
              {/* ═══ END LEFT ═══ */}
 
              {/* ═══ RIGHT COLUMN ═══ */}
              <div className="gc-right-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
 
                {/* ── LIVE MATCH ── */}
                <div style={{
                  background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20, padding: 22, position: 'relative', overflow: 'hidden',
                }}>
                  {/* Top gold line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(245,197,24,0.5), transparent)',
                  }} />
 
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15 }}>
                      <IconifyIcon icon="solar:tv-linear" style={{ color: '#666', fontSize: '16px' }} />
                      Live Match
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)',
                      borderRadius: 999, padding: '4px 10px',
                    }}>
                      <span className="gc-live-dot" style={{
                        width: 6, height: 6, borderRadius: '50%', background: 'var(--gc-danger)', display: 'inline-block',
                      }} />
                      <span style={{ color: 'var(--gc-danger)', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
                    </div>
                  </div>
 
                  {/* Score */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 26, padding: '0 6px',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%', background: '#1e1e1e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14,
                      }}>NA</div>
                      <span style={{ fontSize: 12, color: '#555' }}>Team Alpha</span>
                    </div>
 
                    <div style={{
                      fontSize: 42, fontWeight: 800, letterSpacing: -2,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span>2</span>
                      <span style={{ color: '#333', fontSize: 28, fontWeight: 300 }}>-</span>
                      <span>1</span>
                    </div>
 
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%', background: 'var(--gc-secondary)',
                        border: '1px solid rgba(245,197,24,0.22)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14, color: 'var(--gc-primary)',
                      }}>EU</div>
                      <span style={{ fontSize: 12, color: '#555' }}>Team Beta</span>
                    </div>
                  </div>
 
                  {/* Stake */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 14 }}>
                      <span style={{ color: '#666' }}>Your Stake (GC)</span>
                      <span style={{ color: 'var(--gc-primary)', fontWeight: 700 }}>{stake} GC</span>
                    </div>

                    {/* Slider wrapper */}
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                      {/* Visual background track */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: 4,
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 2,
                        pointerEvents: 'none',
                      }}>
                        {/* Filled portion */}
                        <div style={{
                          height: '100%',
                          width: `${stakePercent}%`,
                          background: 'linear-gradient(90deg,#f5c518,#ffd700)',
                          borderRadius: 2,
                        }} />
                      </div>

                      {/* Actual range input */}
                      <input
                        type="range"
                        className="gc-range"
                        min={stakeMin}
                        max={stakeMax}
                        value={stake}
                        onChange={(e) => setStake(Number(e.target.value))}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          display: 'block',
                        }}
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
                  <div className="gc-quick-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { icon: 'solar:wallet-linear',  label: 'Deposit' },
                      { icon: 'solar:history-linear', label: 'History' },
                    ].map(({ icon, label }) => (
                      <button key={label} className="gc-qa-btn" style={{
                        aspectRatio: '1', background: 'var(--gc-card)',
                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: 'pointer', transition: 'background .2s',
                      }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: '50%', background: 'rgba(245,197,24,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <IconifyIcon icon={icon} style={{ color: '#f5c518', fontSize: '22px' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#999' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
 
                {/* ── TOP PLAYERS ── */}
                <div style={{
                  background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20, padding: 22,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>Top Players</span>
                    <div style={{
                      display: 'flex', background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, gap: 2,
                    }}>
                      {(['Daily', 'Weekly'] as const).map((tab, i) => (
                        <button key={tab} style={{
                          padding: '5px 14px', fontSize: 12, border: 'none', cursor: 'pointer',
                          borderRadius: 6, fontWeight: i === 0 ? 700 : 400,
                          background: i === 0 ? '#262626' : 'transparent',
                          color: i === 0 ? '#fff' : '#666',
                        }}>
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { rank: 1,  name: 'AlexCrypto', score: '14,250', img: 11, gold: true },
                      { rank: 2,  name: 'SarahBet',   score: '12,100', img: 5,  gold: false },
                      { rank: 3,  name: 'JohnnyWin',  score: '11,850', img: 12, gold: false },
                    ].map(({ rank, name, score, img, gold }) => (
                      <div key={rank} className="gc-player-row" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 6px', borderRadius: 10, transition: 'background .15s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ width: 16, textAlign: 'center', fontSize: 13, color: '#444', fontWeight: 600 }}>{rank}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name}
                              style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <span style={{ fontSize: 14, fontWeight: 500, color: gold ? '#fff' : '#aaa' }}>{name}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gc-primary)' }}>{score}</span>
                      </div>
                    ))}

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

                    {/* You */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 12,
                      background: 'rgba(245,197,24,0.04)', border: '1px solid rgba(245,197,24,0.2)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ width: 16, textAlign: 'center', fontSize: 13, color: '#f5c518', fontWeight: 700 }}>42</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            position: 'relative',
                            width: 32, height: 32, borderRadius: '50%',
                            border: '2px solid rgba(245,197,24,0.3)', overflow: 'hidden',
                          }}>
                            <img src="https://i.pravatar.cc/150?img=33" alt="You"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              pointerEvents: 'none',
                              background: 'radial-gradient(circle, transparent 64%, rgba(10,10,14,0.48) 100%)',
                            }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>You</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#f5c518' }}>3,450</span>
                    </div>
                  </div>
                
                              
                  <a href="#" className="gc-leaderboard" style={{
                    display: 'block', textAlign: 'center', marginTop: 18,
                    fontSize: 11, fontWeight: 700, color: '#444',
                    letterSpacing: 2, textDecoration: 'none', textTransform: 'uppercase',
                    transition: 'color .15s',
                  }}>
                    View Full Leaderboard
                  </a>
                </div>
 
              </div>
              {/* ═══ END RIGHT ═══ */}
 
            </div>
          </main>
 
        </div>
      </div>
    </>
  )
}
