import Header from '../../components/nav/Header'

export default function Wallet() {
  return (
    <div style={{ minHeight: '100vh', background: '#070709', color: '#F0F0F0', fontFamily: "'Syne',system-ui,sans-serif" }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ background: '#111118', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Wallet</h1>
          <p style={{ color: '#999', marginTop: 10 }}>Manage your balance, deposits, and withdrawals in one place.</p>
        </div>
      </main>
    </div>
  )
}