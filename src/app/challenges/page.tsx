"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/nav/Header'

// ============================================================
// DATA TYPES
// ============================================================
interface Team { code: string; name: string; score: number; prob: number }
interface Challenge {
  id: number; title: string; emoji: string; badge: string | null
  entry: number; reward: number; cur: number; max: number
  end: number; status: 'live' | 'upcoming' | 'completed'
  win: number; avg: number; teamA: Team; teamB: Team
  type: string; region: string
}

// ============================================================
// STATIC DATA
// ============================================================
const NOW = Date.now(); const H = 3600000

const CHALLENGES: Challenge[] = [
  { id:1, title:'Grand Prediction Cup', emoji:'🏆', badge:'hot', entry:49, reward:25000, cur:178, max:200, end:NOW+1.5*H, status:'live', win:32, avg:52, teamA:{code:'PHX',name:'Phoenix Esports',score:2,prob:58}, teamB:{code:'SHW',name:'Shadow Wolves',score:1,prob:42}, type:'Best of 5', region:'International' },
  { id:2, title:'Crypto Trivia Royale', emoji:'🪙', badge:'reward', entry:99, reward:120000, cur:89, max:300, end:NOW+4*H, status:'live', win:45, avg:105, teamA:{code:'NA',name:'NovaStar Alpha',score:3,prob:61}, teamB:{code:'CE',name:'Cyber Eclipse',score:2,prob:39}, type:'Trivia — 10 Qs', region:'Global' },
  { id:3, title:'Lightning Round Challenge', emoji:'⚡', badge:'trend', entry:29, reward:15000, cur:200, max:200, end:NOW+2*H, status:'live', win:18, avg:30, teamA:{code:'SK',name:'Storm Kings',score:1,prob:45}, teamB:{code:'VR',name:'Void Runners',score:1,prob:55}, type:'Best of 3', region:'Asia-Pacific' },
  { id:4, title:'Weekly Mastermind', emoji:'🧠', badge:null, entry:149, reward:200000, cur:45, max:500, end:NOW+8*H, status:'live', win:58, avg:155, teamA:{code:'BF',name:'BlazeFury',score:0,prob:52}, teamB:{code:'IC',name:'IronClad',score:0,prob:48}, type:'Skill Puzzle', region:'International' },
  { id:5, title:'Strategy Kings Cup', emoji:'♟', badge:'trend', entry:39, reward:25000, cur:112, max:200, end:NOW+3*H, status:'live', win:40, avg:42, teamA:{code:'DK',name:'Dragon Kings',score:2,prob:55}, teamB:{code:'IG',name:'Ice Giants',score:1,prob:45}, type:'Best of 5', region:'Europe' },
  { id:6, title:'Mega Jackpot Prediction', emoji:'🎰', badge:'hot', entry:19, reward:50000, cur:0, max:500, end:NOW+24*H, status:'upcoming', win:65, avg:22, teamA:{code:'SR',name:'Storm Raiders',score:0,prob:50}, teamB:{code:'NV',name:'Neon Vipers',score:0,prob:50}, type:'Best of 5', region:'Global' },
  { id:7, title:'Golden League Finals', emoji:'👑', badge:'reward', entry:199, reward:500000, cur:0, max:1000, end:NOW+48*H, status:'upcoming', win:72, avg:210, teamA:{code:'OS',name:'Omega Squad',score:0,prob:50}, teamB:{code:'PF',name:'Prism Force',score:0,prob:50}, type:'Grand Final', region:'International' },
  { id:8, title:'Champions Finale', emoji:'🥇', badge:null, entry:59, reward:35000, cur:250, max:250, end:NOW-2*H, status:'completed', win:25, avg:62, teamA:{code:'FH',name:'Frost Hawks',score:3,prob:60}, teamB:{code:'BT',name:'Blaze Titans',score:1,prob:40}, type:'Best of 5', region:'NA' },
  { id:9, title:'Knowledge Bowl S1', emoji:'📚', badge:null, entry:79, reward:75000, cur:180, max:200, end:NOW-5*H, status:'completed', win:28, avg:82, teamA:{code:'CF',name:'CrimsonFox',score:2,prob:48}, teamB:{code:'SW',name:'SteelWraith',score:2,prob:52}, type:'Trivia — 15 Qs', region:'Europe' },
]

