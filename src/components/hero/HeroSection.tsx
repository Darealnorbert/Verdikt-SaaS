import GaugeCard from './GaugeCard'

const avatars = [
  { initials: 'JK', bg: '#3ED598', color: '#04140D' },
  { initials: 'MA', bg: '#F5B84A', color: '#04140D' },
  { initials: 'SL', bg: '#7C6CF6', color: '#fff' },
  { initials: 'DB', bg: '#FF5C6A', color: '#fff' },
]

export default function HeroSection() {
  return (
    <header style={{ padding: '88px 0 60px' }}>
      <div style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1.1fr .9fr',
        gap: 56,
        alignItems: 'center',
      }}
        className="hero-grid"
      >
        {/* Left column */}
        <div>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'JetBrains Mono'",
            fontSize: 12,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'var(--violet)',
            background: 'var(--violet-soft)',
            border: '1px solid rgba(124,108,246,.35)',
            padding: '6px 12px',
            borderRadius: 100,
            marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 0 4px var(--violet-soft)', display: 'inline-block' }} />
            Verdict en 60 secondes
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 52, lineHeight: 1.05, fontWeight: 700, marginBottom: 22 }}>
            Sais si ton idée{' '}
            <span style={{ color: 'var(--green)' }}>tient la route</span>
            . Avant d'y passer 6 mois.
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 17, color: 'var(--text-dim)', maxWidth: 480, marginBottom: 32 }}>
            Colle ta description, Verdikt scanne le marché, la concurrence et la demande réelle — et te donne un score clair : construire, pivoter, ou abandonner.
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
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
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Aucune carte bancaire requise</span>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {avatars.map((a, i) => (
                <span
                  key={i}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '2px solid var(--ink)',
                    marginLeft: i === 0 ? 0 : -9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: a.bg, color: a.color,
                  }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              <strong style={{ color: 'var(--text)' }}>4,7 / 5</strong> — utilisé par{' '}
              <strong style={{ color: 'var(--text)' }}>2 300+</strong> fondateurs solo
            </div>
          </div>
        </div>

        {/* Right column: Gauge card */}
        <GaugeCard />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .hero-grid h1 { font-size: 36px !important; }
        }
      `}</style>
    </header>
  )
}
