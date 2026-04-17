"use client";

import { useState } from "react";
import localFont from "next/font/local";

// ─── Types ───────────────────────────────────────────────────────────────────
type RewardType = "cash" | "bonus" | "freebet";
type RewardStatus = "available" | "claimed" | "locked";

interface Reward {
  id: string;
  type: RewardType;
  title: string;
  description: string;
  value: number;
  currency: string;
  status: RewardStatus;
  expiresIn?: string;
  claimedAt?: string;
  requirements?: {
    label: string;
    current: number;
    total: number;
  }[];
  badge?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const rewards: Reward[] = [
  // AVAILABLE
  {
    id: "r1",
    type: "cash",
    title: "Weekend Winner Bonus",
    description: "You crushed the weekend challenges. Here's your cash prize.",
    value: 5000,
    currency: "GC",
    status: "available",
    expiresIn: "2d 14h",
    badge: "🏆 Top Performer",
    isFeatured: true,
    isNew: true,
  },
  {
    id: "r2",
    type: "freebet",
    title: "Free Prediction Token",
    description: "Use this to enter any challenge without spending GC.",
    value: 500,
    currency: "GC",
    status: "available",
    expiresIn: "5d 08h",
    isNew: true,
  },
  {
    id: "r3",
    type: "bonus",
    title: "7-Day Login Streak",
    description: "Reward for logging in 7 consecutive days.",
    value: 100,
    currency: "GC",
    status: "available",
    expiresIn: "1d 02h",
  },
  {
    id: "r4",
    type: "cash",
    title: "Referral Cashback",
    description: "You referred 3 friends this month. Enjoy your bonus!",
    value: 1500,
    currency: "GC",
    status: "available",
    expiresIn: "7d 00h",
  },
  // LOCKED
  {
    id: "r5",
    type: "cash",
    title: "Grand Prediction Cup Prize",
    description: "Finish Top 10 in the Grand Cup to unlock this reward.",
    value: 25000,
    currency: "GC",
    status: "locked",
    badge: "🥇 Exclusive",
    requirements: [
      { label: "Top-10 Leaderboard Finish", current: 42, total: 10 },
      { label: "Predictions Submitted", current: 7, total: 15 },
    ],
  },
  {
    id: "r6",
    type: "freebet",
    title: "Diamond League Token",
    description: "Reach Diamond rank to claim this elite token.",
    value: 2000,
    currency: "GC",
    status: "locked",
    requirements: [
      { label: "Diamond Rank Achieved", current: 0, total: 1 },
      { label: "Win 5 Challenges in a Row", current: 3, total: 5 },
    ],
  },
  {
    id: "r7",
    type: "bonus",
    title: "CS:GO Finals Predictor Badge",
    description: "Predict the CS:GO Major Finals outcome correctly.",
    value: 750,
    currency: "GC",
    status: "locked",
    requirements: [{ label: "CS:GO Finals Prediction", current: 0, total: 1 }],
  },
  // CLAIMED
  {
    id: "r8",
    type: "cash",
    title: "First Win Bonus",
    description: "Your very first prediction win — well played!",
    value: 200,
    currency: "GC",
    status: "claimed",
    claimedAt: "Apr 10, 2026",
  },
  {
    id: "r9",
    type: "bonus",
    title: "Welcome Bonus Pack",
    description: "Thanks for joining the GoldenChance arena.",
    value: 500,
    currency: "GC",
    status: "claimed",
    claimedAt: "Apr 05, 2026",
  },
  {
    id: "r10",
    type: "freebet",
    title: "5-Game Streak Reward",
    description: "You hit a 5-game winning streak. Legendary!",
    value: 300,
    currency: "GC",
    status: "claimed",
    claimedAt: "Mar 28, 2026",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const typeConfig: Record<RewardType, { label: string; color: string; icon: string; bg: string }> = {
  cash: {
    label: "Cash Prize",
    color: "#F5C518",
    icon: "💰",
    bg: "rgba(245,197,24,0.08)",
  },
  bonus: {
    label: "Bonus GC",
    color: "#4ADE80",
    icon: "🎁",
    bg: "rgba(74,222,128,0.08)",
  },
  freebet: {
    label: "Free Bet",
    color: "#60A5FA",
    icon: "🎯",
    bg: "rgba(96,165,250,0.08)",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RewardCard({ reward, onClaim }: { reward: Reward; onClaim: (id: string) => void }) {
  const cfg = typeConfig[reward.type];
  const isClaimed = reward.status === "claimed";
  const isLocked = reward.status === "locked";
  const isAvailable = reward.status === "available";

  return (
    <div
      style={{
        background: reward.isFeatured
          ? "linear-gradient(135deg, rgba(245,197,24,0.10) 0%, rgba(26,26,32,1) 60%)"
          : "rgba(255,255,255,0.03)",
        border: reward.isFeatured
          ? "1px solid rgba(245,197,24,0.35)"
          : isClaimed
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        opacity: isClaimed ? 0.55 : 1,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isAvailable ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (!isClaimed)
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Glow accent for featured */}
      {reward.isFeatured && (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: cfg.bg,
              border: `1px solid ${cfg.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: cfg.color,
                marginBottom: 2,
              }}
            >
              {cfg.label}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
              {reward.title}
            </div>
          </div>
        </div>

        {/* Status badge / value */}
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          {isClaimed ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#4ADE80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.25)",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              ✓ Claimed
            </span>
          ) : isLocked ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#94A3B8",
                background: "rgba(148,163,184,0.08)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              🔒 Locked
            </span>
          ) : null}
          <div
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: cfg.color,
              marginTop: isClaimed || isLocked ? 6 : 0,
            }}
          >
            +{reward.value.toLocaleString()} <span style={{ fontSize: 13 }}>{reward.currency}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 16px", lineHeight: 1.6 }}>
        {reward.description}
      </p>

      {/* Lock progress bars */}
      {isLocked && reward.requirements && (
        <div style={{ marginBottom: 16 }}>
          {reward.requirements.map((req, i) => {
            const pct = Math.min((req.current / req.total) * 100, 100);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{req.label}</span>
                  <span
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: 12,
                      color: "#94A3B8",
                    }}
                  >
                    {req.current}/{req.total}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #F5C518, #FF8C00)",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {reward.badge && (
            <span
              style={{
                fontSize: 11,
                color: "#F5C518",
                background: "rgba(245,197,24,0.1)",
                border: "1px solid rgba(245,197,24,0.25)",
                borderRadius: 20,
                padding: "2px 9px",
                fontWeight: 600,
              }}
            >
              {reward.badge}
            </span>
          )}
          {reward.isNew && (
            <span
              style={{
                fontSize: 10,
                color: "#FF6B35",
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.3)",
                borderRadius: 20,
                padding: "2px 8px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              NEW
            </span>
          )}
          {reward.expiresIn && !isClaimed && (
            <span style={{ fontSize: 11, color: "#64748B" }}>⏱ Expires in {reward.expiresIn}</span>
          )}
          {isClaimed && reward.claimedAt && (
            <span style={{ fontSize: 11, color: "#475569" }}>Claimed {reward.claimedAt}</span>
          )}
        </div>

        {isAvailable && (
          <button
            onClick={() => onClaim(reward.id)}
            style={{
              background: "linear-gradient(135deg, #F5C518 0%, #FF8C00 100%)",
              border: "none",
              borderRadius: 8,
              padding: "9px 20px",
              fontSize: 13,
              fontWeight: 700,
              color: "#0A0A0F",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<RewardStatus>("available");
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastValue, setToastValue] = useState(0);

  const handleClaim = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (!reward) return;
    setClaimingId(id);
    setTimeout(() => {
      setClaimedIds((prev) => new Set([...prev, id]));
      setClaimingId(null);
      setToastValue(reward.value);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 900);
  };

  const getStatus = (r: Reward): RewardStatus => {
    if (claimedIds.has(r.id)) return "claimed";
    return r.status;
  };

  const filtered = rewards.filter((r) => getStatus(r) === activeTab);

  const stats = {
    available: rewards.filter((r) => getStatus(r) === "available").length,
    claimed: rewards.filter((r) => getStatus(r) === "claimed").length,
    locked: rewards.filter((r) => getStatus(r) === "locked").length,
    totalClaimed: rewards
      .filter((r) => getStatus(r) === "claimed")
      .reduce((a, b) => a + b.value, 0),
  };

  const tabs: { key: RewardStatus; label: string; count: number }[] = [
    { key: "available", label: "Available", count: stats.available },
    { key: "claimed", label: "Claimed", count: stats.claimed },
    { key: "locked", label: "Locked", count: stats.locked },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0A0A0F;
          color: #E2E8F0;
          font-family: 'Sora', 'Nunito', sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes coinSpin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.3); }
          50%       { box-shadow: 0 0 0 10px rgba(245,197,24,0); }
        }

        .card-enter {
          animation: fadeSlideIn 0.4s ease both;
        }
        .card-enter:nth-child(1) { animation-delay: 0.05s; }
        .card-enter:nth-child(2) { animation-delay: 0.10s; }
        .card-enter:nth-child(3) { animation-delay: 0.15s; }
        .card-enter:nth-child(4) { animation-delay: 0.20s; }
      `}</style>

      
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* PAGE HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
            animation: "fadeSlideIn 0.45s ease both",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#F5C518",
                marginBottom: 6,
              }}
            >
              ★ Your Earnings
            </div>
            <h1
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Rewards Center
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginTop: 6 }}>
              Claim your earnings, track your milestones, unlock exclusive prizes.
            </p>
          </div>

          {/* Total Claimed stat */}
          <div
            style={{
              background: "rgba(245,197,24,0.07)",
              border: "1px solid rgba(245,197,24,0.2)",
              borderRadius: 14,
              padding: "16px 24px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Total Claimed</div>
            <div
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: "#F5C518",
              }}
            >
              {(
                stats.totalClaimed +
                [...claimedIds]
                  .map((id) => rewards.find((r) => r.id === id)?.value ?? 0)
                  .reduce((a, b) => a + b, 0)
              ).toLocaleString()}{" "}
              <span style={{ fontSize: 14 }}>GC</span>
            </div>
          </div>
        </div>

        {/* STAT STRIP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
            marginBottom: 32,
            animation: "fadeSlideIn 0.5s 0.05s ease both",
          }}
        >
          {[
            { label: "Available Now", value: stats.available, color: "#F5C518", icon: "🎁" },
            { label: "Rewards Claimed", value: stats.claimed, color: "#4ADE80", icon: "✅" },
            { label: "Locked Rewards", value: stats.locked, color: "#60A5FA", icon: "🔒" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 26,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FEATURED BANNER */}
        {activeTab === "available" && (
          <div
            style={{
              marginBottom: 28,
              borderRadius: 18,
              background:
                "linear-gradient(120deg, rgba(245,197,24,0.15) 0%, rgba(255,140,0,0.08) 50%, rgba(10,10,15,0.95) 100%)",
              border: "1px solid rgba(245,197,24,0.3)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "fadeSlideIn 0.5s 0.1s ease both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 300,
                background:
                  "radial-gradient(ellipse at right, rgba(245,197,24,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#FF8C00",
                  marginBottom: 6,
                }}
              >
                🔥 Limited Time
              </div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                  marginBottom: 4,
                }}
              >
                Grand Prediction Cup — Prize Pool Open
              </h2>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>
                Finish Top 10 this weekend to unlock{" "}
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    color: "#F5C518",
                    fontWeight: 700,
                  }}
                >
                  25,000 GC
                </span>{" "}
                in exclusive prizes.
              </p>
            </div>
            <button
              style={{
                background: "linear-gradient(135deg, #F5C518, #FF8C00)",
                border: "none",
                borderRadius: 10,
                padding: "12px 26px",
                fontSize: 14,
                fontWeight: 800,
                color: "#0A0A0F",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: 20,
                letterSpacing: "0.03em",
                animation: "pulse-glow 2s infinite",
              }}
            >
              Join Now →
            </button>
          </div>
        )}

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            width: "fit-content",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #F5C518, #FF8C00)"
                    : "transparent",
                border: "none",
                borderRadius: 9,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 700,
                color: activeTab === tab.key ? "#0A0A0F" : "#64748B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 11,
                  background:
                    activeTab === tab.key
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "1px 7px",
                  color: activeTab === tab.key ? "#0A0A0F" : "#94A3B8",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* REWARD GRID */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#475569",
              animation: "fadeSlideIn 0.4s ease",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {activeTab === "available" ? "🎁" : activeTab === "claimed" ? "✅" : "🔒"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#64748B" }}>
              {activeTab === "available"
                ? "No rewards available right now"
                : activeTab === "claimed"
                ? "You haven't claimed any rewards yet"
                : "No locked rewards"}
            </div>
            <p style={{ fontSize: 13, marginTop: 6 }}>
              Keep playing to earn more rewards!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((reward, i) => {
              const r = { ...reward, status: getStatus(reward) };
              return (
                <div key={reward.id} className="card-enter" style={{ animationDelay: `${i * 0.07}s` }}>
                  {claimingId === reward.id ? (
                    // Claiming animation state
                    <div
                      style={{
                        background: "rgba(245,197,24,0.06)",
                        border: "1px solid rgba(245,197,24,0.3)",
                        borderRadius: 16,
                        padding: "22px 24px",
                        minHeight: 190,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                      }}
                    >
                      <div style={{ fontSize: 38, animation: "coinSpin 0.7s linear infinite" }}>
                        🪙
                      </div>
                      <div style={{ fontSize: 13, color: "#F5C518", fontWeight: 600 }}>
                        Processing claim...
                      </div>
                      <div
                        style={{
                          width: 120,
                          height: 4,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.07)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 999,
                            background: "linear-gradient(90deg, #F5C518, #FF8C00)",
                            backgroundSize: "600px 100%",
                            animation: "shimmer 1s linear infinite",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <RewardCard reward={r} onClaim={handleClaim} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LOCKED UNLOCK GUIDE */}
        {activeTab === "locked" && (
          <div
            style={{
              marginTop: 36,
              background: "rgba(96,165,250,0.04)",
              border: "1px solid rgba(96,165,250,0.15)",
              borderRadius: 14,
              padding: "20px 24px",
              animation: "fadeSlideIn 0.5s 0.3s ease both",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#60A5FA",
                marginBottom: 10,
              }}
            >
              💡 How to Unlock Rewards
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { icon: "🎮", text: "Participate in active Challenges" },
                { icon: "📈", text: "Climb the Leaderboard rankings" },
                { icon: "🔥", text: "Maintain daily login streaks" },
                { icon: "🎯", text: "Submit accurate predictions" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* TOAST */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1a2a10, #0d1f08)",
            border: "1px solid rgba(74,222,128,0.35)",
            borderRadius: 14,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            animation: "toastIn 0.35s ease",
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 26 }}>🎉</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>
              Reward Claimed!
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  color: "#F5C518",
                  fontWeight: 700,
                }}
              >
                +{toastValue.toLocaleString()} GC
              </span>{" "}
              has been added to your wallet.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
