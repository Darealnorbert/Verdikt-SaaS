const stats = [
  { num: '60s', label: 'pour obtenir un verdict complet' },
  { num: '2 300+', label: 'idées analysées à ce jour' },
  { num: '1 sur 3', label: 'idées jugées « à pivoter »' },
]

export default function StatsBand() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--violet-soft), transparent)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '96px 0',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, textAlign: 'center' }} className="stats-grid">
        {stats.map(s => (
          <div key={s.num}>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 38, fontWeight: 700, color: 'var(--green)' }}>{s.num}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <style>{`@media (max-width: 700px) { .stats-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}
