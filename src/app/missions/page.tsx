"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/nav/Header'

// ── Types ─────────────────────────────────────────────────────────────────────
type MissionStatus = 'active' | 'completed' | 'claimed' | 'locked' | 'event'
type TabId = 'daily' | 'weekly' | 'events'

interface Mission {
  id: number
  title: string
  desc: string
  reward: string
  rewardType: 'gold' | 'success' | 'muted'
  progress: number
  total: number
  status: MissionStatus
  tags: { label: string; type: 'hot' | 'premium' | 'almost' | 'event' }[]
  timer?: string
  rules: string[]
  xp: number
  tab: TabId
}

// ── Missions Data ──────────────────────────────────────────────────────────────
const MISSIONS: Mission[] = [
  // ── DAILY ──
  {
    id: 1, tab: 'daily',
    title: 'Play 3 Prediction Games',
    desc: 'Participate in any 3 active prediction challenges today to earn your daily bonus.',
    reward: '+50 GC', rewardType: 'gold',
    progress: 2, total: 3, status: 'active',
    tags: [{ label: '🔥 Hot', type: 'hot' }],
    timer: '04:12:39',
    rules: [
      'Join any active challenge from the Challenges tab',
      'Each prediction counts once per challenge',
      'Progress resets at midnight',
    ],
    xp: 20,
  },
  {
    id: 2, tab: 'daily',
    title: '7-Day Login Streak',
    desc: 'Log in for 7 consecutive days without breaking your streak to claim the bonus reward box.',
    reward: '+100 GC', rewardType: 'gold',
    progress: 7, total: 7, status: 'completed',
    tags: [{ label: '⚡ Premium', type: 'premium' }],
    rules: [
      'Must log in every calendar day',
      'Missing a day resets the streak counter',
      'Reward is credited instantly on completion',
    ],
    xp: 50,
  },
  {
    id: 3, tab: 'daily',
    title: 'Win 2 Predictions',
    desc: 'Make correct predictions in at least 2 challenges to prove your skill.',
    reward: '+75 GC', rewardType: 'gold',
    progress: 1, total: 2, status: 'active',
    tags: [{ label: '⏳ Almost', type: 'almost' }],
    timer: '02:45:00',
    rules: [
      'Prediction must be locked before match starts',
      'Both wins must occur on the same calendar day',
      'Bonus stacks with challenge winnings',
    ],
    xp: 30,
  },
  {
    id: 4, tab: 'daily',
    title: 'Claim Daily Spin',
    desc: 'You have already claimed your daily spin reward. Come back tomorrow!',
    reward: 'Claimed', rewardType: 'muted',
    progress: 1, total: 1, status: 'claimed',
    tags: [],
    rules: ['One spin per day', 'Rewards are randomised'],
    xp: 0,
  },

  // ── WEEKLY ──
  {
    id: 5, tab: 'weekly',
    title: 'Top 100 Leaderboard',
    desc: 'Reach the top 100 players on the weekly leaderboard by accumulating the most GC.',
    reward: '+500 GC', rewardType: 'gold',
    progress: 142, total: 100, status: 'active',
    tags: [{ label: '⚡ Premium', type: 'premium' }],
    timer: '2d 14h 30m',
    rules: [
      'Rank is calculated every 30 minutes',
      'GC earned from all sources count',
      'Reward paid at weekly reset on Sunday midnight',
    ],
    xp: 200,
  },
  {
    id: 6, tab: 'weekly',
    title: 'Refer 3 Friends',
    desc: 'Invite 3 new players who complete their first prediction challenge this week.',
    reward: '+250 GC', rewardType: 'gold',
    progress: 1, total: 3, status: 'active',
    tags: [{ label: '🔥 Hot', type: 'hot' }],
    timer: '2d 14h 30m',
    rules: [
      'Referrals must use your unique link',
      'Each friend must complete at least one prediction',
      'GC credited within 24 hours of qualification',
    ],
    xp: 100,
  },
  {
    id: 7, tab: 'weekly',
    title: 'Win 10 Predictions',
    desc: 'Demonstrate consistent skill by winning 10 prediction challenges this week.',
    reward: '+300 GC', rewardType: 'gold',
    progress: 0, total: 10, status: 'locked',
    tags: [],
    timer: '2d 14h 30m',
    rules: [
      'Unlock by completing "Win 2 Predictions" daily mission first',
      'All game types count toward this total',
      'Progress carries over each day within the week',
    ],
    xp: 120,
  },

  // ── EVENTS ──
  {
    id: 8, tab: 'events',
    title: '🏆 Grand Prediction Cup',
    desc: 'Weekend Special Event — predict outcomes for all 4 featured matches to earn the exclusive Grand Cup badge and massive prize from the 100,000 GC prize pool.',
    reward: '+1000 GC', rewardType: 'gold',
    progress: 2, total: 4, status: 'event',
    tags: [{ label: '🎯 Event', type: 'event' }],
    timer: '1d 06h 00m',
    rules: [
      'Must enter before the first match begins',
      'All 4 matches must be predicted to qualify',
      'Top predictor gets an additional ₹5,000 cash bonus',
      'Entry requires minimum 100 GC balance',
    ],
    xp: 500,
  },
  {
    id: 9, tab: 'events',
    title: '⚡ CS:GO Major Final Predictor',
    desc: 'Predict the outcome of the CS:GO Major Final — Team NA vs Team EU. Lock your stake before the match starts and climb the leaderboard. Closing soon!',
    reward: '+2500 GC', rewardType: 'gold',
    progress: 8, total: 30, status: 'event',
    tags: [{ label: '⚡ Premium', type: 'premium' }, { label: '🎯 Event', type: 'event' }],
    timer: '0d 08h 30m',
    rules: [
      'Entry fee: 100 GC per prediction',
      '1,284 players already joined — pool: 50,000 GC',
      'Accuracy percentage decides final rank',
      'Prizes distributed across top 10 tiers',
    ],
    xp: 1000,
  },
  {
    id: 10, tab: 'events',
    title: '🎯 Weekly Crypto Trivia',
    desc: 'Test your crypto knowledge in this week\'s trivia challenge. Answer all questions correctly to share the prize pool with other winners.',
    reward: '+400 GC', rewardType: 'gold',
    progress: 3, total: 10, status: 'event',
    tags: [{ label: '🔥 Hot', type: 'hot' }, { label: '🎯 Event', type: 'event' }],
    timer: '4d 12h 00m',
    rules: [
      'Free to enter — no GC required',
      '856 players joined — pool: 15,000 GC',
      'All questions must be answered in one session',
      'Top 50 accurate players share the prize pool',
    ],
    xp: 300,
  },
]

