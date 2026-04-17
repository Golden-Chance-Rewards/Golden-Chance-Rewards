"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminTab = "overview" | "players" | "challenges" | "payouts";

interface Player {
  id: string;
  name: string;
  email: string;
  games: number;
  balance: number;
  status: "active" | "inactive" | "banned";
  joinDate: string;
  totalDeposits: number;
  totalWithdrawals: number;
  avatar: string;
}

interface Challenge {
  id: string;
  title: string;
  game: string;
  participants: number;
  prizePool: number;
  entryFee: number;
  status: "live" | "upcoming" | "ended";
  endDate: string;
  type: "prediction" | "trivia" | "tournament";
}

interface PayoutRequest {
  id: string;
  playerName: string;
  playerEmail: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  transactionId?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id: "1", name: "Wade Warren", email: "wade@gc.com", games: 24, balance: 1200, status: "active", joinDate: "Jan 15, 2026", totalDeposits: 5000, totalWithdrawals: 3800, avatar: "W" },
  { id: "2", name: "Esther Howard", email: "howard@gc.com", games: 18, balance: 85, status: "active", joinDate: "Feb 3, 2026", totalDeposits: 500, totalWithdrawals: 415, avatar: "E" },
  { id: "3", name: "Leslie Alexander", email: "leslie@gc.com", games: 9, balance: 320, status: "inactive", joinDate: "Mar 10, 2026", totalDeposits: 1000, totalWithdrawals: 680, avatar: "L" },
  { id: "4", name: "Robert Fox", email: "fox@gc.com", games: 31, balance: 1000, status: "active", joinDate: "Dec 1, 2025", totalDeposits: 8000, totalWithdrawals: 7000, avatar: "R" },
  { id: "5", name: "Sam Wilson", email: "sam@gc.com", games: 12, balance: 450, status: "active", joinDate: "Apr 5, 2026", totalDeposits: 1500, totalWithdrawals: 1050, avatar: "S" },
  { id: "6", name: "Cameron Williamson", email: "cameron@gc.com", games: 27, balance: 2800, status: "active", joinDate: "Nov 20, 2025", totalDeposits: 10000, totalWithdrawals: 7200, avatar: "C" },
  { id: "7", name: "Brooklyn Simmons", email: "brooklyn@gc.com", games: 5, balance: 50, status: "inactive", joinDate: "Apr 12, 2026", totalDeposits: 200, totalWithdrawals: 150, avatar: "B" },
  { id: "8", name: "Dianne Russell", email: "dianne@gc.com", games: 42, balance: 3500, status: "banned", joinDate: "Oct 10, 2025", totalDeposits: 15000, totalWithdrawals: 11500, avatar: "D" },
];

const CHALLENGES: Challenge[] = [
  { id: "1", title: "CS:GO Major Final Predictor", game: "CS:GO", participants: 1284, prizePool: 50000, entryFee: 50, status: "live", endDate: "Apr 20, 2026", type: "prediction" },
  { id: "2", title: "Weekly Crypto Trivia", game: "Crypto", participants: 856, prizePool: 25000, entryFee: 25, status: "live", endDate: "Apr 18, 2026", type: "trivia" },
  { id: "3", title: "Live Prediction Special", game: "Multiple", participants: 0, prizePool: 10000, entryFee: 100, status: "upcoming", endDate: "Apr 25, 2026", type: "prediction" },
  { id: "4", title: "Valorant Champions League", game: "Valorant", participants: 2340, prizePool: 75000, entryFee: 75, status: "live", endDate: "Apr 22, 2026", type: "tournament" },
  { id: "5", title: "Dota 2 Major Predictions", game: "Dota 2", participants: 567, prizePool: 30000, entryFee: 40, status: "live", endDate: "Apr 19, 2026", type: "prediction" },
  { id: "6", title: "NBA Finals Showdown", game: "Basketball", participants: 0, prizePool: 15000, entryFee: 30, status: "upcoming", endDate: "Apr 28, 2026", type: "prediction" },
];

