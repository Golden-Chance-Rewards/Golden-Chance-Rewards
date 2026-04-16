import Header from '../../components/nav/Header'

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#05070a', color: '#fff', fontFamily: "'Syne',system-ui,sans-serif" }}>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 84px)', display: 'grid', placeItems: 'center', padding: '3rem' }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '3rem', background: 'rgba(10, 10, 14, 0.95)' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.04em' }}>Sign Up</h1>
          <p style={{ color: '#a3a3a3', margin: '1rem 0 2rem' }}>
            Create a GoldenChance account and start competing today.
          </p>
          <div style={{ color: '#ffcb47', fontWeight: 700 }}>Coming soon</div>
        </div>
      </main>
    </div>
  )
}
