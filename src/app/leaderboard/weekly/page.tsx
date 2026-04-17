import Link from 'next/link'

export default function WeeklyLeaderboardPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#070709', color: '#F0F0F0', fontFamily: "'Syne',system-ui,sans-serif", padding: '28px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>Weekly Leaderboard</div>
            <div style={{ color: '#999', fontSize: 15, maxWidth: 760, lineHeight: 1.6 }}>See this week’s top performers and challenge streaks. Fresh rankings are updated every Monday to keep the competition moving.</div>
          </div>

          <Link href="/leaderboard" style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
            Back to Leaderboard
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          {[
            { title: 'Top Weekly Rank', label: 'Highest earners in the latest weekly cycle', value: 'Top 10' },
            { title: 'Fastest Climb', label: 'Players with the most GC gained this week', value: '+3,720 GC' },
            { title: 'New Challenger', label: 'Best newcomer performance on this week’s board', value: '2nd Place' },
          ].map(card => (
            <div key={card.title} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F5C518', marginBottom: 10 }}>{card.title}</div>
              <div style={{ color: '#aaa', fontSize: 14, marginBottom: 18 }}>{card.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Weekly Highlights</div>
            <div style={{ color: '#999', fontSize: 14, lineHeight: 1.7 }}>Check the leaderboard for the latest challenge winners and momentum players who are climbing fast this week.</div>
          </div>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Get ready to race</div>
            <div style={{ color: '#999', fontSize: 14, lineHeight: 1.7 }}>Join live challenges now to lock in points for this week’s leaderboard before the next reset.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