const PLAYERS = [
  { name:'VoidRunner', initials:'VR', wins:48, pts:12840, bg:'rgba(74,158,255,.2)', col:'#4A9EFF', team:'PHX', stake:800, arrow:'↑' },
  { name:'NightHawk', initials:'NH', wins:42, pts:11238, bg:'rgba(100,100,120,.2)', col:'#888', team:'SHW', stake:500, arrow:'↑' },
  { name:'SteelWraith', initials:'SW', wins:39, pts:9870, bg:'rgba(245,197,24,.2)', col:'#f5c518', team:'PHX', stake:300, arrow:'↓' },
  { name:'BlazeFury', initials:'BF', wins:35, pts:8650, bg:'rgba(255,69,69,.2)', col:'#FF4545', team:'SHW', stake:450, arrow:'↑' },
  { name:'CrimsonFox', initials:'CF', wins:31, pts:7428, bg:'rgba(150,80,220,.2)', col:'#9050DC', team:'PHX', stake:200, arrow:'↓' },
]

const FEED = [
  { name:'DarkNova', initials:'DN', bg:'rgba(74,158,255,.25)', col:'#4A9EFF', txt:'joined with 100 coins on PHX' },
  { name:'SilverBolt', initials:'SB', bg:'rgba(200,200,200,.15)', col:'#ccc', txt:'staked 200 coins on SHW' },
  { name:'SteelWraith', initials:'SW', bg:'rgba(245,197,24,.2)', col:'#f5c518', txt:'staked 300 coins on PHX' },
  { name:'VoidRunner', initials:'VR', bg:'rgba(74,158,255,.2)', col:'#4A9EFF', txt:'increased stake to 800 coins' },
]

