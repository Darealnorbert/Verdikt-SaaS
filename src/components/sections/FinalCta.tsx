export default function FinalCta() {
  return (
    <section style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          textAlign: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: '64px 32px'
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 14 }}>Prêt à savoir si ton idée tient la route ?</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: 30, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Rejoins les 2 300+ fondateurs qui valident avant de construire.
          </p>
          <button
            style={{
              background: 'var(--green)',
              color: '#04140D',
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 24px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              transition: 'transform .15s ease, box-shadow .3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(62,213,152,.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Analyser mon idée — gratuit
          </button>
        </div>
      </div>
    </section>
  )
}
