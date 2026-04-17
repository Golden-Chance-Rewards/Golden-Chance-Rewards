"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Types ──────────────────────────────────────────────────────────────────────
type TabId = 'daily' | 'weekly' | 'global'

interface Player {
  rank: number
  name: string
  avatar: string
  points: number
  rewards: string
  badge?: string
  isCurrentUser?: boolean
  change: 'up' | 'down' | 'same'
  changeVal: number
  winRate: number
}

// ── Data ───────────────────────────────────────────────────────────────────────
function genPlayers(tab: TabId): Player[] {
  const bases: Omit<Player, 'rank' | 'points' | 'rewards' | 'change' | 'changeVal' | 'winRate'>[] = [
    { name: 'AlexCrypto',   avatar: 'https://i.pravatar.cc/150?img=11', badge: '👑', isCurrentUser: false },
    { name: 'SarahBet',     avatar: 'https://i.pravatar.cc/150?img=5',  badge: '⚡' },
    { name: 'JohnnyWin',    avatar: 'https://i.pravatar.cc/150?img=7' },
    { name: 'PredictKing',  avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'LuckyStrike',  avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'GoldHunter',   avatar: 'https://i.pravatar.cc/150?img=20' },
    { name: 'NightOwl',     avatar: 'https://i.pravatar.cc/150?img=25' },
    { name: 'BlazeRunner',  avatar: 'https://i.pravatar.cc/150?img=30' },
    { name: 'PhoenixRise',  avatar: 'https://i.pravatar.cc/150?img=35' },
    { name: 'SilverFox',    avatar: 'https://i.pravatar.cc/150?img=40' },
    { name: 'IronClad',     avatar: 'https://i.pravatar.cc/150?img=45' },
    { name: 'CryptoWolf',   avatar: 'https://i.pravatar.cc/150?img=50' },
    { name: 'DiamondHands', avatar: 'https://i.pravatar.cc/150?img=55' },
    { name: 'VaultBreaker', avatar: 'https://i.pravatar.cc/150?img=60' },
    { name: 'You (Alex)',   avatar: 'https://i.pravatar.cc/150?img=33', isCurrentUser: true },
    { name: 'QuantumBet',   avatar: 'https://i.pravatar.cc/150?img=65' },
    { name: 'OracleX',      avatar: 'https://i.pravatar.cc/150?img=70' },
    { name: 'ShadowPick',   avatar: 'https://i.pravatar.cc/150?img=75' },
    { name: 'TitanScore',   avatar: 'https://i.pravatar.cc/150?img=80' },
    { name: 'MaverickGC',   avatar: 'https://i.pravatar.cc/150?img=85' },
  ]

  const multiplier = tab === 'global' ? 100 : tab === 'weekly' ? 10 : 1
  const rewards = ['🏆 +5000 GC', '🥈 +2500 GC', '🥉 +1000 GC', '+500 GC', '+400 GC', '+300 GC', '+250 GC', '+200 GC', '+150 GC', '+100 GC']

  return bases.map((b, i) => ({
    ...b,
    rank: i + 1,
    points: Math.round((20000 - i * 680 + Math.random() * 200) * multiplier / 100) * 100,
    rewards: rewards[i] || '+50 GC',
    change: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'down' : 'same',
    changeVal: Math.floor(Math.random() * 5) + 1,
    winRate: Math.round(90 - i * 2.5 + Math.random() * 5),
  }))
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  arrowUp: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  arrowDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  minus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  trophy: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  ),
  search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
}

// ── Rank Medal ─────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: 22 }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize: 22 }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize: 22 }}>🥉</span>
  return (
    <span style={{
      fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 800,
      color: rank <= 10 ? '#F5C518' : '#555',
      minWidth: 28, textAlign: 'center', display: 'inline-block',
    }}>#{rank}</span>
  )
}

