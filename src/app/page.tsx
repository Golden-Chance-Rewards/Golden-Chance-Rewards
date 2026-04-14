"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const USERS = [
  { email: 'player@gc.com', password: 'player123', role: 'player', name: 'Alex Crypto' },
  { email: 'admin@gc.com',  password: 'admin123',  role: 'admin',  name: 'Admin User'  },
]

type ModalMode = 'login' | 'signup' | null

export default function LandingPage() {
  const router = useRouter()
  const [modal, setModal]       = useState<ModalMode>(null)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openModal = (mode: ModalMode) => {
    setModal(mode); setError(''); setEmail(''); setPassword(''); setName(''); setConfirm('')
  }
  const closeModal = () => { setModal(null); setError('') }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const user = USERS.find(u => u.email === email && u.password === password)
    if (!user) { setError('Invalid email or password.'); setLoading(false); return }
    localStorage.setItem('gc_auth', JSON.stringify({ role: user.role, name: user.name, email: user.email }))
    if (user.role === 'admin') router.push('/admin')
    else router.push('/dashboard')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (password !== confirm) { setError('Passwords do not match.'); setLoading(false); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); setLoading(false); return }
    localStorage.setItem('gc_auth', JSON.stringify({ role: 'player', name: name || 'New Player', email }))
    router.push('/dashboard')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --gold:       #F5C518;
          --gold-bright:#FFD700;
          --gold-glow:  rgba(245,197,24,0.18);
          --gold-soft:  rgba(245,197,24,0.08);
          --bg:         #0A0A0A;
          --bg-card:    #111111;
          --bg-card2:   #161616;
          --bg-elevated:#1A1A1A;
          --border:     rgba(255,255,255,0.07);
          --border-gold:rgba(245,197,24,0.2);
          --text:       #FFFFFF;
          --text-muted: #888888;
          --text-dim:   #444444;
          --success:    #00E676;
          --danger:     #FF5252;

          /* Blue gradient system for hero */
          --blue-1: rgba(14, 165, 233, 0.12);
          --blue-2: rgba(56, 189, 248, 0.08);
          --blue-3: rgba(99, 102, 241, 0.06);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

        /* ── BUTTONS ── */
        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          background: linear-gradient(135deg, #F5C518 0%, #FFD700 50%, #F5C518 100%);
          background-size: 200% 200%;
          color: #0A0A0A; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
          padding: 13px 28px; border-radius: 12px; border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(245,197,24,0.3), 0 1px 0 rgba(255,255,255,0.25) inset;
          transition: all 0.2s ease;
          white-space: nowrap; text-decoration: none; letter-spacing: -0.01em;
          position: relative; overflow: hidden;
        }
        .btn-gold::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          border-radius: 12px;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(245,197,24,0.45), 0 1px 0 rgba(255,255,255,0.25) inset;
          background-position: right center;
        }
        .btn-gold:active { transform: translateY(0); }

        .btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75); font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px;
          padding: 12px 26px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
          transition: all 0.2s ease; white-space: nowrap; text-decoration: none; letter-spacing: -0.01em;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
          transform: translateY(-1px);
        }

        /* ── INPUTS ── */
        .inp {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 13px 16px; color: #fff; font-size: 14px;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .inp:focus {
          border-color: rgba(245,197,24,0.5);
          background: rgba(245,197,24,0.03);
          box-shadow: 0 0 0 3px rgba(245,197,24,0.08);
        }
        .inp::placeholder { color: #333; }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 56px; height: 66px;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(10,10,10,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(20px) saturate(1.5);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #1a1500, #2a2000);
          border: 1.5px solid rgba(245,197,24,0.5);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(245,197,24,0.15);
        }
        .nav-logo-text {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-style: italic;
          font-size: 15px;
          letter-spacing: -0.03em;
        }
        .nav-links { display: flex; align-items: center; gap: 36px; }
        .nav-link {
          color: #555; font-size: 13.5px; font-weight: 500; text-decoration: none; cursor: pointer;
          transition: color 0.2s; letter-spacing: -0.01em;
        }
        .nav-link:hover { color: rgba(255,255,255,0.85); }
        .nav-actions { display: flex; align-items: center; gap: 8px; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 56px 80px;
          position: relative; overflow: hidden;
          max-width: 1400px; margin: 0 auto;
        }

        /* Soft blue radial gradient meshes */
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .hero-orb-1 {
          position: absolute; left: -120px; top: 10%;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0.04) 40%, transparent 70%);
          filter: blur(80px);
        }
        .hero-orb-2 {
          position: absolute; right: 5%; top: 20%;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          filter: blur(100px);
        }
        .hero-orb-3 {
          position: absolute; left: 35%; bottom: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%);
          filter: blur(80px);
        }
        /* Subtle grid texture */
        .hero-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── HERO CONTENT ── */
        .hero-left { position: relative; z-index: 1; flex: 1; max-width: 600px; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(14,165,233,0.12), rgba(245,197,24,0.08));
          border: 1px solid rgba(14,165,233,0.25);
          border-radius: 999px; padding: 6px 16px; margin-bottom: 32px;
          animation: fadeUp 0.6s ease forwards;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #0EA5E9;
          box-shadow: 0 0 6px rgba(14,165,233,0.8);
          animation: livePulse 1.6s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .badge-text {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: #60C8FF;
        }

        .hero-headline {
          font-family: 'Inter', sans-serif;
          font-size: 72px; font-weight: 900;
          line-height: 1.0; letter-spacing: -0.04em;
          margin-bottom: 24px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-headline .line-gold { color: #F5C518; }
        .hero-headline .line-white { color: #fff; }

        .hero-sub {
          font-size: 17px; color: #666; line-height: 1.75;
          margin-bottom: 40px; max-width: 460px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-sub strong { color: rgba(255,255,255,0.85); font-weight: 600; }

        .hero-cta {
          display: flex; gap: 12px; flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .hero-stats {
          display: flex; gap: 40px; margin-top: 56px;
          animation: fadeUp 0.6s 0.4s ease both;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .stat-val {
          font-family: 'Roboto Mono', monospace;
          font-size: 24px; font-weight: 600; color: #F5C518; letter-spacing: -0.02em;
          line-height: 1;
        }
        .stat-label { font-size: 12px; color: #3a3a3a; margin-top: 6px; letter-spacing: 0.02em; }

        /* ── HERO RIGHT CARD ── */
        .hero-right {
          flex: 1; display: flex; justify-content: flex-end;
          position: relative; z-index: 1; padding-left: 64px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .hero-card {
          width: 340px;
          background: linear-gradient(145deg, rgba(26,26,26,0.95), rgba(16,16,20,0.95));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
          box-shadow: 
            0 40px 100px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 1px 0 rgba(255,255,255,0.08) inset;
          position: relative; overflow: hidden;
        }
        .hero-card::before {
          content: '';
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.6), rgba(245,197,24,0.4), transparent);
        }

        /* ── SECTIONS ── */
        .section { padding: 100px 56px; max-width: 1400px; margin: 0 auto; }
        .section-tag {
          display: inline-block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; color: #F5C518; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Inter', sans-serif; font-size: 44px; font-weight: 800;
          text-align: center; letter-spacing: -0.03em; margin-bottom: 14px; line-height: 1.1;
        }
        .section-sub {
          font-size: 16px; color: #555; text-align: center;
          max-width: 500px; margin: 0 auto 56px; line-height: 1.75;
        }

        /* ── CARDS ── */
        .card {
          background: var(--bg-card);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 28px;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .card::before {
          content: ''; position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(135deg, rgba(14,165,233,0.03), transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: rgba(245,197,24,0.18);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,197,24,0.08);
        }
        .card:hover::before { opacity: 1; }

        /* Progress */
        .progress-track {
          background: rgba(255,255,255,0.05); border-radius: 99px; height: 5px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #F5C518, #FFD700);
          box-shadow: 0 0 8px rgba(245,197,24,0.4);
        }

        /* Leaderboard */
        .lb-row {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .lb-row:last-child { border-bottom: none; }

        /* Strip card */
        .strip-card {
          background: var(--bg-card2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px; padding: 22px 20px;
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.2s ease;
        }
        .strip-card:hover { border-color: rgba(245,197,24,0.18); }

        /* ── MODAL ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.82); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal {
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; width: 100%; max-width: 420px;
          position: relative; overflow: hidden;
          animation: slideUp 0.25s ease;
          box-shadow: 0 40px 120px rgba(0,0,0,0.8);
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.6) 30%, rgba(245,197,24,0.6) 70%, transparent);
        }
        .modal-body { padding: 36px 36px 32px; }
        .modal-close {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.05); border: none; color: #555;
          width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-family: 'Inter', sans-serif;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        /* Demo pills */
        .demo-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 14px; cursor: pointer; width: 100%;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s ease; text-align: left;
        }
        .demo-pill:hover {
          background: rgba(245,197,24,0.05);
          border-color: rgba(245,197,24,0.2);
        }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px 56px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          max-width: 1400px; margin: 0 auto;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── SECTION DIVIDER ── */
        .section-divider {
          background: rgba(255,255,255,0.015);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        /* ── REWARD TAG ── */
        .reward-tag {
          background: rgba(245,197,24,0.1);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 8px; padding: 4px 10px;
          font-size: 12px; color: #F5C518; font-weight: 600;
          white-space: nowrap;
        }

        /* ── HOT badge ── */
        .hot-badge {
          background: linear-gradient(90deg, #FF5252, #ff6b6b);
          border-radius: 6px; padding: 3px 9px;
          font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 0.03em;
        }

        @media (max-width: 960px) {
          .nav { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 120px 24px 80px; flex-direction: column; gap: 56px; }
          .hero-right { padding-left: 0; justify-content: flex-start; }
          .hero-headline { font-size: 48px; }
          .section { padding: 72px 24px; }
          .section-title { font-size: 32px; }
          .footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ════ NAV ════ */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <img src="goldenChanceLogo.png" alt="GC" style={{ width: 44, objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <span className="nav-logo-text">
            <span style={{ color: '#F5C518' }}>GOLDEN</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}> CHANCE</span>
          </span>
        </div>

        <div className="nav-links">
          {['Missions', 'Challenges', 'Leaderboard', 'Rewards'].map(l => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div>

        <div className="nav-actions">
          <button className="btn-ghost" style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => openModal('login')}>
            Login
          </button>
          <button className="btn-gold" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => openModal('signup')}>
            Get Started ↗
          </button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg">
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />
          <div className="hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero">
          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="live-dot" />
              <span className="badge-text">LIVE CHALLENGES ACTIVE</span>
            </div>

            <h1 className="hero-headline">
              <span className="line-white">Play Smart.<br /></span>
              <span className="line-gold">Earn Rewards.<br /></span>
              <span className="line-white">Win Daily.</span>
            </h1>

            <p className="hero-sub">
              Join <strong>12,000+ players</strong> predicting match outcomes,
              completing daily missions, and competing for massive prize pools.
            </p>

            <div className="hero-cta">
              <button className="btn-gold" style={{ fontSize: 15, padding: '14px 32px' }} onClick={() => openModal('signup')}>
                Start Playing ↗
              </button>
              <button className="btn-ghost" style={{ fontSize: 15, padding: '13px 28px' }} onClick={() => openModal('login')}>
                Login
              </button>
            </div>

            <div className="hero-stats">
              {[
                { value: '12K+',  label: 'Active Players' },
                { value: '₹4.2L', label: 'Prize Pool Today' },
                { value: '38',    label: 'Live Challenges' },
              ].map(s => (
                <div key={s.label}>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — floating card */}
          <div className="hero-right">
            <div className="hero-card">
              {/* Top Players */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: '#333', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00E676', display: 'inline-block', boxShadow: '0 0 6px #00E676' }} />
                  TOP PLAYERS RIGHT NOW
                </div>
                {[
                  { rank: '🥇', name: 'RahulK', pts: '2,340', delta: '+120' },
                  { rank: '🥈', name: 'Sneha_P', pts: '2,190', delta: '+98' },
                  { rank: '🥉', name: 'Vikram21', pts: '1,985', delta: '+74' },
                ].map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 14 }}>{p.rank}</span>
                    <span style={{ flex: 1, fontSize: 13, color: '#aaa', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: '#F5C518', fontWeight: 600 }}>{p.pts}</span>
                    <span style={{ fontSize: 11, color: '#00E676', marginLeft: 2 }}>{p.delta}</span>
                  </div>
                ))}
              </div>

              {/* Live Challenge pill */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(14,165,233,0.05))',
                border: '1px solid rgba(245,197,24,0.2)',
                borderRadius: 14, padding: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: '#F5C518', fontWeight: 700, letterSpacing: '0.08em' }}>⚡ LIVE</span>
                  <span style={{ flex: 1, height: 1, background: 'rgba(245,197,24,0.15)' }} />
                  <span className="hot-badge">HOT</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>IPL Winner Prediction</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#444', marginBottom: 3 }}>ENTRY</div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 600 }}>₹49</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#444', marginBottom: 3 }}>PRIZE POOL</div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 600, color: '#F5C518' }}>₹25,000</div>
                  </div>
                </div>
                <button className="btn-gold" style={{ width: '100%', padding: '11px', fontSize: 13 }} onClick={() => openModal('signup')}>
                  Join Now
                </button>
              </div>

              {/* Timer row */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#333' }}>⏱</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: '#555' }}>03:42:18</span>
                <span style={{ fontSize: 11, color: '#2a2a2a' }}>remaining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ WHY US ════ */}
      <div className="section-divider">
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <span className="section-tag">WHY GOLDENCHANCE</span>
          </div>
          <h2 className="section-title">
            Built for <span style={{ color: '#F5C518' }}>Winners</span>
          </h2>
          <p className="section-sub">Designed for skill. Rewarding every move you make.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '🎯', title: 'Skill-Based Challenges', desc: 'Win based on your knowledge and strategy — not luck.' },
              { icon: '🔥', title: 'Daily Streaks & Bonuses', desc: 'Log in every day to multiply your rewards with streak bonuses.' },
              { icon: '📊', title: 'Real-Time Leaderboard', desc: 'Track your rank live against thousands of competitors.' },
              { icon: '🏅', title: 'Unlock as You Play', desc: 'Progress through tiers and unlock exclusive rewards automatically.' },
            ].map(f => (
              <div className="card" key={f.title}>
                <div style={{ fontSize: 28, marginBottom: 18, lineHeight: 1 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ DAILY MISSIONS ════ */}
      <div className="section">
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <span className="section-tag">DAILY MISSIONS</span>
        </div>
        <h2 className="section-title">
          Complete & <span style={{ color: '#F5C518' }}>Earn</span>
        </h2>
        <p className="section-sub">Finish missions to earn bonus rewards and climb faster.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { title: 'First Prediction', desc: 'Make your first prediction today', progress: 100, reward: '₹50 Bonus', time: 'Completed ✓', done: true },
            { title: 'Win 3 Challenges', desc: 'Win any 3 challenges today', progress: 66, reward: '₹200 Pool', time: '8h 23m left', done: false },
            { title: 'Streak Master', desc: 'Maintain a 7-day login streak', progress: 42, reward: 'Gold Badge', time: '5 days to go', done: false },
          ].map(m => (
            <div className="card" key={m.title} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5, letterSpacing: '-0.02em' }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: '#444' }}>{m.desc}</div>
                </div>
                <span className="reward-tag" style={{ marginLeft: 12 }}>{m.reward}</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
                  <span style={{ color: '#333' }}>Progress</span>
                  <span style={{
                    color: m.done ? '#00E676' : '#555',
                    fontFamily: "'Roboto Mono', monospace",
                  }}>{m.progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${m.progress}%`,
                    background: m.done ? 'linear-gradient(90deg, #00E676, #5aff96)' : undefined,
                    boxShadow: m.done ? '0 0 8px rgba(0,230,118,0.4)' : undefined,
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: m.done ? '#00E676' : '#3a3a3a' }}>{m.time}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <p style={{ color: '#2a2a2a', fontSize: 13, marginBottom: 16 }}>+ 14 more missions available</p>
          <button className="btn-gold" onClick={() => openModal('login')}>Login to Continue →</button>
        </div>
      </div>

      {/* ════ LIVE CHALLENGES ════ */}
      <div className="section-divider">
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <span className="section-tag">LIVE NOW</span>
          </div>
          <h2 className="section-title">
            Active <span style={{ color: '#F5C518' }}>Challenges</span>
          </h2>
          <p className="section-sub">Compete now. Prizes are waiting.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { name: 'IPL 2025 Winner Prediction', entry: '₹49', pool: '₹25,000', timer: '03:42:18', tag: 'CRICKET', hot: true },
              { name: 'Stock Market Daily Quiz', entry: '₹29', pool: '₹10,000', timer: '05:11:44', tag: 'FINANCE', hot: false },
            ].map(c => (
              <div className="card" key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 10, color: '#0EA5E9', fontWeight: 700,
                    letterSpacing: '0.1em', background: 'rgba(14,165,233,0.1)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    padding: '3px 10px', borderRadius: 6,
                  }}>{c.tag}</span>
                  {c.hot && <span className="hot-badge">🔥 HOT</span>}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Entry Fee', value: c.entry, gold: false },
                    { label: 'Prize Pool', value: c.pool, gold: true },
                  ].map(d => (
                    <div key={d.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, color: '#3a3a3a', marginBottom: 6, letterSpacing: '0.05em' }}>{d.label}</div>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 18, fontWeight: 600, color: d.gold ? '#F5C518' : '#fff' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#333' }}>
                  <span>⏱</span>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", color: '#666', fontSize: 13 }}>{c.timer}</span>
                  <span style={{ color: '#2a2a2a' }}>remaining</span>
                </div>
                <button className="btn-gold" style={{ width: '100%', padding: '12px' }} onClick={() => openModal('signup')}>
                  Join Challenge →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ LEADERBOARD ════ */}
      <div className="section">
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <span className="section-tag">RANKINGS</span>
        </div>
        <h2 className="section-title">
          Top Players <span style={{ color: '#F5C518' }}>Today</span>
        </h2>
        <p className="section-sub">See who's dominating the leaderboard right now.</p>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, overflow: 'hidden', maxWidth: 580, margin: '0 auto 32px',
        }}>
          <div style={{ padding: '0 24px' }}>
            {[
              { rank: 1, name: 'RahulK_Official', pts: '2,340', badge: '🥇', you: false },
              { rank: 2, name: 'Sneha_Predicts',  pts: '2,190', badge: '🥈', you: false },
              { rank: 3, name: 'Vikram21',         pts: '1,985', badge: '🥉', you: false },
              { rank: 4, name: 'Priya_Wins',       pts: '1,820', badge: null, you: false },
              { rank: 47, name: 'You (Alex Crypto)', pts: '640', badge: null, you: true },
            ].map((p, i) => (
              <div key={p.rank} className="lb-row" style={{
                background: p.you ? 'rgba(245,197,24,0.05)' : 'transparent',
                margin: p.you ? '0 -24px' : undefined,
                padding: p.you ? '13px 24px' : '13px 0',
                borderTop: p.you ? '1px solid rgba(245,197,24,0.12)' : undefined,
                borderBottom: i === 3 ? '2px dashed rgba(255,255,255,0.06)' : undefined,
              }}>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: '#2a2a2a', width: 28 }}>#{p.rank}</div>
                <div style={{ fontSize: 15 }}>{p.badge || '  '}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: p.you ? 600 : 400, color: p.you ? '#F5C518' : '#aaa', letterSpacing: '-0.01em' }}>{p.name}</div>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 13, color: p.you ? '#F5C518' : '#555', fontWeight: 600 }}>{p.pts} pts</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn-gold" onClick={() => openModal('login')}>See Your Full Rank →</button>
        </div>
      </div>

      {/* ════ REWARDS ════ */}
      <div className="section-divider">
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <span className="section-tag">REWARDS</span>
          </div>
          <h2 className="section-title">
            Unlock <span style={{ color: '#F5C518' }}>Prizes</span>
          </h2>
          <p className="section-sub">Bigger rewards the more you play.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '💰', title: 'Cash Bonus', value: '₹500', progress: 72, label: '₹360 earned' },
              { icon: '🎲', title: 'Free Bet',   value: '₹200', progress: 45, label: '2 bets used' },
              { icon: '👑', title: 'Exclusive',  value: 'Gold Tier', progress: 28, label: '28% to unlock' },
            ].map(r => (
              <div className="card" key={r.title} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.01em' }}>{r.title}</div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 24, fontWeight: 600, color: '#F5C518' }}>{r.value}</div>
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
                    <span style={{ color: '#333' }}>{r.label}</span>
                    <span style={{ color: '#444', fontFamily: "'Roboto Mono', monospace" }}>{r.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${r.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-gold" onClick={() => openModal('login')}>View All Rewards →</button>
          </div>
        </div>
      </div>

      {/* ════ DASHBOARD PREVIEW ════ */}
      <div className="section">
        <div style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(26,26,26,0.9) 40%, rgba(245,197,24,0.04) 100%)',
          border: '1px solid rgba(14,165,233,0.15)',
          borderRadius: 24, padding: 56,
          display: 'flex', gap: 52, flexWrap: 'wrap' as const, alignItems: 'center',
          position: 'relative' as const, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', left: -80, top: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(14,165,233,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ flex: 1, minWidth: 260, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 10, color: '#0EA5E9', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>PLAYER DASHBOARD</div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.1 }}>
              Your Gaming<br />Dashboard
            </h2>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, marginBottom: 28 }}>
              Everything in one place — wallet, stats, live challenges, and more.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Manage your wallet & transactions', 'Track win rate & performance', 'Join live challenges instantly'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#666' }}>
                  <span style={{ color: '#00E676', fontSize: 13, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button className="btn-gold" style={{ fontSize: 15, padding: '14px 32px' }} onClick={() => openModal('login')}>
              Access Dashboard →
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 260, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Wallet Balance', value: '₹2,450', color: '#F5C518' },
              { label: 'Total Wins', value: '34', color: '#00E676' },
              { label: 'Win Rate', value: '68%', color: '#60BFFF' },
              { label: 'Active Rank', value: '#47', color: '#A78BFA' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 16px' }}>
                <div style={{ fontSize: 11, color: '#333', marginBottom: 10, letterSpacing: '0.03em' }}>{s.label}</div>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ FEATURES STRIP ════ */}
      <div className="section-divider">
        <div className="section" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { icon: '⚡', title: 'Fast & Responsive', sub: 'Sub-second load times' },
              { icon: '📡', title: 'Real-Time Updates', sub: 'Live scores & leaderboards' },
              { icon: '🔒', title: 'Secure System', sub: '256-bit encryption' },
              { icon: '📱', title: 'Mobile Optimized', sub: 'Play on any device' },
              { icon: '💸', title: 'Instant Payouts', sub: 'Withdraw in minutes' },
            ].map(f => (
              <div className="strip-card" key={f.title}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, letterSpacing: '-0.01em' }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#3a3a3a' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ FINAL CTA ════ */}
      <div style={{ padding: '0 56px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          margin: '80px 0',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(26,26,26,0.95) 40%, rgba(245,197,24,0.06) 100%)',
          border: '1px solid rgba(14,165,233,0.15)',
          borderRadius: 24, padding: '80px 52px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 300, borderRadius: '50%', background: 'rgba(245,197,24,0.04)', filter: 'blur(100px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, color: '#0EA5E9', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 20 }}>JOIN TODAY</div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16, lineHeight: 1.0 }}>
              Start Playing &<br /><span style={{ color: '#F5C518' }}>Winning Today</span>
            </h2>
            <p style={{ fontSize: 16, color: '#444', marginBottom: 40 }}>Join 12,000+ players already earning on GoldenChance</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-gold" style={{ fontSize: 15, padding: '15px 40px' }} onClick={() => openModal('signup')}>
                Create Account ↗
              </button>
              <button className="btn-ghost" style={{ fontSize: 15, padding: '14px 34px' }} onClick={() => openModal('login')}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '40px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, maxWidth: 1400, margin: '0 auto' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: 14, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#F5C518' }}>GOLDEN</span>
          <span style={{ color: '#2a2a2a' }}> CHANCE</span>
        </span>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {['About', 'Terms', 'Privacy', 'Support'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#2a2a2a', cursor: 'pointer', transition: 'color 0.15s', letterSpacing: '-0.01em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#666')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2a2a2a')}
            >{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#1a1a1a' }}>© 2025 GoldenChance. All rights reserved.</div>
      </footer>

      {/* ════ MODAL ════ */}
      {modal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="modal">
            <div className="modal-line" />
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-body">

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
                {(['login', 'signup'] as ModalMode[]).map(m => (
                  <button key={m!} onClick={() => { setModal(m); setError('') }} style={{
                    flex: 1, padding: '10px', border: 'none', borderRadius: 9, cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
                    letterSpacing: '-0.01em',
                    background: modal === m ? 'linear-gradient(135deg, #F5C518, #FFD700)' : 'transparent',
                    color: modal === m ? '#0A0A0A' : '#444',
                    transition: 'all 0.2s',
                  }}>
                    {m === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {modal === 'login' ? (
                <>
                  <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Welcome back</h2>
                  <p style={{ fontSize: 13, color: '#333', marginBottom: 24 }}>Sign in to your account to continue</p>
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>EMAIL</label>
                      <input type="email" className="inp" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} required />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>PASSWORD</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? 'text' : 'password'} className="inp" placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} required style={{ paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: 13 }}>
                          {showPass ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <div style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FF5252' }}>
                        ⚠️ {error}
                      </div>
                    )}
                    <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: 4, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', padding: '13px' }}>
                      {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                  </form>
                        
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 14px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                    <span style={{ fontSize: 11, color: '#222', letterSpacing: '0.04em' }}>DEMO ACCOUNTS</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="demo-pill" type="button" onClick={() => { setEmail('player@gc.com'); setPassword('player123'); setError('') }}>
                      <span style={{ fontSize: 18 }}>🎮</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#aaa', fontSize: 13 }}>Player Account</div>
                        <div style={{ fontSize: 11, color: '#333', marginTop: 1 }}>player@gc.com / player123</div>
                      </div>
                    </button>
                    <button className="demo-pill" type="button" onClick={() => { setEmail('admin@gc.com'); setPassword('admin123'); setError('') }}>
                      <span style={{ fontSize: 18 }}>🛡️</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#aaa', fontSize: 13 }}>Admin Account</div>
                        <div style={{ fontSize: 11, color: '#333', marginTop: 1 }}>admin@gc.com / admin123</div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Create Account</h2>
                  <p style={{ fontSize: 13, color: '#333', marginBottom: 24 }}>Join 12,000+ players on GoldenChance</p>
                  <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { label: 'FULL NAME', type: 'text', placeholder: 'Alex Crypto', value: name, setter: setName },
                      { label: 'EMAIL', type: 'email', placeholder: 'you@example.com', value: email, setter: setEmail },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>{f.label}</label>
                        <input type={f.type} className="inp" placeholder={f.placeholder} value={f.value}
                          onChange={e => { (f.setter as (v: string) => void)(e.target.value); setError('') }} required />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>PASSWORD</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? 'text' : 'password'} className="inp" placeholder="Min. 6 characters" value={password} onChange={e => { setPassword(e.target.value); setError('') }} required style={{ paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: 13 }}>
                          {showPass ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#333', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>CONFIRM PASSWORD</label>
                      <input type="password" className="inp" placeholder="Re-enter password" value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }} required />
                    </div>
                    {error && (
                      <div style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FF5252' }}>
                        ⚠️ {error}
                      </div>
                    )}

                    <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: 4, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', padding: '13px' }}>
                      {loading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                  </form>
                </>
              )}

              <p style={{ fontSize: 11, color: '#1a1a1a', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
                By continuing you agree to our Terms of Service & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
