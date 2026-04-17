"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "deposit" | "withdraw";
type TxFilter = "all" | "deposit" | "withdraw" | "bonus" | "reward";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "bonus" | "reward" | "stake" | "win";
  label: string;
  amount: number;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  wallet: "real" | "bonus" | "reward";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  { id: "tx001", type: "win",      label: "CS:GO Major Prediction Win",  amount: +2400,  date: "Apr 17", time: "09:41 AM", status: "completed", wallet: "real"   },
  { id: "tx002", type: "deposit",  label: "Crypto Deposit – USDT",        amount: +5000,  date: "Apr 17", time: "08:15 AM", status: "completed", wallet: "real"   },
  { id: "tx003", type: "stake",    label: "Weekly Trivia Entry",           amount: -100,   date: "Apr 16", time: "07:30 PM", status: "completed", wallet: "real"   },
  { id: "tx004", type: "bonus",    label: "7-Day Login Streak Bonus",      amount: +100,   date: "Apr 16", time: "12:00 PM", status: "completed", wallet: "bonus"  },
  { id: "tx005", type: "reward",   label: "Mission Reward – Play 3 Games", amount: +50,    date: "Apr 16", time: "10:05 AM", status: "completed", wallet: "reward" },
  { id: "tx006", type: "withdraw", label: "Bank Transfer Withdrawal",       amount: -3000,  date: "Apr 15", time: "03:22 PM", status: "pending",   wallet: "real"   },
  { id: "tx007", type: "bonus",    label: "Referral Bonus",                 amount: +200,   date: "Apr 14", time: "11:10 AM", status: "completed", wallet: "bonus"  },
  { id: "tx008", type: "deposit",  label: "Crypto Deposit – BTC",           amount: +10000, date: "Apr 13", time: "09:00 AM", status: "completed", wallet: "real"   },
  { id: "tx009", type: "stake",    label: "Grand Prediction Cup Entry",     amount: -250,   date: "Apr 13", time: "08:55 AM", status: "completed", wallet: "real"   },
  { id: "tx010", type: "reward",   label: "Weekend Challenge Reward",       amount: +300,   date: "Apr 12", time: "06:00 PM", status: "completed", wallet: "reward" },
  { id: "tx011", type: "withdraw", label: "UPI Withdrawal",                 amount: -1500,  date: "Apr 11", time: "02:30 PM", status: "failed",    wallet: "real"   },
  { id: "tx012", type: "bonus",    label: "Deposit Match Bonus (50%)",      amount: +2500,  date: "Apr 10", time: "10:00 AM", status: "completed", wallet: "bonus"  },
];