// ── Podium Card ────────────────────────────────────────────────────────────────
function PodiumCard({ player, height, delay }: { player: Player; height: number; delay: number }) {
  const colors: Record<number, { border: string; glow: string; label: string; text: string }> = {
    1: { border: '#F5C518', glow: 'rgba(245,197,24,0.35)', label: '#F5C518', text: '#000' },
    2: { border: '#aaa',    glow: 'rgba(180,180,180,0.2)', label: '#bbb',    text: '#000' },
    3: { border: '#cd7f32', glow: 'rgba(205,127,50,0.2)',  label: '#cd7f32', text: '#000' },
  }
  const c = colors[player.rank]
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      animation: `gcFadeUp 0.6s ${delay}s ease both`,
    }}>
      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        {player.rank === 1 && (
          <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 24 }}>👑</div>
        )}
        <div style={{
          width: player.rank === 1 ? 80 : 64,
          height: player.rank === 1 ? 80 : 64,
          borderRadius: '50%',
          border: `3px solid ${c.border}`,
          boxShadow: `0 0 20px ${c.glow}`,
          overflow: 'hidden',
        }}>
          <img src={player.avatar} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{
          position: 'absolute', bottom: -6, right: -6,
          width: 22, height: 22, borderRadius: '50%',
          background: c.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 900, color: c.text, border: '2px solid #09090d',
          fontFamily: "'Roboto Mono', monospace",
        }}>
          {player.rank}
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', fontFamily: "'Inter', sans-serif" }}>{player.name}</div>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: c.label, fontWeight: 700 }}>
          {player.points.toLocaleString()} pts
        </div>
      </div>

      {/* Podium block */}
      <div style={{
        width: player.rank === 1 ? 110 : 90,
        height,
        borderRadius: '10px 10px 0 0',
        background: `linear-gradient(180deg, ${c.border}22 0%, ${c.border}08 100%)`,
        border: `1px solid ${c.border}44`,
        borderBottom: 'none',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 10,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: c.label, fontFamily: "'Roboto Mono', monospace" }}>
          {player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : '3rd'}
        </span>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('daily')
  const [players, setPlayers]     = useState<Player[]>([])
  const [search, setSearch]       = useState('')
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = localStorage.getItem('gc_auth')
    if (!raw) { router.push('/'); return }
    const auth = JSON.parse(raw)
    if (auth.role !== 'player') { router.push('/'); return }
  }, [router])

  useEffect(() => {
    setPlayers(genPlayers(activeTab))
  }, [activeTab])

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const top3 = players.slice(0, 3)
  const currentUser = players.find(p => p.isCurrentUser)

  const tabs: { id: TabId; label: string; emoji: string; desc: string }[] = [
    { id: 'daily',  label: 'Daily',  emoji: '☀️', desc: 'Resets at midnight' },
    { id: 'weekly', label: 'Weekly', emoji: '📅', desc: 'Resets Sunday' },
    { id: 'global', label: 'Global', emoji: '🌍', desc: 'All-time ranking' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap');

        :root {
          --gold:    #F5C518;
          --accent:  #FFD700;
          --bg:      #09090d;
          --card:    #111117;
          --card2:   #16161e;
          --border:  #1e1e2c;
          --muted:   #44445a;
          --fg:      #F0F0F0;
          --success: #00E676;
          --danger:  #FF5252;
          --blue:    #4da6ff;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

        body { background: var(--bg); }

        @keyframes gcFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gcFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes gcSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%  { opacity: 0.5; }
        }

        /* ── TABS ── */
        .lb-tab-btn {
          flex: 1; padding: 11px 8px; border-radius: 10px; border: none;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
        }
        .lb-tab-btn.active {
          background: var(--card);
          color: #F5C518;
          border: 1px solid rgba(245,197,24,0.18);
          box-shadow: 0 4px 20px rgba(245,197,24,0.08);
        }
        .lb-tab-btn.inactive {
          background: transparent; color: #444;
          border: 1px solid transparent;
        } 
        .lb-tab-btn.inactive:hover { color: #888; }
        
        /* ── TABLE ROWS ── */
        .lb-row {
          display: grid;
          grid-template-columns: 52px 1fr 130px 120px 80px;
          align-items: center;
          gap: 0;
          padding: 0 20px;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          cursor: default;
          animation: gcSlideIn 0.35s ease both;
        }
        .lb-row:hover { background: rgba(255,255,255,0.02); }
        .lb-row.current-user {
          background: rgba(245,197,24,0.05) !important;
          border-color: rgba(245,197,24,0.15) !important;
          border-left: 3px solid #F5C518;
        }
        .lb-row.top-3 { background: rgba(245,197,24,0.03); }

        /* ── SEARCH ── */
        .lb-search {
          background: var(--card2); border: 1px solid var(--border);
          border-radius: 10px; color: #F0F0F0; font-size: 14px;
          padding: 10px 14px 10px 40px; width: 100%; outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lb-search:focus { border-color: rgba(245,197,24,0.3); box-shadow: 0 0 0 3px rgba(245,197,24,0.06); }
        .lb-search::placeholder { color: #444; }

        /* ── WIN RATE BAR ── */
        .lb-winbar-bg { height: 4px; background: #1e1e2c; border-radius: 4px; overflow: hidden; }
        .lb-winbar-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, #F5C518, #FFD700);
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── SHIMMER GOLD TEXT ── */
        .lb-shimmer {
          background: linear-gradient(90deg, #F5C518 0%, #FFD700 30%, #fff 50%, #FFD700 70%, #F5C518 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* ── STICKY TABLE HEADER ── */
        .lb-table-head {
          display: grid;
          grid-template-columns: 52px 1fr 130px 120px 80px;
          align-items: center;
          padding: 0 20px;
          height: 44px;
          position: sticky;
          top: 0;
          background: rgba(14,14,21,0.98);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 10;
        }

        @media (max-width: 680px) {
          .lb-row, .lb-table-head {
            grid-template-columns: 44px 1fr 90px 80px;
          }
          .lb-col-winrate { display: none !important; }
          .lb-hero-stats { flex-direction: column !important; gap: 8px !important; }
          .lb-podium { gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .lb-row, .lb-table-head {
            grid-template-columns: 40px 1fr 80px;
            padding: 0 12px;
          }
          .lb-col-points { display: none !important; }
        }
      `}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)', fontFamily: "'Inter', sans-serif" }}>
                  {/* ══ PAGE BODY ══ */}
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>

          {/* ── PAGE TITLE ── */}
          <div style={{ marginBottom: 28, animation: 'gcFadeUp 0.5s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.trophy style={{ color: '#F5C518', width: 20, height: 20 }} />
              </div>
              <h1 className="lb-shimmer" style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Leaderboard
              </h1>
            </div>
            <p style={{ color: '#555', fontSize: 14, paddingLeft: 52, fontFamily: "'Inter', sans-serif" }}>
              Compete against the best predictors. Top players earn massive GC rewards every cycle.
            </p>
          </div>

          {/* ── TABS ── */}
          <div style={{ background: '#0e0e15', borderRadius: 14, padding: 5, display: 'flex', gap: 4, marginBottom: 24, animation: 'gcFadeUp 0.5s 0.1s ease both', animationFillMode: 'both' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`lb-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
              >
                {tab.emoji} {tab.label}
                {activeTab === tab.id && (
                  <span style={{ display: 'block', fontSize: 10, color: '#666', fontWeight: 400, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{tab.desc}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── HERO STATS ── */}
          <div className="lb-hero-stats" style={{ display: 'flex', gap: 12, marginBottom: 28, animation: 'gcFadeUp 0.5s 0.15s ease both', animationFillMode: 'both' }}>
            {[
              { label: 'Total Players', value: '14,820', icon: '👥' },
              { label: 'Prize Pool',    value: '100,000 GC', icon: '💰', gold: true },
              { label: 'Your Rank',     value: currentUser ? `#${currentUser.rank}` : '—', icon: '📍', highlight: true },
              { label: 'Your Points',   value: currentUser ? currentUser.points.toLocaleString() : '—', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: 'var(--card)', border: `1px solid ${s.highlight ? 'rgba(245,197,24,0.25)' : 'var(--border)'}`,
                borderRadius: 14, padding: '16px 18px',
                boxShadow: s.highlight ? '0 0 20px rgba(245,197,24,0.06)' : 'none',
              }}>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>{s.icon} {s.label}</div>
                <div style={{
                  fontFamily: "'Roboto Mono', monospace", fontSize: 'clamp(15px,2vw,20px)', fontWeight: 700,
                  color: s.gold ? '#F5C518' : s.highlight ? '#F5C518' : '#F0F0F0',
                }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── PODIUM ── */}
          {top3.length === 3 && (
            <div style={{ marginBottom: 28, animation: 'gcFadeUp 0.6s 0.2s ease both', animationFillMode: 'both' }}>
              <div style={{ fontSize: 12, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>🏆 Top Performers</div>
              <div className="lb-podium" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24 }}>
                {/* 2nd */}
                <PodiumCard player={top3[1]} height={80}  delay={0.25} />
                {/* 1st */}
                <PodiumCard player={top3[0]} height={110} delay={0.2}  />
                {/* 3rd */}
                <PodiumCard player={top3[2]} height={60}  delay={0.3}  />
              </div>
            </div>
          )}

          {/* ── CURRENT USER STICKY BANNER (if not in top 5) ── */}
          {currentUser && currentUser.rank > 5 && (
            <div style={{
              background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.2)',
              borderRadius: 12, padding: '12px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              animation: 'gcFadeUp 0.5s 0.3s ease both', animationFillMode: 'both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #F5C518', overflow: 'hidden' }}>
                  <img src={currentUser.avatar} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: "'Inter', sans-serif" }}>Your position</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#F0F0F0', fontFamily: "'Inter', sans-serif" }}>{currentUser.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: "'Inter', sans-serif" }}>Rank</div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 700, color: '#F5C518' }}>#{currentUser.rank}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: "'Inter', sans-serif" }}>Points</div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 16, fontWeight: 700, color: '#F0F0F0' }}>{currentUser.points.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: "'Inter', sans-serif" }}>Reward</div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 13, fontWeight: 700, color: '#F5C518' }}>{currentUser.rewards}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TABLE ── */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden',
            animation: 'gcFadeUp 0.5s 0.35s ease both', animationFillMode: 'both',
          }}>
            {/* Search bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Icons.search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#444' }} />
                <input
                  className="lb-search"
                  placeholder="Search players…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ fontSize: 12, color: '#444', whiteSpace: 'nowrap', fontFamily: "'Roboto Mono', monospace" }}>
                {filtered.length} players
              </div>
            </div>

            {/* Sticky column header */}
            <div className="lb-table-head">
              <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>Rank</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>User</div>
              <div className="lb-col-points" style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>Points</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>Rewards</div>
              <div className="lb-col-winrate" style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: "'Inter', sans-serif" }}>Win %</div>
            </div>

            {/* Scrollable rows */}
            <div ref={tableRef} style={{ maxHeight: 520, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#444', fontFamily: "'Inter', sans-serif" }}>No players found.</div>
              ) : (
                filtered.map((p, idx) => (
                  <div
                    key={p.rank}
                    className={`lb-row ${p.isCurrentUser ? 'current-user' : ''} ${p.rank <= 3 ? 'top-3' : ''}`}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    {/* Rank */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <RankBadge rank={p.rank} />
                    </div>

                    {/* User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          border: p.isCurrentUser ? '2px solid #F5C518' : p.rank <= 3 ? '2px solid rgba(245,197,24,0.4)' : '2px solid var(--border)',
                          overflow: 'hidden',
                        }}>
                          <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {p.isCurrentUser && (
                          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#00E676', border: '1.5px solid var(--card)', animation: 'pulse 2s infinite' }} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700,
                          color: p.isCurrentUser ? '#F5C518' : '#F0F0F0',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontFamily: "'Inter', sans-serif",
                        }}>
                          {p.name}
                          {p.badge && <span style={{ fontSize: 13 }}>{p.badge}</span>}
                          {p.isCurrentUser && <span style={{ fontSize: 10, fontWeight: 700, background: '#F5C518', color: '#000', padding: '1px 6px', borderRadius: 4, fontFamily: "'Inter', sans-serif" }}>YOU</span>}
                        </div>
                        {/* Change indicator */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          {p.change === 'up' && (
                            <>
                              <Icons.arrowUp style={{ width: 10, height: 10, color: '#00E676' }} />
                              <span style={{ fontSize: 10, color: '#00E676', fontFamily: "'Roboto Mono', monospace" }}>+{p.changeVal}</span>
                            </>
                          )}
                          {p.change === 'down' && (
                            <>
                              <Icons.arrowDown style={{ width: 10, height: 10, color: '#FF5252' }} />
                              <span style={{ fontSize: 10, color: '#FF5252', fontFamily: "'Roboto Mono', monospace" }}>-{p.changeVal}</span>
                            </>
                          )}
                          {p.change === 'same' && (
                            <>
                              <Icons.minus style={{ width: 10, height: 10, color: '#555' }} />
                              <span style={{ fontSize: 10, color: '#555', fontFamily: "'Roboto Mono', monospace" }}>—</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="lb-col-points">
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 700, color: p.rank <= 3 ? '#F5C518' : '#F0F0F0' }}>
                        {p.points.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 10, color: '#444', marginTop: 1, fontFamily: "'Inter', sans-serif" }}>pts</div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <span style={{
                        display: 'inline-block', fontFamily: "'Roboto Mono', monospace",
                        fontSize: 12, fontWeight: 700,
                        padding: '4px 10px', borderRadius: 20,
                        background: p.rank <= 3 ? 'rgba(245,197,24,0.12)' : 'rgba(255,255,255,0.04)',
                        border: p.rank <= 3 ? '1px solid rgba(245,197,24,0.25)' : '1px solid rgba(255,255,255,0.06)',
                        color: p.rank <= 3 ? '#F5C518' : '#888',
                      }}>
                        {p.rewards}
                      </span>
                    </div>

                    {/* Win Rate */}
                    <div className="lb-col-winrate">
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, fontWeight: 700, color: '#F0F0F0', marginBottom: 4 }}>
                        {p.winRate}%
                      </div>
                      <div className="lb-winbar-bg" style={{ width: 60 }}>
                        <div className="lb-winbar-fill" style={{ width: `${p.winRate}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Table footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#444', fontFamily: "'Inter', sans-serif" }}>
                Showing {filtered.length} of {players.length} players
              </span>
              <span style={{ fontSize: 12, color: '#444', fontFamily: "'Roboto Mono', monospace" }}>
                {activeTab === 'daily' && '⏱ Resets at midnight'}
                {activeTab === 'weekly' && '⏱ Resets Sunday midnight'}
                {activeTab === 'global' && '🌍 All-time rankings'}
              </span>
            </div>
          </div>

          {/* ── REWARD TIERS ── */}
          <div style={{ marginTop: 24, animation: 'gcFadeUp 0.5s 0.4s ease both', animationFillMode: 'both' }}>
            <div style={{ fontSize: 12, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>🎁 Reward Tiers</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {[
                { label: '🥇 Rank 1',     reward: '+5,000 GC', color: '#F5C518' },
                { label: '🥈 Rank 2',     reward: '+2,500 GC', color: '#aaa'    },
                { label: '🥉 Rank 3',     reward: '+1,000 GC', color: '#cd7f32' },
                { label: '🏅 Rank 4–10',  reward: '+500 GC',   color: '#4da6ff' },
                { label: '🎯 Rank 11–50', reward: '+200 GC',   color: '#888'    },
                { label: '✨ Rank 51–100',reward: '+50 GC',    color: '#666'    },
              ].map((tier, i) => (
                <div key={i} style={{
                  background: 'var(--card)', border: `1px solid ${tier.color}22`,
                  borderRadius: 12, padding: '12px 14px',
                  borderLeft: `3px solid ${tier.color}`,
                }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{tier.label}</div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 700, color: tier.color }}>{tier.reward}</div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