const PAYOUT_REQUESTS: PayoutRequest[] = [
  { id: "1", playerName: "Wade Warren", playerEmail: "wade@gc.com", amount: 1200, method: "Bank Transfer", status: "pending", requestDate: "Apr 16, 2026" },
  { id: "2", playerName: "Esther Howard", playerEmail: "howard@gc.com", amount: 850, method: "UPI", status: "pending", requestDate: "Apr 16, 2026" },
  { id: "3", playerName: "Robert Fox", playerEmail: "fox@gc.com", amount: 2100, method: "Crypto (USDT)", status: "pending", requestDate: "Apr 15, 2026" },
  { id: "4", playerName: "Cameron Williamson", playerEmail: "cameron@gc.com", amount: 5000, method: "Bank Transfer", status: "approved", requestDate: "Apr 14, 2026", transactionId: "TX-2026-0414-001" },
  { id: "5", playerName: "Dianne Russell", playerEmail: "dianne@gc.com", amount: 3000, method: "Crypto (BTC)", status: "rejected", requestDate: "Apr 13, 2026" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const STATUS_COLORS = {
  active: { bg: "#064e3b", text: "#4ade80", dot: "#4ade80" },
  inactive: { bg: "#451a03", text: "#fbbf24", dot: "#fbbf24" },
  banned: { bg: "#7f1d1d", text: "#f87171", dot: "#f87171" },
};

const CHALLENGE_STATUS = {
  live: { bg: "#064e3b", text: "#4ade80", label: "LIVE" },
  upcoming: { bg: "#1e3a8a", text: "#60a5fa", label: "UPCOMING" },
  ended: { bg: "#451a03", text: "#fbbf24", label: "ENDED" },
};

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [players, setPlayers] = useState(PLAYERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ── Auth Guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('gc_auth')
    if (!raw) { router.push('/'); return }
    const auth = JSON.parse(raw)
    if (auth.role !== 'admin') { router.push('/'); return }
    setAdmin({ name: auth.name, email: auth.email })
  }, [router])

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('gc_auth')
    router.push('/')
  }

  const stats = {
    totalPlayers: players.length,
    activeChallenges: CHALLENGES.filter(c => c.status === "live").length,
    totalPrizePool: CHALLENGES.reduce((sum, c) => sum + c.prizePool, 0),
    pendingPayouts: PAYOUT_REQUESTS.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBan = (player: Player) => {
    setPlayers(prev => prev.map(p => 
      p.id === player.id 
        ? { ...p, status: p.status === "banned" ? "active" : "banned" }
        : p
    ));
  };

  const handleView = (player: Player) => {
    setSelectedPlayer(player);
    setShowModal(true);
  };

  const handleApprovePayout = (request: PayoutRequest) => {
    alert(`✅ Approved payout of ${fmt(request.amount)} for ${request.playerName}`);
  };

  const handleRejectPayout = (request: PayoutRequest) => {
    alert(`❌ Rejected payout of ${fmt(request.amount)} for ${request.playerName}`);
  };

  const handleCreateChallenge = () => {
    alert("🎯 Create New Challenge modal would open here");
  };

  const handleEditChallenge = (challenge: Challenge) => {
    alert(`✏️ Edit challenge: ${challenge.title}`);
  };

  const handleManageChallenge = (challenge: Challenge) => {
    alert(`⚙️ Manage challenge: ${challenge.title}`);
  };

  if (!admin) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Roboto+Mono:wght@400;500;600;700&display=swap');

        :root {
          --gc-background: #09090d;
          --gc-card:       #111117;
          --gc-primary:    #F5C518;
          --gc-danger:     #ff3c3c;
          --foreground:    #ffffff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
        }

        .mono {
          font-family: 'Roboto Mono', monospace;
        }

        .admin-nav-link { transition: color .15s; }
        .admin-nav-link:hover { color: #fff !important; }

        .admin-row-hover { transition: background .15s; }
        .admin-row-hover:hover { background: rgba(255,255,255,0.02) !important; }

        .admin-action-btn { transition: all 0.2s; }
        .admin-action-btn:hover { 
          background: rgba(245,197,24,0.15) !important;
          border-color: rgba(245,197,24,0.3) !important;
          transform: translateX(4px);
        }

        .admin-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
          background: transparent; color: #555;
          border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .admin-logout-btn:hover {
          color: #ff5252;
          border-color: rgba(255,82,82,0.3);
          background: rgba(255,82,82,0.06);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in {
          animation: slideIn 0.4s ease-out;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        ::-webkit-scrollbar-thumb {
          background: #F5C518;
          border-radius: 3px;
        }
      `}</style>

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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
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
              {[
                { id: "overview", label: "Overview" },
                { id: "players", label: "Players" },
                { id: "challenges", label: "Challenges" },
                { id: "payouts", label: "Payouts" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className="admin-nav-link"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: activeTab === item.id ? '#fff' : '#555',
                    fontWeight: activeTab === item.id ? 600 : 400,
                    fontSize: 14, textDecoration: 'none', cursor: 'pointer',
                    paddingBottom: 4,
                    borderBottom: activeTab === item.id ? '2px solid #F5C518' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.label}
                </button>
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

              {/* ── LOGOUT BUTTON ── */}
              <button onClick={handleLogout} className="admin-logout-btn">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </header>

          {/* ── MAIN ── */}
          <main style={{ padding: '28px 28px', maxWidth: 1400, margin: '0 auto' }}>

            {/* Welcome */}
            <div className="slide-in" style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                Welcome back, <span style={{ color: '#F5C518' }}>{admin.name}</span> 👋
              </h1>
              <p style={{ fontSize: 14, color: '#555' }}>Here's your platform overview for today</p>
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="slide-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                  {[
                    { label: 'Total Players', value: stats.totalPlayers.toLocaleString(), change: '+124 today', icon: '👥', up: true },
                    { label: 'Active Challenges', value: stats.activeChallenges, change: '+5 new', icon: '🎯', up: true },
                    { label: 'Total Prize Pool', value: fmt(stats.totalPrizePool), change: 'This month', icon: '💰', up: true },
                    { label: 'Pending Payouts', value: fmt(stats.pendingPayouts), change: `${PAYOUT_REQUESTS.filter(p => p.status === "pending").length} requests`, icon: '⏳', up: false },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 22 }}>{stat.icon}</div>
                      <div style={{ fontSize: 12, color: '#555', marginBottom: 10, fontWeight: 500 }}>{stat.label}</div>
                      <div className="mono" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{stat.value}</div>
                      <div style={{ fontSize: 12, color: stat.up ? '#00E676' : '#FF5252', fontWeight: 500 }}>{stat.change}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

                  {/* LEFT - Recent Players */}
                  <div className="slide-in" style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>Recent Players</div>
                        <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>Latest registrations</div>
                      </div>
                      <button onClick={() => setActiveTab("players")} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(245,197,24,0.1)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.2)', cursor: 'pointer' }}>
                        View All
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '12px 22px', background: 'rgba(255,255,255,0.02)', fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: 0.5 }}>
                      <span>PLAYER</span><span>EMAIL</span><span>GAMES</span><span>BALANCE</span><span>STATUS</span>
                    </div>

                    {players.slice(0, 5).map((player, i) => (
                      <div key={player.id} className="admin-row-hover" style={{
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                        padding: '14px 22px', alignItems: 'center',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #F5C518, #FFD700)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 14, color: '#111',
                          }}>{player.avatar}</div>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{player.name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#555' }}>{player.email}</span>
                        <span className="mono" style={{ fontSize: 13 }}>{player.games}</span>
                        <span className="mono" style={{ fontSize: 13, color: '#F5C518', fontWeight: 600 }}>{fmt(player.balance)}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', width: 'fit-content',
                          background: player.status === 'active' ? 'rgba(0,230,118,0.12)' : player.status === 'banned' ? 'rgba(255,82,82,0.12)' : 'rgba(255,255,255,0.06)',
                          color: player.status === 'active' ? '#00E676' : player.status === 'banned' ? '#FF5252' : '#666',
                        }}>{player.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT - Quick Actions & Payouts */}
                  <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Quick Actions */}
                    <div style={{ background: 'var(--gc-card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 22 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Actions</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          { label: 'Create New Challenge', icon: '🎯', action: () => handleCreateChallenge() },
                          { label: 'Approve Payouts', icon: '💸', action: () => setActiveTab("payouts") },
                          { label: 'Ban / Unban Player', icon: '🚫', action: () => setActiveTab("players") },
                          { label: 'Send Announcement', icon: '📢', action: () => alert("📢 Send announcement to all players") },
                        ].map(action => (
                          <button key={action.label} onClick={action.action} className="admin-action-btn" style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 16px', borderRadius: 12, width: '100%', textAlign: 'left',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                            color: '#ccc', fontSize: 14, cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}>
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
                        {PAYOUT_REQUESTS.filter(r => r.status === "pending").slice(0, 3).map((req, i) => (
                          <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 30, height: 30, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #F5C518, #FFD700)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 12, color: '#111',
                              }}>{req.playerName.charAt(0)}</div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{req.playerName}</div>
                                <div className="mono" style={{ fontSize: 12, color: '#F5C518' }}>{fmt(req.amount)}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleApprovePayout(req)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(0,230,118,0.12)', color: '#00E676', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✓ Approve</button>
                              <button onClick={() => handleRejectPayout(req)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(255,82,82,0.12)', color: '#FF5252', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {PAYOUT_REQUESTS.filter(r => r.status === "pending").length > 3 && (
                        <button onClick={() => setActiveTab("payouts")} style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(245,197,24,0.1)', color: '#F5C518', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                          View All ({PAYOUT_REQUESTS.filter(r => r.status === "pending").length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── PLAYERS TAB ── */}
            {activeTab === "players" && (
              <div className="slide-in">
                {/* Search and Quick Actions */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}>
                  <div style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 8,
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <span>🔍</span>
                    <input
                      type="text"
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#e2e8f0",
                        fontSize: 13,
                        width: 250,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      padding: "8px 16px",
                      borderRadius: 8,
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      📊 Export Data
                    </button>
                    <button style={{
                      background: "#F5C518",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      color: "#0f172a",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      + Add New Player
                    </button>
                  </div>
                </div>

                {/* Players Table Header */}
                <div style={{
                  background: "#1e293b",
                  borderRadius: "12px 12px 0 0",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #334155",
                }}>
                  <div style={{ flex: 2 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>PLAYER</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>GAMES</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>BALANCE</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>STATUS</span></div>
                  <div style={{ display: "flex", gap: 8, width: 120, justifyContent: "flex-end" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>ACTIONS</span></div>
                </div>

                {/* Players List */}
                <div style={{
                  background: "#0f172a",
                  borderRadius: "0 0 12px 12px",
                  border: "1px solid #1e293b",
                  borderTop: "none",
                  overflow: "hidden",
                }}>
                  {filteredPlayers.map((player) => (
                    <div key={player.id} style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid #1e293b",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F5C518, #FFD700)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 14, color: '#111',
                        }}>{player.avatar}</div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{player.name}</p>
                          <p style={{ color: "#64748b", fontSize: 11 }}>{player.email}</p>
                        </div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p className="mono" style={{ fontWeight: 700, fontSize: 13 }}>{player.games}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p className="mono" style={{ fontWeight: 700, fontSize: 13, color: "#F5C518" }}>{fmt(player.balance)}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <span style={{
                          background: STATUS_COLORS[player.status].bg,
                          color: STATUS_COLORS[player.status].text,
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {player.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleView(player)} style={{
                          background: "#1e293b",
                          color: "#94a3b8",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#F5C518"; e.currentTarget.style.color = "#0f172a"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; }}>
                          View
                        </button>
                        <button onClick={() => handleBan(player)} style={{
                          background: player.status === "banned" ? "#064e3b" : "#7f1d1d",
                          color: player.status === "banned" ? "#4ade80" : "#f87171",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {player.status === "banned" ? "Unban" : "Ban"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Player Details Modal */}
                {showModal && selectedPlayer && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                  }} onClick={() => setShowModal(false)}>
                    <div style={{
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 16,
                      padding: 32,
                      maxWidth: 500,
                      width: "90%",
                    }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Player Details</h2>
                        <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}>✕</button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #F5C518, #FFD700)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}>{selectedPlayer.avatar}</div>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedPlayer.name}</h3>
                          <p style={{ color: "#64748b", fontSize: 13 }}>{selectedPlayer.email}</p>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Games Played</p><p className="mono" style={{ fontSize: 20, fontWeight: 700 }}>{selectedPlayer.games}</p></div>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Balance</p><p className="mono" style={{ fontSize: 20, fontWeight: 700, color: "#F5C518" }}>{fmt(selectedPlayer.balance)}</p></div>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Total Deposits</p><p className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(selectedPlayer.totalDeposits)}</p></div>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Total Withdrawals</p><p className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{fmt(selectedPlayer.totalWithdrawals)}</p></div>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Join Date</p><p style={{ fontSize: 13 }}>{selectedPlayer.joinDate}</p></div>
                        <div><p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Status</p><span style={{ background: STATUS_COLORS[selectedPlayer.status].bg, color: STATUS_COLORS[selectedPlayer.status].text, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-block" }}>{selectedPlayer.status.toUpperCase()}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CHALLENGES TAB ── */}
            {activeTab === "challenges" && (
              <div className="slide-in">
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}>Manage live and upcoming prediction challenges</p>
                  </div>
                  <button onClick={handleCreateChallenge} style={{
                    background: "#F5C518",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 8,
                    color: "#0f172a",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    + Create New Challenge
                  </button>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}>
                  {CHALLENGES.map(challenge => {
                    const statusStyle = CHALLENGE_STATUS[challenge.status];
                    return (
                      <div key={challenge.id} style={{
                        background: "linear-gradient(135deg, #111827, #0f172a)",
                        border: "1px solid #1e293b",
                        borderRadius: 12,
                        padding: "20px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#F5C518";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#1e293b";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                          <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{challenge.title}</h3>
                            <p style={{ color: "#64748b", fontSize: 11 }}>{challenge.game} • {challenge.type}</p>
                          </div>
                          <span style={{
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 700,
                          }}>{statusStyle.label}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <div>
                            <p style={{ color: "#64748b", fontSize: 10, marginBottom: 2 }}>Participants</p>
                            <p className="mono" style={{ fontWeight: 700, fontSize: 18 }}>{challenge.participants.toLocaleString()}</p>
                          </div>
                          <div>
                            <p style={{ color: "#64748b", fontSize: 10, marginBottom: 2 }}>Prize Pool</p>
                            <p className="mono" style={{ fontWeight: 700, fontSize: 16, color: "#F5C518" }}>{fmt(challenge.prizePool)}</p>
                          </div>
                          <div>
                            <p style={{ color: "#64748b", fontSize: 10, marginBottom: 2 }}>Entry Fee</p>
                            <p className="mono" style={{ fontWeight: 700, fontSize: 14 }}>{fmt(challenge.entryFee)}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleEditChallenge(challenge)} style={{
                            flex: 1,
                            background: "#1e293b",
                            color: "#94a3b8",
                            border: "none",
                            padding: "8px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                          }}>
                            Edit
                          </button>
                          <button onClick={() => handleManageChallenge(challenge)} style={{
                            flex: 1,
                            background: "#F5C518",
                            color: "#0f172a",
                            border: "none",
                            padding: "8px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                          }}>
                            Manage
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PAYOUTS TAB ── */}
            {activeTab === "payouts" && (
              <div className="slide-in">
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>Review and process player withdrawal requests</p>
                </div>

                {/* Summary Cards */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  marginBottom: 24,
                }}>
                  <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Pending Requests</p>
                    <p className="mono" style={{ fontSize: 28, fontWeight: 800, color: "#F5C518" }}>{PAYOUT_REQUESTS.filter(p => p.status === "pending").length}</p>
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Total Pending Amount</p>
                    <p className="mono" style={{ fontSize: 28, fontWeight: 800, color: "#ff5252" }}>{fmt(stats.pendingPayouts)}</p>
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>Processed This Month</p>
                    <p className="mono" style={{ fontSize: 28, fontWeight: 800, color: "#00E676" }}>{fmt(8500)}</p>
                  </div>
                </div>

                {/* Payouts Table Header */}
                <div style={{
                  background: "#1e293b",
                  borderRadius: "12px 12px 0 0",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #334155",
                }}>
                  <div style={{ flex: 2 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>PLAYER</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>AMOUNT</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>METHOD</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>DATE</span></div>
                  <div style={{ flex: 1, textAlign: "center" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>STATUS</span></div>
                  <div style={{ width: 160, textAlign: "right" }}><span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>ACTIONS</span></div>
                </div>

                {/* Payouts List */}
                <div style={{
                  background: "#0f172a",
                  borderRadius: "0 0 12px 12px",
                  border: "1px solid #1e293b",
                  borderTop: "none",
                  overflow: "hidden",
                }}>
                  {PAYOUT_REQUESTS.map(request => (
                    <div key={request.id} style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: "1px solid #1e293b",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#1e293b")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <div style={{ flex: 2 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{request.playerName}</p>
                        <p style={{ color: "#64748b", fontSize: 11 }}>{request.playerEmail}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p className="mono" style={{ fontWeight: 700, fontSize: 13, color: "#F5C518" }}>{fmt(request.amount)}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p style={{ fontSize: 12, color: "#94a3b8" }}>{request.method}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p style={{ fontSize: 11, color: "#64748b" }}>{request.requestDate}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <span style={{
                          background: request.status === "pending" ? "#451a03" : request.status === "approved" ? "#064e3b" : "#7f1d1d",
                          color: request.status === "pending" ? "#F5C518" : request.status === "approved" ? "#4ade80" : "#f87171",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      {request.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleApprovePayout(request)} style={{
                            background: "#064e3b",
                            color: "#4ade80",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                          }}>
                            Approve
                          </button>
                          <button onClick={() => handleRejectPayout(request)} style={{
                            background: "#7f1d1d",
                            color: "#f87171",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                          }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{
                  marginTop: 24,
                  background: "#1e293b",
                  borderRadius: 12,
                  padding: "20px",
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                      flex: 1,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      padding: "12px",
                      borderRadius: 8,
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      📋 Bulk Approve Pending
                    </button>
                    <button style={{
                      flex: 1,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      padding: "12px",
                      borderRadius: 8,
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      📊 Download Report
                    </button>
                    <button style={{
                      flex: 1,
                      background: "#0f172a",
                      border: "1px solid #334155",
                      padding: "12px",
                      borderRadius: 8,
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      ⚙️ Configure Limits
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  )
}