const PAYMENT_METHODS = [
  { id: "usdt",   label: "USDT (TRC-20)", icon: "₮", tag: "Crypto",       fee: "0%"  },
  { id: "btc",    label: "Bitcoin",        icon: "₿", tag: "Crypto",       fee: "0%"  },
  { id: "upi",    label: "UPI",            icon: "⊕", tag: "Instant",      fee: "1%"  },
  { id: "bank",   label: "Bank Transfer",  icon: "🏦", tag: "2-3 Days",    fee: "0.5%"},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  `$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const TX_COLOR: Record<Transaction["type"], string> = {
  deposit: "#F5C842",
  win:     "#4ADE80",
  bonus:   "#A78BFA",
  reward:  "#38BDF8",
  stake:   "#FB923C",
  withdraw:"#F87171",
};

const TX_ICON: Record<Transaction["type"], string> = {
  deposit:  "↓",
  win:      "★",
  bonus:    "◈",
  reward:   "◉",
  stake:    "◎",
  withdraw: "↑",
};

const STATUS_DOT: Record<Transaction["status"], string> = {
  completed: "#4ADE80",
  pending:   "#FBBF24",
  failed:    "#F87171",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BalanceRing({ pct, color }: { pct: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1f1f1f" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

function FreebetBadge() {
  return (
    <span style={{
      background: "linear-gradient(90deg,#F5C842,#fb923c)",
      color: "#0d0d0d",
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.12em",
      padding: "2px 7px",
      borderRadius: 99,
      textTransform: "uppercase",
    }}>Freebet Eligible</span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const [depositAmt, setDepositAmt] = useState("1000");
  const [withdrawAmt, setWithdrawAmt] = useState("500");
  const [selectedMethod, setSelectedMethod] = useState("usdt");
  const [showBonus, setShowBonus] = useState(false);

  const realBalance   = 12450;
  const bonusBalance  = 3200;
  const rewardBalance = 850;
  const totalBalance  = realBalance + bonusBalance + rewardBalance;

  const filteredTx = TRANSACTIONS.filter(t => {
    if (txFilter === "all")    return true;
    if (txFilter === "deposit")  return t.type === "deposit" || t.type === "win";
    if (txFilter === "withdraw") return t.type === "withdraw" || t.type === "stake";
    if (txFilter === "bonus")    return t.wallet === "bonus";
    if (txFilter === "reward")   return t.wallet === "reward";
    return true;
  });

  return (
    <>
      {/* ── Google Font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Roboto+Mono:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #e8e0d0;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .mono { font-family: 'Roboto Mono', monospace; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

        /* animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(245,200,66,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .fade-up { animation: fadeUp 0.45s ease both; }

        .gold-glow:hover {
          box-shadow: 0 0 22px rgba(245,200,66,0.35);
          transition: box-shadow 0.2s;
        }
      `}</style>

      
      {/* ── Page Body ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ── Page Header ── */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 6, height: 32, borderRadius: 4,
              background: "linear-gradient(180deg,#F5C842,#fb923c)",
            }} />
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "'Inter', sans-serif" }}>Wallet</h1>
          </div>
          <p style={{ color: "#666", fontSize: 13, paddingLeft: 18, fontFamily: "'Inter', sans-serif" }}>
            Manage your balance, bonuses, and transactions
          </p>
        </div>

        {/* ── Three Balance Cards ── */}
        <div className="fade-up" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}>
          {/* Real Money */}
          <div style={{
            background: "linear-gradient(135deg,#141414 60%,#1c1600)",
            border: "1px solid #2e2800",
            borderRadius: 16, padding: "26px 24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 110, height: 110, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(245,200,66,0.12),transparent 70%)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Real Balance</p>
                <p className="mono" style={{ fontSize: 34, fontWeight: 700, color: "#F5C842", lineHeight: 1 }}>
                  {fmt(realBalance)}
                </p>
                <p style={{ color: "#555", fontSize: 11, marginTop: 4 }} className="mono">USD</p>
              </div>
              <div style={{ position: "relative" }}>
                <BalanceRing pct={Math.round(realBalance / totalBalance * 100)} color="#F5C842" />
                <div className="mono" style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#F5C842",
                }}>
                  {Math.round(realBalance / totalBalance * 100)}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <FreebetBadge />
            </div>
          </div>

          {/* Bonus Wallet */}
          <div style={{
            background: "linear-gradient(135deg,#141420 60%,#1a1030)",
            border: "1px solid #2a1d4e",
            borderRadius: 16, padding: "26px 24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 110, height: 110, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(167,139,250,0.14),transparent 70%)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Bonus Wallet</p>
                <p className="mono" style={{ fontSize: 34, fontWeight: 700, color: "#A78BFA", lineHeight: 1 }}>
                  {fmt(bonusBalance)}
                </p>
                <p style={{ color: "#555", fontSize: 11, marginTop: 4 }} className="mono">USD</p>
              </div>
              <div style={{ position: "relative" }}>
                <BalanceRing pct={Math.round(bonusBalance / totalBalance * 100)} color="#A78BFA" />
                <div className="mono" style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#A78BFA",
                }}>
                  {Math.round(bonusBalance / totalBalance * 100)}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <span style={{ color: "#A78BFA", fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                🎁 Deposit match + referral bonuses
              </span>
            </div>
          </div>

          {/* Reward Wallet */}
          <div style={{
            background: "linear-gradient(135deg,#111820 60%,#0a1a22)",
            border: "1px solid #153044",
            borderRadius: 16, padding: "26px 24px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30,
              width: 110, height: 110, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(56,189,248,0.12),transparent 70%)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Reward Wallet</p>
                <p className="mono" style={{ fontSize: 34, fontWeight: 700, color: "#38BDF8", lineHeight: 1 }}>
                  {fmt(rewardBalance)}
                </p>
                <p style={{ color: "#555", fontSize: 11, marginTop: 4 }} className="mono">USD</p>
              </div>
              <div style={{ position: "relative" }}>
                <BalanceRing pct={Math.round(rewardBalance / totalBalance * 100)} color="#38BDF8" />
                <div className="mono" style={{
                  position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#38BDF8",
                }}>
                  {Math.round(rewardBalance / totalBalance * 100)}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <span style={{ color: "#38BDF8", fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                ◉ Missions & challenge rewards
              </span>
            </div>
          </div>
        </div>

        {/* ── Total Banner ── */}
        <div className="fade-up" style={{
          background: "linear-gradient(90deg,#1a1400,#100d00,#1a1400)",
          border: "1px solid #2e2800",
          borderRadius: 14,
          padding: "18px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg,#F5C842,#fb923c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>💰</div>
            <div>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>Total Portfolio</p>
              <p className="mono" style={{ fontSize: 24, fontWeight: 700, color: "#F5C842", letterSpacing: "-0.01em" }}>
                {fmt(totalBalance)} <span style={{ fontSize: 14, color: "#888" }}>USD</span>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setActiveTab("deposit")}
              style={{
                background: "linear-gradient(90deg,#F5C842,#fb923c)",
                color: "#0d0d0d", border: "none", cursor: "pointer",
                padding: "10px 24px", borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: 13, letterSpacing: "0.04em",
                animation: "pulse-gold 2.5s infinite",
              }}
            >+ Deposit</button>
            <button
              onClick={() => setActiveTab("withdraw")}
              style={{
                background: "transparent",
                color: "#e8e0d0", border: "1px solid #333", cursor: "pointer",
                padding: "10px 24px", borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
              }}
            >Withdraw ↑</button>
          </div>
        </div>

        {/* ── Main Content Tabs ── */}
        <div className="fade-up" style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {(["overview","deposit","withdraw"] as Tab[]).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: activeTab === t ? "#F5C842" : "#161616",
              color: activeTab === t ? "#0d0d0d" : "#666",
              border: activeTab === t ? "none" : "1px solid #222",
              padding: "9px 22px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}>
              {t === "overview" ? "📊 Overview" : t === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
            </button>
          ))}
        </div>

        {/* ══════ OVERVIEW TAB ══════ */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

            {/* Transactions */}
            <div style={{
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: 16, overflow: "hidden",
            }}>
              {/* header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid #1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Inter', sans-serif" }}>Transaction History</p>
                  <p style={{ color: "#555", fontSize: 12, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                    {filteredTx.length} transactions
                  </p>
                </div>
                {/* filter pills */}
                <div style={{ display: "flex", gap: 6 }}>
                  {(["all","deposit","withdraw","bonus","reward"] as TxFilter[]).map(f => (
                    <button key={f} onClick={() => setTxFilter(f)} style={{
                      background: txFilter === f ? "#1e1e1e" : "transparent",
                      color: txFilter === f ? "#F5C842" : "#555",
                      border: txFilter === f ? "1px solid #2e2800" : "1px solid #1a1a1a",
                      padding: "4px 12px", borderRadius: 99, cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600, fontSize: 11, textTransform: "capitalize",
                      transition: "all 0.15s",
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              {/* tx list */}
              <div style={{ maxHeight: 500, overflowY: "auto" }}>
                {filteredTx.map((tx, i) => (
                  <div key={tx.id} style={{
                    display: "flex", alignItems: "center",
                    padding: "14px 24px",
                    borderBottom: i < filteredTx.length - 1 ? "1px solid #161616" : "none",
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* icon */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: `${TX_COLOR[tx.type]}15`,
                      border: `1px solid ${TX_COLOR[tx.type]}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, color: TX_COLOR[tx.type], marginRight: 14,
                    }}>
                      {TX_ICON[tx.type]}
                    </div>

                    {/* info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Inter', sans-serif" }}>
                        {tx.label}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        <span style={{ color: "#555", fontSize: 11 }} className="mono">{tx.date} · {tx.time}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                          padding: "1px 6px", borderRadius: 4, textTransform: "uppercase",
                          background: tx.wallet === "real" ? "#1a1400" : tx.wallet === "bonus" ? "#1a1040" : "#0a1a22",
                          color: tx.wallet === "real" ? "#F5C842" : tx.wallet === "bonus" ? "#A78BFA" : "#38BDF8",
                          fontFamily: "'Inter', sans-serif",
                        }}>{tx.wallet}</span>
                      </div>
                    </div>

                    {/* amount + status */}
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <p className="mono" style={{
                        fontSize: 15, fontWeight: 700,
                        color: tx.amount > 0 ? "#4ADE80" : "#F87171",
                      }}>
                        {tx.amount > 0 ? "+" : ""}{fmt(tx.amount)}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, justifyContent: "flex-end" }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: STATUS_DOT[tx.status],
                        }} />
                        <span style={{ color: "#555", fontSize: 10, textTransform: "capitalize", fontFamily: "'Inter', sans-serif" }}>{tx.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Freebet Logic Card */}
              <div style={{
                background: "linear-gradient(135deg,#111,#0f0d00)",
                border: "1px solid #2e2800", borderRadius: 16, padding: "22px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>⚡</span>
                  <p style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Freebet Status</p>
                </div>
                <div style={{
                  background: "#161400", borderRadius: 10, padding: "14px 16px",
                  border: "1px solid #2a2000", marginBottom: 12,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#888", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Wagering Requirement</span>
                    <span className="mono" style={{ color: "#F5C842", fontSize: 12, fontWeight: 700 }}>5x</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: "#888", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Wagered</span>
                    <span className="mono" style={{ color: "#e8e0d0", fontSize: 12, fontWeight: 700 }}>$8,200 / $16,000</span>
                  </div>
                  {/* progress */}
                  <div style={{ background: "#1e1e1e", borderRadius: 4, height: 6 }}>
                    <div style={{
                      width: "51%", height: "100%", borderRadius: 4,
                      background: "linear-gradient(90deg,#F5C842,#fb923c)",
                    }} />
                  </div>
                  <p style={{ color: "#555", fontSize: 10, marginTop: 6 }} className="mono">51% complete · $7,800 remaining</p>
                </div>
                <p style={{ color: "#666", fontSize: 11, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                  Bonus funds can be used for predictions. Winnings from bonus bets are credited to your real wallet after wagering is complete.
                </p>
              </div>

              {/* Quick Stats */}
              <div style={{
                background: "#111", border: "1px solid #1e1e1e",
                borderRadius: 16, padding: "22px 22px",
              }}>
                <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>This Month</p>
                {[
                  { label: "Total Deposited",  val: "$15,000",  color: "#F5C842" },
                  { label: "Total Withdrawn",  val: "$4,500",   color: "#F87171" },
                  { label: "Net Winnings",      val: "+$2,400",  color: "#4ADE80" },
                  { label: "Bonuses Earned",    val: "$2,800",   color: "#A78BFA" },
                  { label: "Rewards Earned",    val: "$350",     color: "#38BDF8" },
                ].map(s => (
                  <div key={s.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0",
                    borderBottom: "1px solid #161616",
                  }}>
                    <span style={{ color: "#666", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
                    <span className="mono" style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.val}</span>
                  </div>
                ))}
              </div>

              {/* Bonus Expiry */}
              <div style={{
                background: "linear-gradient(135deg,#14102a,#0f0a20)",
                border: "1px solid #2a1d4e", borderRadius: 16, padding: "22px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>⏳</span>
                  <p style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Bonus Expiry</p>
                </div>
                {[
                  { label: "Deposit Match Bonus", amt: "$2,500", expires: "Apr 24", urgency: false },
                  { label: "Referral Bonus",      amt: "$200",   expires: "Apr 19", urgency: true  },
                ].map(b => (
                  <div key={b.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8, marginBottom: 8,
                    background: b.urgency ? "#1a0a0a" : "#13102a",
                    border: `1px solid ${b.urgency ? "#3a1010" : "#2a1d4e"}`,
                  }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{b.label}</p>
                      <p className="mono" style={{ color: "#A78BFA", fontSize: 11, marginTop: 2 }}>{b.amt}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 10, color: "#555", fontFamily: "'Inter', sans-serif" }}>Expires</p>
                      <p className="mono" style={{ color: b.urgency ? "#F87171" : "#888", fontSize: 12, fontWeight: 700 }}>{b.expires}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ DEPOSIT TAB ══════ */}
        {activeTab === "deposit" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>

            <div style={{
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: 16, padding: "28px 28px",
            }}>
              <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>Add Funds</p>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 28, fontFamily: "'Inter', sans-serif" }}>Choose your payment method and amount</p>

              {/* Payment Method Select */}
              <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                Payment Method
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id} onClick={() => setSelectedMethod(m.id)} style={{
                    background: selectedMethod === m.id ? "#1a1400" : "#161616",
                    border: `1.5px solid ${selectedMethod === m.id ? "#F5C842" : "#1e1e1e"}`,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: selectedMethod === m.id ? "#2e2800" : "#1e1e1e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>{m.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{m.label}</p>
                      <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                        <span style={{ color: "#555", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>{m.tag}</span>
                        <span style={{ color: "#4ADE80", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>· Fee {m.fee}</span>
                      </div>
                    </div>
                    {selectedMethod === m.id && (
                      <div style={{
                        marginLeft: "auto", width: 18, height: 18, borderRadius: "50%",
                        background: "#F5C842", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#0d0d0d", fontWeight: 900,
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Amount */}
              <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                Amount (USD)
              </p>
              <div style={{
                display: "flex", alignItems: "center",
                background: "#161616", border: "1.5px solid #2e2800",
                borderRadius: 12, overflow: "hidden", marginBottom: 14,
              }}>
                <span style={{ padding: "0 16px", color: "#F5C842", fontWeight: 800, fontSize: 18, borderRight: "1px solid #2a2a2a", fontFamily: "'Inter', sans-serif" }}>$</span>
                <input
                  type="number"
                  value={depositAmt}
                  onChange={e => setDepositAmt(e.target.value)}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#F5C842", fontFamily: "'Roboto Mono', monospace",
                    fontSize: 22, fontWeight: 700, padding: "14px 16px",
                  }}
                />
              </div>

              {/* Quick amounts */}
              <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                {[500, 1000, 2500, 5000, 10000].map(a => (
                  <button key={a} onClick={() => setDepositAmt(String(a))} style={{
                    flex: 1,
                    background: depositAmt === String(a) ? "#F5C842" : "#161616",
                    color: depositAmt === String(a) ? "#0d0d0d" : "#888",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8, cursor: "pointer",
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 700, fontSize: 11, padding: "8px 0",
                    transition: "all 0.15s",
                  }}>{(a / 1000).toFixed(a >= 1000 ? 0 : 1)}K</button>
                ))}
              </div>

              {/* Bonus preview */}
              {parseInt(depositAmt) >= 1000 && (
                <div style={{
                  background: "linear-gradient(90deg,#14102a,#0f0a20)",
                  border: "1px solid #2a1d4e",
                  borderRadius: 12, padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: 12,
                  marginBottom: 24,
                }}>
                  <span style={{ fontSize: 20 }}>🎁</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Deposit Bonus Applied!</p>
                    <p style={{ color: "#A78BFA", fontSize: 12, marginTop: 2 }} className="mono">
                      +{fmt(Math.floor(parseInt(depositAmt || "0") * 0.5))} bonus (50% match)
                    </p>
                  </div>
                </div>
              )}

              <button style={{
                width: "100%",
                background: "linear-gradient(90deg,#F5C842,#fb923c)",
                color: "#0d0d0d", border: "none", cursor: "pointer",
                padding: "15px", borderRadius: 12,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: 15, letterSpacing: "0.04em",
              }}>
                Deposit {depositAmt ? `$${parseInt(depositAmt).toLocaleString("en-US")}` : "$0"} →
              </button>
            </div>

            {/* right: how it works */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "#111", border: "1px solid #1e1e1e",
                borderRadius: 16, padding: "24px 22px",
              }}>
                <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 18, fontFamily: "'Inter', sans-serif" }}>How Deposits Work</p>
                {[
                  { step: "01", title: "Choose Method", desc: "Crypto deposits are instant with 0% fee. Bank transfers may take 2–3 days." },
                  { step: "02", title: "Enter Amount", desc: "Minimum deposit is $100. Amounts of $1,000+ qualify for the 50% match bonus." },
                  { step: "03", title: "Confirm & Receive", desc: "Funds reflect instantly in your real wallet. Bonus lands in your bonus wallet." },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "#1a1400", border: "1px solid #2e2800",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#F5C842" }}>{s.step}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{s.title}</p>
                      <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "linear-gradient(135deg,#141400,#0a0900)",
                border: "1px solid #2e2800", borderRadius: 16, padding: "22px 22px",
              }}>
                <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#F5C842", fontFamily: "'Inter', sans-serif" }}>🏆 Active Deposit Promo</p>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>Weekend Double-Up</p>
                <p style={{ color: "#666", fontSize: 12, lineHeight: 1.6, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
                  Deposit this weekend and get a 100% match bonus up to $5,000. Valid until Sunday midnight.
                </p>
                <div style={{
                  background: "#1a1400", borderRadius: 8, padding: "10px 14px",
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ color: "#888", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Offer ends in</span>
                  <span className="mono" style={{ color: "#F5C842", fontWeight: 700, fontSize: 12 }}>02:14:39</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ WITHDRAW TAB ══════ */}
        {activeTab === "withdraw" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>

            <div style={{
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: 16, padding: "28px 28px",
            }}>
              <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>Withdraw Funds</p>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                Available for withdrawal:{" "}
                <span className="mono" style={{ color: "#F5C842", fontWeight: 700 }}>{fmt(realBalance)}</span>
              </p>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#1a0e00", border: "1px solid #3a2000",
                borderRadius: 8, padding: "8px 14px", marginBottom: 28,
              }}>
                <span style={{ color: "#FBBF24", fontSize: 13 }}>⚠</span>
                <p style={{ color: "#FBBF24", fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Only real wallet funds can be withdrawn. Bonus & reward funds require wagering completion.</p>
              </div>

              <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                Withdrawal Method
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id} onClick={() => setSelectedMethod(m.id)} style={{
                    background: selectedMethod === m.id ? "#1a1400" : "#161616",
                    border: `1.5px solid ${selectedMethod === m.id ? "#F5C842" : "#1e1e1e"}`,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: selectedMethod === m.id ? "#2e2800" : "#1e1e1e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>{m.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{m.label}</p>
                      <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                        <span style={{ color: "#555", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>{m.tag}</span>
                        <span style={{ color: "#F87171", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>· Fee {m.fee}</span>
                      </div>
                    </div>
                    {selectedMethod === m.id && (
                      <div style={{
                        marginLeft: "auto", width: 18, height: 18, borderRadius: "50%",
                        background: "#F5C842", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#0d0d0d", fontWeight: 900,
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                Amount (USD)
              </p>
              <div style={{
                display: "flex", alignItems: "center",
                background: "#161616", border: "1.5px solid #1e1e1e",
                borderRadius: 12, overflow: "hidden", marginBottom: 14,
              }}>
                <span style={{ padding: "0 16px", color: "#888", fontWeight: 800, fontSize: 18, borderRight: "1px solid #2a2a2a", fontFamily: "'Inter', sans-serif" }}>$</span>
                <input
                  type="number"
                  value={withdrawAmt}
                  onChange={e => setWithdrawAmt(e.target.value)}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#e8e0d0", fontFamily: "'Roboto Mono', monospace",
                    fontSize: 22, fontWeight: 700, padding: "14px 16px",
                  }}
                />
                <button onClick={() => setWithdrawAmt(String(realBalance))} style={{
                  background: "#1a1400", color: "#F5C842",
                  border: "none", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700, fontSize: 11, padding: "0 16px",
                  borderLeft: "1px solid #2a2a2a",
                }}>MAX</button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                {[500, 1000, 3000, 5000].map(a => (
                  <button key={a} onClick={() => setWithdrawAmt(String(a))} style={{
                    flex: 1,
                    background: withdrawAmt === String(a) ? "#F5C842" : "#161616",
                    color: withdrawAmt === String(a) ? "#0d0d0d" : "#888",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8, cursor: "pointer",
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 700, fontSize: 11, padding: "8px 0",
                    transition: "all 0.15s",
                  }}>{a >= 1000 ? `${a / 1000}K` : a}</button>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                background: "#161616", borderRadius: 12, padding: "16px 18px",
                border: "1px solid #1e1e1e", marginBottom: 24,
              }}>
                {[
                  { label: "Withdrawal Amount", val: fmt(parseInt(withdrawAmt || "0")) },
                  { label: `Processing Fee (${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.fee})`, val: parseInt(withdrawAmt || "0") > 0 ? `-${fmt(Math.ceil(parseInt(withdrawAmt) * 0.01))}` : "$0" },
                ].map(r => (
                  <div key={r.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "7px 0", borderBottom: "1px solid #1e1e1e",
                  }}>
                    <span style={{ color: "#666", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{r.label}</span>
                    <span className="mono" style={{ color: "#e8e0d0", fontSize: 12, fontWeight: 700 }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>You Receive</span>
                  <span className="mono" style={{ color: "#F5C842", fontSize: 15, fontWeight: 700 }}>
                    {fmt(Math.max(0, parseInt(withdrawAmt || "0") - Math.ceil(parseInt(withdrawAmt || "0") * 0.01)))}
                  </span>
                </div>
              </div>

              <button style={{
                width: "100%",
                background: "#161616",
                color: "#e8e0d0", border: "1px solid #2a2a2a", cursor: "pointer",
                padding: "15px", borderRadius: 12,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: 15, letterSpacing: "0.04em",
              }}>
                Request Withdrawal ↑
              </button>
            </div>

            {/* right panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "#111", border: "1px solid #1e1e1e",
                borderRadius: 16, padding: "24px 22px",
              }}>
                <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 18, fontFamily: "'Inter', sans-serif" }}>Withdrawal Limits</p>
                {[
                  { label: "Minimum",     val: "$200",    color: "#e8e0d0" },
                  { label: "Daily Max",   val: "$50,000", color: "#e8e0d0" },
                  { label: "Monthly Max", val: "$200,000",color: "#e8e0d0" },
                  { label: "Pending",     val: "$3,000",  color: "#FBBF24" },
                  { label: "Available",   val: fmt(realBalance), color: "#4ADE80" },
                ].map(l => (
                  <div key={l.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "9px 0", borderBottom: "1px solid #161616",
                  }}>
                    <span style={{ color: "#666", fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{l.label}</span>
                    <span className="mono" style={{ color: l.color, fontWeight: 700, fontSize: 12 }}>{l.val}</span>
                  </div>
                ))}
              </div>

              <div style={{
                background: "#111", border: "1px solid #1e1e1e",
                borderRadius: 16, padding: "24px 22px",
              }}>
                <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>Pending Withdrawals</p>
                <div style={{
                  background: "#161616", borderRadius: 10, padding: "14px 16px",
                  border: "1px solid #2a2a2a",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Bank Transfer</p>
                    <p style={{ color: "#555", fontSize: 11, marginTop: 3 }} className="mono">Apr 15 · 03:22 PM</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="mono" style={{ color: "#F87171", fontWeight: 700, fontSize: 14 }}>−$3,000</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, justifyContent: "flex-end" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FBBF24" }} />
                      <span style={{ color: "#FBBF24", fontSize: 10, fontFamily: "'Inter', sans-serif" }}>Pending</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: "#555", fontSize: 11, marginTop: 12, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                  Bank transfers typically process within 2–3 business days.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}