// ── Inline SVG Icons ───────────────────────────────────────────────────────────
const Icons = {
  target: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  home: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  wallet: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" stroke="none"/>
      <path d="M22 7V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  bell: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  logout: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  lock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  star: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  x: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  addCircle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
}

// ── Coin Burst ─────────────────────────────────────────────────────────────────
function spawnCoins(originX: number, originY: number) {
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div')
    el.textContent = '🪙'
    const angle = (i / 12) * 360
    const dist  = 80 + Math.random() * 60
    const dx    = Math.cos((angle * Math.PI) / 180) * dist
    const dy    = Math.sin((angle * Math.PI) / 180) * dist - 40
    el.style.cssText = `
      position:fixed; pointer-events:none; font-size:20px; z-index:9999;
      left:${originX}px; top:${originY}px;
      --dx:${dx}px; --dy:${dy}px; --rot:${Math.random() * 360}deg;
      animation: coinBurst 0.9s ease-out forwards;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 950)
  }
}

// ── Mission Card Component ─────────────────────────────────────────────────────
function MissionCard({
  mission,
  onOpen,
  shaking,
}: {
  mission: Mission
  onOpen: (m: Mission) => void
  shaking: boolean
}) {
  const pct = Math.min((mission.progress / mission.total) * 100, 100)

  const statusClass =
    mission.status === 'completed' ? 'gc-card-completed' :
    mission.status === 'claimed'   ? 'gc-card-claimed'   :
    mission.status === 'locked'    ? 'gc-card-locked'    :
    mission.status === 'event'     ? 'gc-card-event'     : ''

  const tagColors: Record<string, string> = {
    hot:     'rgba(245,197,24,0.1)',
    premium: 'rgba(255,215,0,0.08)',
    almost:  'rgba(255,82,82,0.1)',
    event:   'rgba(245,197,24,0.1)',
  }
  const tagTextColors: Record<string, string> = {
    hot:     '#F5C518',
    premium: '#FFD700',
    almost:  '#FF5252',
    event:   '#F5C518',
  }

  return (
    <div
      className={`gc-mission-card ${statusClass} ${shaking ? 'gc-card-shake' : ''}`}
      onClick={() => onOpen(mission)}
      style={{ animationDelay: `${mission.id * 0.05}s` }}
    >
      {/* Locked overlay */}
      {mission.status === 'locked' && (
        <div className="gc-locked-overlay">
          <Icons.lock style={{ width: 28, height: 28, color: '#555' }} />
          <p style={{ color: '#555', fontSize: 12, textAlign: 'center', padding: '0 24px' }}>
            Complete prerequisites to unlock
          </p>
        </div>
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {mission.tags.map(t => (
            <span key={t.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              background: tagColors[t.type],
              color: tagTextColors[t.type],
              border: `1px solid ${tagTextColors[t.type]}44`,
            }}>{t.label}</span>
          ))}
          {mission.status === 'completed' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(0,230,118,0.1)', color: '#00E676', border: '1px solid rgba(0,230,118,0.3)' }}>
              ✓ Completed
            </span>
          )}
        </div>
        <span style={{
          fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
          padding: '5px 12px', borderRadius: 30, whiteSpace: 'nowrap', flexShrink: 0,
          background: mission.rewardType === 'gold' ? '#F5C518' : mission.rewardType === 'success' ? '#00E676' : '#2a2a2a',
          color: mission.rewardType === 'muted' ? '#888' : '#000',
        }}>{mission.reward}</span>
      </div>

      {/* Title & desc */}
      <div style={{ fontSize: 16, fontWeight: 800, color: '#F0F0F0', marginBottom: 5, lineHeight: 1.3 }}>{mission.title}</div>
      <div style={{ fontSize: 13, color: '#888', lineHeight: 1.55, marginBottom: 16,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
        {mission.desc}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ height: 7, background: '#2e2e2e', borderRadius: 10, overflow: 'hidden' }}>
          <div className="gc-progress-fill" style={{
            width: `${pct}%`,
            height: '100%', borderRadius: 10,
            background: mission.status === 'completed'
              ? 'linear-gradient(90deg, #00E676, #69ffb0)'
              : 'linear-gradient(90deg, #F5C518, #FFD700)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#888' }}>
            {mission.progress} / {mission.total}
          </span>
          {mission.timer && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 12, color: '#FF5252' }}>
              <Icons.clock style={{ width: 11, height: 11 }} /> {mission.timer}
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      {mission.status === 'completed' && (
        <button className="gc-card-btn gc-btn-success" onClick={e => e.stopPropagation()}>
          🎁 Claim Reward
        </button>
      )}
      {mission.status === 'active' && (
        <button className="gc-card-btn gc-btn-gold" onClick={e => e.stopPropagation()}>
          Start Mission →
        </button>
      )}
      {mission.status === 'event' && (
        <button className="gc-card-btn gc-btn-gold" onClick={e => e.stopPropagation()}>
          Join Event →
        </button>
      )}
      {mission.status === 'claimed' && (
        <button className="gc-card-btn gc-btn-muted" disabled>Already Claimed</button>
      )}
      {mission.status === 'locked' && (
        <button className="gc-card-btn gc-btn-muted" disabled>🔒 Locked</button>
      )}
    </div>
  )
}

// ── Mission Modal Component ────────────────────────────────────────────────────
function MissionModal({
  mission,
  onClose,
  onClaim,
}: {
  mission: Mission | null
  onClose: () => void
  onClaim: (id: number, e: React.MouseEvent) => void
}) {
  if (!mission) return null
  const pct = Math.min((mission.progress / mission.total) * 100, 100)

  return (
    <div className="gc-modal-backdrop" onClick={onClose}>
      <div className="gc-modal-box" onClick={e => e.stopPropagation()}>
        {/* Gold line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #F5C518, #FFD700, #F5C518)' }} />

        {/* Head */}
        <div style={{ padding: '20px 22px 14px', position: 'relative' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#F0F0F0', paddingRight: 36 }}>{mission.title}</div>
          <button className="gc-modal-close" onClick={onClose}>
            <Icons.x style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.65 }}>{mission.desc}</p>

          {/* Progress */}
          <div style={{ background: '#232323', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 10 }}>📊 Progress</div>
            <div style={{ height: 8, background: '#2e2e2e', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
              <div className="gc-progress-fill" style={{
                width: `${pct}%`, height: '100%', borderRadius: 10,
                background: mission.status === 'completed'
                  ? 'linear-gradient(90deg,#00E676,#69ffb0)'
                  : 'linear-gradient(90deg,#F5C518,#FFD700)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 13 }}>
              <span style={{ color: '#888' }}>{mission.progress} / {mission.total} completed</span>
              <span style={{ color: '#F5C518', fontWeight: 700 }}>{Math.round(pct)}%</span>
            </div>
          </div>

          {/* Rewards */}
          <div style={{ background: '#232323', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 10 }}>🎁 Rewards</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)', color: '#F5C518' }}>
                💰 {mission.reward}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
                ⚡ +{mission.xp} XP
              </span>
            </div>
          </div>

          {/* Rules */}
          <div style={{ background: '#232323', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 10 }}>📋 Rules</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {mission.rules.map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C518', marginTop: 7, flexShrink: 0, display: 'inline-block' }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Timer */}
          {mission.timer && (
            <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#FF5252' }}>
              ⏳ Ends in: {mission.timer}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="gc-modal-btn-secondary" onClick={onClose}>Close</button>
            {mission.status === 'completed' && (
              <button className="gc-modal-btn-primary gc-modal-btn-success"
                onClick={e => onClaim(mission.id, e)}>
                🎁 Claim Reward
              </button>
            )}
            {(mission.status === 'active' || mission.status === 'event') && (
              <button className="gc-modal-btn-primary">Start Now →</button>
            )}
            {mission.status === 'claimed' && (
              <button className="gc-modal-btn-primary" style={{ opacity: 0.5 }} disabled>Already Claimed</button>
            )}
            {mission.status === 'locked' && (
              <button className="gc-modal-btn-primary" style={{ opacity: 0.5 }} disabled>🔒 Locked</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MissionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('daily')
  const [missions, setMissions]   = useState<Mission[]>(MISSIONS)
  const [openMission, setOpenMission] = useState<Mission | null>(null)
  const [shakingId, setShakingId]     = useState<number | null>(null)
  const [userName, setUserName]       = useState('Player')

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('gc_auth')
    if (!raw) { router.push('/'); return }
    const auth = JSON.parse(raw)
    if (auth.role !== 'player') { router.push('/'); return }
    setUserName(auth.name || 'Player')
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('gc_auth')
    router.push('/')
  }

  // ── Claim Handler ───────────────────────────────────────────────────────────
  const handleClaim = (id: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    spawnCoins(rect.left + rect.width / 2, rect.top)
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'claimed' } : m))
    setOpenMission(null)
  }

  // ── Open modal (shake if locked) ────────────────────────────────────────────
  const handleOpen = (m: Mission) => {
    if (m.status === 'locked') {
      setShakingId(m.id)
      setTimeout(() => setShakingId(null), 500)
      return
    }
    setOpenMission(m)
  }

  const tabMissions = missions.filter(m => m.tab === activeTab)
  const tabs: { id: TabId; label: string; emoji: string }[] = [
    { id: 'daily',  label: 'Daily',  emoji: '☀️' },
    { id: 'weekly', label: 'Weekly', emoji: '📅' },
    { id: 'events', label: 'Events', emoji: '🏆' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        :root {
          --gold:    #F5C518;
          --accent:  #FFD700;
          --bg:      #09090d;
          --card:    #111117;
          --card2:   #1a1a22;
          --border:  #222230;
          --muted:   #666680;
          --fg:      #F0F0F0;
          --success: #00E676;
          --danger:  #FF5252;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        /* ── PROGRESS ANIMATION ── */
        @keyframes progressIn {
          from { width: 0 !important; }
        }
        .gc-progress-fill { animation: progressIn 1.1s cubic-bezier(0.4,0,0.2,1) both; }

        /* ── CARD ── */
        .gc-mission-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          position: relative;
          overflow: hidden;
          animation: gcFadeUp 0.4s ease both;
        }
        .gc-mission-card:hover {
          transform: scale(1.015);
          box-shadow: 0 0 24px rgba(245,197,24,0.1);
        }
        .gc-card-completed {
          border-color: rgba(0,230,118,0.4) !important;
          box-shadow: 0 0 18px rgba(0,230,118,0.08);
        }
        .gc-card-completed:hover { box-shadow: 0 0 28px rgba(0,230,118,0.18) !important; }
        .gc-card-claimed { opacity: 0.5; cursor: default !important; }
        .gc-card-claimed:hover { transform: none !important; box-shadow: none !important; }
        .gc-card-locked { cursor: default !important; }
        .gc-card-event {
          border-color: rgba(245,197,24,0.25) !important;
          background: linear-gradient(135deg, rgba(245,197,24,0.04) 0%, rgba(255,215,0,0.02) 100%) !important;
        }
        .gc-card-shake { animation: gcShake 0.45s ease both !important; }

        /* ── LOCKED OVERLAY ── */
        .gc-locked-overlay {
          position: absolute; inset: 0;
          background: rgba(9,9,13,0.75);
          backdrop-filter: blur(3px);
          border-radius: 14px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          z-index: 5;
        }

        /* ── BUTTONS ── */
        .gc-card-btn {
          width: 100%; padding: 11px 0; border-radius: 10px;
          border: none; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .gc-card-btn:hover:not(:disabled) { transform: scale(1.025); }
        .gc-card-btn:active:not(:disabled) { transform: scale(0.97); }
        .gc-card-btn:disabled { cursor: not-allowed; }
        .gc-btn-gold    { background: var(--gold);    color: #000; }
        .gc-btn-gold:hover:not(:disabled)    { box-shadow: 0 0 18px rgba(245,197,24,0.4); }
        .gc-btn-success { background: var(--success); color: #000; }
        .gc-btn-success:hover:not(:disabled) { box-shadow: 0 0 18px rgba(0,230,118,0.4); }
        .gc-btn-muted   { background: #1e1e2a; color: var(--muted); }

        /* ── MODAL ── */
        .gc-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: gcFadeBg 0.25s ease both;
        }
        .gc-modal-box {
          background: var(--card);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 18px;
          width: 100%; max-width: 460px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.8);
          animation: gcModalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .gc-modal-close {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.06); border: none; border-radius: 50%;
          width: 30px; height: 30px; color: #888;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .gc-modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .gc-modal-btn-secondary {
          flex: 1; padding: 12px; border-radius: 12px; border: none;
          background: rgba(255,255,255,0.06); color: #888;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s, color 0.2s;
        }
        .gc-modal-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .gc-modal-btn-primary {
          flex: 1; padding: 12px; border-radius: 12px; border: none;
          background: var(--gold); color: #000;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 800;
          cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
        }
        .gc-modal-btn-primary:hover:not(:disabled) { transform: scale(1.03); box-shadow: 0 0 20px rgba(245,197,24,0.4); }
        .gc-modal-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .gc-modal-btn-success { background: var(--success) !important; }
        .gc-modal-btn-success:hover:not(:disabled) { box-shadow: 0 0 20px rgba(0,230,118,0.4) !important; }

        /* ── NAV ── */
        .gc-nav-link { transition: color 0.15s; }
        .gc-nav-link:hover { color: #fff !important; }
        .gc-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          background: transparent; color: #666;
          border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .gc-logout-btn:hover { color: #ff5252; border-color: rgba(255,82,82,0.3); background: rgba(255,82,82,0.06); }

        /* ── KEYFRAMES ── */
        @keyframes gcFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gcFadeBg {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes gcModalIn {
          from { opacity: 0; transform: scale(0.88) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gcShake {
          0%,100% { transform: translateX(0); }
          18%  { transform: translateX(-6px); }
          36%  { transform: translateX(6px); }
          54%  { transform: translateX(-4px); }
          72%  { transform: translateX(4px); }
        }
        @keyframes coinBurst {
          0%   { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--dx),var(--dy)) scale(0.5) rotate(var(--rot)); }
        }
        .coin-particle {
          position: fixed; pointer-events: none; font-size: 20px;
          z-index: 9999; animation: coinBurst 0.9s ease-out forwards;
        }

        @media (max-width: 480px) {
          .gc-missions-main { padding: 16px 12px 60px !important; }
          .gc-hero { padding: 24px 18px !important; }
          .gc-mission-card { padding: 16px !important; }
        }
      `}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--fg)', fontFamily: "'Inter', sans-serif" }}>

        <Header
          active="Missions"
          rightContent={
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--card)', borderRadius: 999,
                padding: '8px 6px 8px 14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Icons.wallet style={{ color: '#F5C518', width: 16, height: 16 }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  12,450 <span style={{ color: '#444', fontWeight: 400 }}>GC</span>
                </span>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.addCircle style={{ color: '#666', width: 15, height: 15 }} />
                </div>
              </div>
              <button style={{
                width: 38, height: 38, borderRadius: '50%', background: 'var(--card)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
              }}>
                <Icons.bell style={{ color: '#777', width: 18, height: 18 }} />
                <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: '#ff3c3c', borderRadius: '50%', border: '1.5px solid var(--card)' }} />
              </button>
              <button className="gc-logout-btn" onClick={handleLogout}>
                <Icons.logout style={{ width: 14, height: 14 }} /> Logout
              </button>
              <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(245,197,24,0.35)', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/150?img=33" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </>
          }
        />

        {/* ══ MAIN CONTENT ══ */}
        <main className="gc-missions-main" style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* HERO — matches dashboard Grand Prediction Cup style */}
          <section className="gc-hero" style={{
            position: 'relative', overflow: 'hidden', borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(245,197,24,0.15) 0%, rgba(245,197,24,0.05) 50%, transparent 100%)',
            border: '1px solid rgba(245,197,24,0.18)', padding: '36px 28px',
            animation: 'gcFadeUp 0.6s ease both',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, background: 'radial-gradient(circle, rgba(245,197,24,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)',
              color: '#F5C518', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 14, letterSpacing: 0.5,
            }}>⭐ Weekend Special Event</div>
            <h2 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>
              The Grand <span style={{ color: '#F5C518' }}>Prediction Cup</span>
            </h2>
            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, maxWidth: 440, marginBottom: 20 }}>
              Test your skill against thousands of players. Predict match outcomes, climb the global leaderboard, and claim your share of the massive{' '}
              <span style={{ color: '#F5C518', fontWeight: 700 }}>100,000 GC</span> prize pool.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={{
                display: 'inline-block', background: '#F5C518', color: '#000',
                fontWeight: 800, fontSize: 14, padding: '11px 26px', borderRadius: 12,
                border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.04)'; (e.target as HTMLElement).style.boxShadow = '0 0 22px rgba(245,197,24,0.45)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = ''; }}
              >
                Play Now →
              </button>
              <button style={{
                display: 'inline-block', background: 'transparent', color: '#F0F0F0',
                fontWeight: 700, fontSize: 14, padding: '11px 26px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s', fontFamily: 'Inter, sans-serif',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(245,197,24,0.4)'; (e.target as HTMLElement).style.color = '#F5C518'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.target as HTMLElement).style.color = '#F0F0F0'; }}
              >
                Claim Reward
              </button>
            </div>
          </section>

          {/* STREAK / STAT PILLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', animation: 'gcFadeUp 0.5s 0.1s ease both', animationFillMode: 'both' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 30, fontSize: 13, fontWeight: 700, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)', color: '#F5C518' }}>
              🔥 3-Day Streak Active
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 30, fontSize: 13, fontWeight: 700, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}>
              ⚡ +10 XP earned today
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 30, fontSize: 13, fontWeight: 700, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: '#00E676' }}>
              <Icons.check style={{ width: 12, height: 12 }} /> {missions.filter(m => m.status === 'claimed' || m.status === 'completed').length} Completed
            </span>
          </div>

          {/* TABS */}
          <div style={{ background: '#0e0e15', borderRadius: 14, padding: 5, display: 'flex', gap: 4, animation: 'gcFadeUp 0.5s 0.15s ease both', animationFillMode: 'both' }}>
            {tabs.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none',
                  background: activeTab === tab.id ? 'var(--card)' : 'transparent',
                  color: activeTab === tab.id ? '#F5C518' : '#666',
                  fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'background 0.25s, color 0.25s',
                  borderWidth: activeTab === tab.id ? 1 : 0,
                  borderStyle: 'solid',
                  borderColor: activeTab === tab.id ? 'rgba(245,197,24,0.18)' : 'transparent',
                }}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          {/* TAB HEADER — context label like dashboard "Daily Missions · Resets in 04:12:39" */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'gcFadeUp 0.5s 0.18s ease both', animationFillMode: 'both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#F0F0F0' }}>
                {activeTab === 'daily'  && '☀️ Daily Missions'}
                {activeTab === 'weekly' && '📅 Weekly Missions'}
                {activeTab === 'events' && '🏆 Active Events'}
              </span>
              {activeTab === 'daily' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
                  <Icons.clock style={{ width: 12, height: 12, color: '#FF5252' }} />
                  Resets in <span style={{ color: '#FF5252', fontWeight: 700 }}>04:12:39</span>
                </span>
              )}
              {activeTab === 'weekly' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
                  <Icons.clock style={{ width: 12, height: 12, color: '#FF5252' }} />
                  Resets in <span style={{ color: '#FF5252', fontWeight: 700 }}>2d 14h 30m</span>
                </span>
              )}
              {activeTab === 'events' && (
                <span style={{ fontSize: 12, color: '#666' }}>Skill-based predictions & special challenges</span>
              )}
            </div>
            <span style={{ fontSize: 13, color: '#F5C518', fontWeight: 600, cursor: 'pointer' }}>View all</span>
          </div>

          {/* MISSION CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tabMissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#444' }}>No missions in this category yet.</div>
            ) : (
              tabMissions.map(m => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  onOpen={handleOpen}
                  shaking={shakingId === m.id}
                />
              ))
            )}
          </div>
        </main>

        {/* ══ MODAL ══ */}
        {openMission && (
          <MissionModal
            mission={openMission}
            onClose={() => setOpenMission(null)}
            onClaim={handleClaim}
          />
        )}
      </div>
    </>
  )
}