// ============================================================
// UTILITIES
// ============================================================
function pad(n: number) { return String(n).padStart(2,'0') }
function fmtTime(ms: number) {
  if (ms <= 0) return '00:00:00'
  const h = Math.floor(ms/H), m = Math.floor((ms%H)/60000), s = Math.floor((ms%60000)/1000)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ChallengesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'live'|'upcoming'|'completed'>('live')
  const [detailId, setDetailId] = useState<number|null>(null)
  const [stake, setStake] = useState(250)
  const [selectedTeam, setSelectedTeam] = useState<'a'|'b'|null>(null)
  const [activeDTab, setActiveDTab] = useState('overview')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState({ show:false, title:'', sub:'' })
  const [timers, setTimers] = useState<Record<number,string>>({})

  const currentCh = detailId ? CHALLENGES.find(c => c.id === detailId) : null

  // Timer tick
  useEffect(() => {
    const tick = () => {
      const t: Record<number,string> = {}
      CHALLENGES.forEach(c => { if (c.status !== 'completed') t[c.id] = fmtTime(c.end - Date.now()) })
      setTimers(t)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const showToast = (title: string, sub: string) => {
    setToast({ show:true, title, sub })
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3500)
  }

  const list = CHALLENGES.filter(c => c.status === activeTab)

  // ============================================================
  // SHARED STYLES
  // ============================================================
  const pageStyle = {
    fontFamily:"'Syne',system-ui,sans-serif",
    background:'#070709',
    color:'#F0F0F0',
    minHeight:'100vh'
  }

  // ---- DETAIL VIEW ----
  if (currentCh) {
    const c = currentCh
    return (
      <div style={pageStyle}>
        <Header active="Challenges" />
        <style>{`
          @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.8)}}
        `}</style>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'20px 24px', display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start' }}>
          {/* LEFT */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Back button */}
            <button
              onClick={() => setDetailId(null)}
              style={{ display:'inline-flex', alignItems:'center', gap:6, background:'none', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, color:'#666', fontFamily:'inherit', fontWeight:600, fontSize:12, padding:'7px 13px', cursor:'pointer', width:'fit-content' }}
            >
              ← Back to Challenges
            </button>

            {/* Prediction Panel */}
            <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'rgba(245,197,24,0.12)', border:'1px solid rgba(245,197,24,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{c.emoji}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15 }}>{c.title}</div>
                    <div style={{ fontWeight:500, fontSize:11, color:'#666', marginTop:1 }}>Make your prediction now</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,69,69,0.12)', border:'1px solid rgba(255,69,69,0.25)', borderRadius:999, padding:'5px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11, color:'#FF4545' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#FF4545', display:'inline-block' }}></span> Live Score
                </div>
              </div>

              {/* Teams */}
              <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center' }}>
                {[
                  {team:c.teamA, side:'a' as const, color:'#FF4545', bg:'rgba(255,69,69,0.15)'},
                  {team:c.teamB, side:'b' as const, color:'#4A9EFF', bg:'rgba(74,158,255,0.15)'}
                ].map(({team,side,color,bg}) => (
                  <div key={side} onClick={() => setSelectedTeam(selectedTeam===side?null:side)} style={{ background:'#0d0d12', border:`1px solid ${selectedTeam===side?'#F5C518':'rgba(255,255,255,0.07)'}`, borderRadius:12, padding:16, textAlign:'center', cursor:'pointer', boxShadow:selectedTeam===side?'0 0 20px rgba(245,197,24,0.18)':'none', transition:'all .2s', position:'relative' }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:bg, border:`2px solid ${selectedTeam===side?'#F5C518':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:18, color, margin:'0 auto 10px' }}>{team.code}</div>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{team.name}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:32 }}>{team.score}</div>
                    {selectedTeam===side && <div style={{ position:'absolute', bottom:-1, left:'50%', transform:'translateX(-50%)', background:'#F5C518', color:'#0a0a0a', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:9, padding:'2px 8px', borderRadius:'4px 4px 0 0', whiteSpace:'nowrap' }}>✓ Selected</div>}
                  </div>
                ))}
                <div style={{ textAlign:'center' }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11, color:'#444', background:'rgba(255,255,255,0.05)', padding:'5px 9px', borderRadius:7, display:'block', marginBottom:5 }}>VS</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:9, color:'#444', letterSpacing:.5 }}>HALF TIME</span>
                </div>
              </div>

              {/* Prob bar */}
              <div style={{ padding:'0 20px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontWeight:600, fontSize:11, color:'#666' }}>Win Probability</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:10, color:'#F5C518' }}>⚡ Live</span>
                </div>
                <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:999, overflow:'hidden', position:'relative', marginBottom:6 }}>
                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${c.teamA.prob}%`, background:'linear-gradient(90deg,#FF4545,#FF8C00)', borderRadius:999 }}></div>
                  <div style={{ position:'absolute', right:0, top:0, height:'100%', width:`${c.teamB.prob}%`, background:'linear-gradient(270deg,#4A9EFF,#00BFFF)', borderRadius:999 }}></div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:13 }}>
                  <span style={{ color:'#FF4545' }}>{c.teamA.prob}%</span>
                  <span style={{ color:'#4A9EFF' }}>{c.teamB.prob}%</span>
                </div>
              </div>
              <div style={{ textAlign:'center', padding:'10px 20px 16px', fontWeight:500, fontSize:12, color:'#666' }}>Select a team above to place your prediction</div>

              {/* Stake */}
              <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:10 }}>
                  <span style={{ color:'#666' }}>Your Stake (Coins)</span>
                  <span style={{ color:'#F5C518', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:14 }}>{stake} Coins</span>
                </div>
                <input type="range" min={10} max={1000} value={stake} step={1} onChange={e=>setStake(Number(e.target.value))} style={{ width:'100%', accentColor:'#F5C518', marginBottom:6 }}/>
                <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#444', marginBottom:14 }}><span>10</span><span>1,000</span></div>
                <button onClick={() => setModal(true)} style={{ width:'100%', padding:13, borderRadius:10, background:'linear-gradient(90deg,#F5C518,#FFD700)', color:'#0a0a0a', fontWeight:800, fontSize:14, border:'none', cursor:'pointer', fontFamily:'inherit' }}>Lock Prediction</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:2, background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:4 }}>
              {['overview','players','rules','rewards'].map(tab => (
                <button key={tab} onClick={() => setActiveDTab(tab)} style={{ flex:1, padding:'9px 8px', borderRadius:8, fontFamily:'inherit', fontWeight:700, fontSize:12, background: activeDTab===tab?'#F5C518':'transparent', color: activeDTab===tab?'#0a0a0a':'#666', border:'none', cursor:'pointer', transition:'all .2s', textTransform:'capitalize' }}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
              ))}
            </div>

            {/* Overview */}
            {activeDTab==='overview' && (
              <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>⭐ Challenge Overview</div>
                <p style={{ fontWeight:400, fontSize:13, color:'#888', lineHeight:1.75, marginBottom:18 }}>{c.title} is a high-stakes prediction challenge featuring {c.teamA.name} vs {c.teamB.name}. Predictors compete for a massive ₹{c.reward.toLocaleString()} reward pool. Place your prediction before or during the match — the earlier you predict, the higher the multiplier.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[['Match Type',c.type],['Region',c.region],['Min. Stake','10 Coins'],['Max. Stake','1,000 Coins']].map(([l,v])=>(
                    <div key={l} style={{ background:'#0d0d12', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:12 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#444', textTransform:'uppercase', letterSpacing:.7, marginBottom:4 }}>{l}</div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            {activeDTab==='players' && (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {PLAYERS.map((p,i) => (
                  <div key={p.name} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ width:22, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:12, color: i===0?'#F5C518':'#444' }}>{i+1}</span>
                      <div style={{ width:34, height:34, borderRadius:9, background:p.bg, color:p.col, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11 }}>{p.initials}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#666' }}>{p.wins} wins</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:13, color:'#F5C518' }}>{p.stake} Coins → {p.team}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#666' }}>{p.pts.toLocaleString()} pts <span style={{ color: p.arrow==='↑'?'#00E676':'#FF4545' }}>{p.arrow}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rules */}
            {activeDTab==='rules' && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  ['Prediction Window','Predictions can be placed before or during the live match. Early predictions earn a higher multiplier.'],
                  ['Minimum Stake','You must stake at least 10 Coins to participate in this challenge.'],
                  ['Win Condition','Correctly predict the winning team. Staked amount × win multiplier = your reward.'],
                  ['Refund Policy','If a match is cancelled or postponed, all stakes are refunded in full within 24 hours.'],
                  ['Fair Play','Any attempt to manipulate predictions or exploit the platform will result in disqualification.'],
                ].map(([title,desc],i) => (
                  <div key={title} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:14, display:'flex', gap:12 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:'rgba(245,197,24,0.12)', border:'1px solid rgba(245,197,24,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11, color:'#F5C518', flexShrink:0 }}>{i+1}</div>
                    <div style={{ fontWeight:400, fontSize:13, color:'#999', lineHeight:1.65 }}><b style={{ color:'#F0F0F0' }}>{title}:</b> {desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Rewards */}
            {activeDTab==='rewards' && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {[
                  {pos:'1st Place',trophy:'🥇',pct:0.5,label:'50% of pool'},
                  {pos:'2nd Place',trophy:'🥈',pct:0.25,label:'25% of pool'},
                  {pos:'3rd Place',trophy:'🥉',pct:0.15,label:'15% of pool'},
                  {pos:'4th–10th',trophy:'🎖',amount:'500 GC',label:'ea. 2% pool'},
                  {pos:'Top 20%',trophy:'🎁',amount:'250 GC',label:'Participation'},
                  {pos:'All Players',trophy:'⭐',amount:'+10 XP',label:'Win or lose'},
                ].map(r => (
                  <div key={r.pos} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:14, textAlign:'center' }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#666', textTransform:'uppercase', letterSpacing:.7, marginBottom:6 }}>{r.pos}</div>
                    <div style={{ fontSize:28, marginBottom:6 }}>{r.trophy}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:15, background:'linear-gradient(135deg,#F5C518,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {'pct' in r && r.pct !== undefined ? `₹${Math.floor(c.reward * r.pct).toLocaleString()}` : r.amount}
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666', marginTop:3 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* More Challenges */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ fontWeight:700, fontSize:17 }}>More Challenges</div>
                <button onClick={() => setDetailId(null)} style={{ background:'none', border:'none', fontFamily:'inherit', fontWeight:600, fontSize:13, color:'#F5C518', cursor:'pointer' }}>Browse All</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                {CHALLENGES.filter(x=>x.id!==c.id&&x.status==='live').slice(0,4).map(x => (
                  <div key={x.id} onClick={() => setDetailId(x.id)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:14, cursor:'pointer', transition:'border-color .2s,transform .2s' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666' }}>⏱ {timers[x.id]||'--:--:--'}</span>
                    </div>
                    <div style={{ fontWeight:700, fontSize:12, marginBottom:3 }}>{x.title}</div>
                    <div style={{ fontSize:10, color:'#666', marginBottom:10, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{x.teamA.name} vs {x.teamB.name}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:13, background:'linear-gradient(135deg,#F5C518,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>₹{x.reward.toLocaleString()}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666' }}>👥 {x.cur}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
            {/* Leaderboard */}
            <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontWeight:700, fontSize:13 }}>📊 Leaderboard</span>
                <button style={{ fontWeight:600, fontSize:11, color:'#F5C518', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>View All</button>
              </div>
              {PLAYERS.map((p,i) => (
                <div key={p.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom: i<PLAYERS.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ width:18, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11, color:'#444', textAlign:'center' }}>{i===0?'🥇':i+1}</span>
                    <div style={{ width:30, height:30, borderRadius:8, background:p.bg, color:p.col, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:10 }}>{p.initials}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:12 }}>{p.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666' }}>{p.wins} wins</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:12, color:'#F5C518' }}>{p.pts.toLocaleString()}</span>
                    <span style={{ color: p.arrow==='↑'?'#00E676':'#FF4545', fontSize:11 }}>{p.arrow}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Feed */}
            <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontWeight:700, fontSize:13 }}>⚡ Live Feed</span>
                <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,69,69,0.1)', border:'1px solid rgba(255,69,69,0.2)', borderRadius:999, padding:'3px 10px', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:9, color:'#FF4545' }}>
                  ● Real-time
                </div>
              </div>
              <div style={{ padding:'8px 0' }}>
                {FEED.map((f,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, padding:'9px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width:26, height:26, borderRadius:7, background:f.bg, color:f.col, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:9, flexShrink:0 }}>{f.initials}</div>
                    <div>
                      <div style={{ fontSize:11, color:'#666', lineHeight:1.55 }}><b style={{ color:'#F0F0F0' }}>{f.name}</b> {f.txt}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#444', marginTop:2 }}>Just now</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modal && (
          <div onClick={e => e.target===e.currentTarget&&setModal(false)} style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
            <div style={{ width:'100%', maxWidth:400, background:'#111118', border:'1px solid rgba(245,197,24,0.2)', borderRadius:18, overflow:'hidden', boxShadow:'0 0 60px rgba(245,197,24,0.15)' }}>
              <div style={{ background:'linear-gradient(135deg,rgba(245,197,24,0.1),transparent)', padding:'20px 20px 14px', position:'relative' }}>
                <button onClick={() => setModal(false)} style={{ position:'absolute', top:14, right:14, width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', color:'#666', cursor:'pointer', fontFamily:'inherit' }}>✕</button>
                <div style={{ fontSize:28, marginBottom:8 }}>{c.emoji}</div>
                <div style={{ fontWeight:800, fontSize:16 }}>{c.title}</div>
                <div style={{ fontWeight:500, fontSize:11, color:'#666', marginTop:2 }}>Review details before joining</div>
              </div>
              <div style={{ padding:'16px 20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                  {[['🪙 Entry Fee','₹'+c.entry,'#F5C518'],['🏆 Reward Pool','₹'+c.reward.toLocaleString(),'#FFD700'],['👥 Participants',`${c.cur}/${c.max}`,'#F0F0F0'],['🎯 Win Chance',`${c.win}%`,'#00E676']].map(([l,v,col])=>(
                    <div key={l} style={{ background:'#0d0d12', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:10 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#444', textTransform:'uppercase', letterSpacing:.6, marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:15, color:col }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:10, textAlign:'center', fontSize:11, color:'#666', lineHeight:1.6, marginBottom:12 }}>
                  Are you sure you want to join?<br/><strong style={{ color:'#F0F0F0' }}>₹{c.entry}</strong> will be deducted from your wallet.
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setModal(false)} style={{ flex:1, padding:11, borderRadius:9, fontFamily:'inherit', fontWeight:600, fontSize:13, background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'#666', cursor:'pointer' }}>Cancel</button>
                  <button onClick={() => { setModal(false); showToast(`Joined "${c.title}"!`,`₹${c.entry} deducted`) }} style={{ flex:1, padding:11, borderRadius:9, fontFamily:'inherit', fontWeight:800, fontSize:13, background:'#F5C518', color:'#0a0a0a', border:'none', cursor:'pointer' }}>Join Now</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <div style={{ position:'fixed', bottom:20, left:'50%', transform:`translateX(-50%) translateY(${toast.show?0:60}px)`, opacity:toast.show?1:0, background:'#1a1a22', border:'1px solid rgba(0,230,118,0.3)', borderRadius:11, padding:'12px 20px', display:'flex', alignItems:'center', gap:9, fontSize:13, boxShadow:'0 8px 28px rgba(0,0,0,0.5)', zIndex:600, whiteSpace:'nowrap', transition:'all .4s cubic-bezier(.4,0,.2,1)', pointerEvents:'none' }}>
          <span style={{ fontSize:16 }}>✅</span>
          <div><div style={{ color:'#00E676', fontWeight:700, display:'block' }}>{toast.title}</div><span style={{ color:'#666', fontSize:11 }}>{toast.sub}</span></div>
        </div>
      </div>
    )
  }

  // ---- LIST VIEW ----
  return (
    <div style={pageStyle}>
      <Header active="Challenges" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.8)}}
        @keyframes flash{0%,100%{opacity:1}50%{opacity:.4}}
        .ch-card-li:hover{transform:translateY(-4px) scale(1.015)!important;box-shadow:0 8px 40px rgba(245,197,24,.14)!important;border-color:rgba(245,197,24,.2)!important;}
        .btn-join-li:hover:not(:disabled){box-shadow:0 0 18px rgba(245,197,24,.45);transform:scale(1.03);}
      `}</style>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'28px 24px' }}>

        {/* Page Title */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <span style={{ fontSize:22, fontWeight:800 }}>Challenges</span>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(245,197,24,.08)', border:'1px solid rgba(245,197,24,.25)', borderRadius:999, padding:'4px 12px', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:11, color:'#F5C518' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#F5C518', display:'inline-block' }}></span>
              {CHALLENGES.filter(c=>c.status==='live').length} Live Now
            </div>
          </div>
          <div style={{ fontSize:13, color:'#555' }}>Pick a challenge, make your prediction, win big.</div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, gap:12 }}>
          <div style={{ display:'flex', gap:3, background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:4 }}>
            {(['live','upcoming','completed'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:'8px 18px', borderRadius:8, fontFamily:'inherit', fontWeight:600, fontSize:13, color: activeTab===tab?'#F5C518':'#666', background: activeTab===tab?'#16161f':'transparent', border: activeTab===tab?'1px solid rgba(245,197,24,0.25)':'1px solid transparent', cursor:'pointer', transition:'all .2s' }}>
                {tab==='live'?'🔴 Live':tab==='upcoming'?'🟡 Upcoming':'✅ Completed'}
              </button>
            ))}
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'#666' }}><b style={{ color:'#F0F0F0' }}>{list.length}</b> challenges</div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {list.map((c,i) => {
            const pct=Math.min((c.cur/c.max)*100,100),full=c.cur>=c.max
            const live=c.status==='live',up=c.status==='upcoming',done=c.status==='completed'
            const warn=pct>=80&&!full

            return (
              <div key={c.id} className="ch-card-li" onClick={() => !done&&!full&&!up&&setDetailId(c.id)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden', cursor: done||full||up?'default':'pointer', transition:'all .25s', animationDelay:`${i*.07}s`, animation:'fadeUp .4s ease both', position:'relative' }}>
                <div style={{ height:110, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'radial-gradient(ellipse at 60% 30%,#1a2040 0%,#0a0b12 75%)' }}>
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 60%,rgba(245,197,24,.09),transparent 65%)' }}></div>
                  <div style={{ fontSize:52, filter:'drop-shadow(0 0 14px rgba(245,197,24,.3))', position:'relative', zIndex:1 }}>{c.emoji}</div>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:48, background:'linear-gradient(to top,#111118,transparent)' }}></div>
                  <div style={{ position:'absolute', top:9, left:9, display:'flex', gap:5 }}>
                    {c.badge==='hot'&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:'rgba(255,69,69,.18)', color:'#FF4545', border:'1px solid rgba(255,69,69,.3)' }}>🔥 HOT</span>}
                    {c.badge==='reward'&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:'rgba(245,197,24,.18)', color:'#F5C518', border:'1px solid rgba(245,197,24,.3)' }}>💎 HIGH REWARD</span>}
                    {c.badge==='trend'&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:'rgba(74,158,255,.18)', color:'#4A9EFF', border:'1px solid rgba(74,158,255,.3)' }}>⚡ TRENDING</span>}
                    {full&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:'rgba(100,100,100,.2)', color:'#666', border:'1px solid rgba(100,100,100,.25)' }}>FULL</span>}
                  </div>
                  {live&&<div style={{ position:'absolute', top:9, right:9, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,.6)', border:'1px solid rgba(255,69,69,.3)', borderRadius:999, padding:'3px 9px' }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:'#FF4545', display:'inline-block', animation:'pulse 1.5s ease-in-out infinite' }}></span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:9, color:'#FF4545', letterSpacing:.5 }}>LIVE</span>
                  </div>}
                </div>
                <div style={{ padding:'13px 14px', display:'flex', flexDirection:'column', gap:9 }}>
                  <div style={{ fontWeight:700, fontSize:13.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, minWidth:0 }}>
                      <div style={{ width:28, height:28, borderRadius:7, background:'rgba(255,69,69,.15)', color:'#FF4545', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:10, flexShrink:0 }}>{c.teamA.code}</div>
                      <span style={{ fontWeight:600, fontSize:11, color:'#666', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.teamA.name}</span>
                    </div>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:10, color:'#444', background:'rgba(255,255,255,.05)', padding:'3px 6px', borderRadius:5, flexShrink:0 }}>VS</span>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6, flex:1, minWidth:0 }}>
                      <span style={{ fontWeight:600, fontSize:11, color:'#666', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', textAlign:'right' }}>{c.teamB.name}</span>
                      <div style={{ width:28, height:28, borderRadius:7, background:'rgba(74,158,255,.15)', color:'#4A9EFF', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:10, flexShrink:0 }}>{c.teamB.code}</div>
                    </div>
                  </div>
                  {live&&<div>
                    <div style={{ height:4, background:'rgba(255,255,255,.07)', borderRadius:999, overflow:'hidden', position:'relative', marginBottom:4 }}>
                      <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${c.teamA.prob}%`, background:'linear-gradient(90deg,#FF4545,#FF8C00)', borderRadius:999 }}></div>
                      <div style={{ position:'absolute', right:0, top:0, height:'100%', width:`${c.teamB.prob}%`, background:'linear-gradient(270deg,#4A9EFF,#00BFFF)', borderRadius:999 }}></div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:10 }}>
                      <span style={{ color:'#FF4545' }}>{c.teamA.prob}%</span><span style={{ color:'#4A9EFF' }}>{c.teamB.prob}%</span>
                    </div>
                  </div>}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                    <div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#444', textTransform:'uppercase', letterSpacing:.7, marginBottom:2 }}>Entry</div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:12, color:'#F5C518' }}>₹{c.entry}</div></div>
                    <div style={{ textAlign:'right' }}><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#444', textTransform:'uppercase', letterSpacing:.7, marginBottom:2 }}>Reward Pool</div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:18, background:'linear-gradient(135deg,#F5C518,#FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>₹{c.reward.toLocaleString()}</div></div>
                  </div>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'JetBrains Mono',monospace", fontSize:10, marginBottom:4 }}>
                      <span style={{ color:'#666' }}><b style={{ color:'#F0F0F0' }}>{c.cur}</b>/{c.max} Joined</span>
                      {warn&&!full&&<span style={{ color:'#FF4545', animation:'flash 1.2s ease-in-out infinite' }}>Limited!</span>}
                    </div>
                    <div style={{ height:3, background:'rgba(255,255,255,.06)', borderRadius:999, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, borderRadius:999, background: full?'rgba(100,100,100,.4)':warn?'linear-gradient(90deg,#F5C518,#FF4545)':'linear-gradient(90deg,#F5C518,#FFD700)' }}></div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontWeight:500, fontSize:10, color:'#666' }}>
                    ⏱ {done?'Ended':up?'Starts in':'Ends in'} {!done&&<span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:600, fontSize:11, color:up?'#F5C518':'#FF4545' }}>{timers[c.id]||'--:--:--'}</span>}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'rgba(255,255,255,.03)', borderTop:'1px solid rgba(255,255,255,.07)' }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666' }}>👥 {c.cur.toLocaleString()} joined</span>
                  <button className="btn-join-li" disabled={done||full||up} onClick={e => { e.stopPropagation(); !done&&!full&&!up&&setDetailId(c.id) }} style={{ padding:'7px 18px', borderRadius:7, fontFamily:'inherit', fontWeight:700, fontSize:12, background: done||full||up?'rgba(255,255,255,.08)':'#F5C518', color: done||full||up?'#666':'#0a0a0a', border:'none', cursor: done||full||up?'not-allowed':'pointer', transition:'all .2s' }}>
                    {done?'Results':full?'Full':up?'Soon':'Join Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
