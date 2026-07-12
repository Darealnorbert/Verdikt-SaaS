const messages = [
  { type: 'user', text: "Une app qui automatise la relance de factures pour les freelances" },
  {
    type: 'ai',
    tag: 'VERDIKT · SCORE 74/100',
    text: "Marché existant mais fragmenté — 6 concurrents identifiés, aucun dominant en Afrique francophone. Angle recommandé : facturation + relance en langue locale.",
  },
  { type: 'user', text: "Et le pricing ?" },
  {
    type: 'ai',
    tag: 'SUGGESTION',
    text: "Modèle freemium à 3 factures/mois, palier payant dès 8€. Marge saine si tu automatises les relances via un modèle léger.",
  },
]

const checkItems = [
  'Analyse concurrentielle en langage clair',
  'Score de viabilité justifié point par point',
  'Recommandations actionnables, pas génériques',
]

export default function TerminalSection() {
  return (
    <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 56, alignItems: 'center' }} className="terminal-grid">

        {/* Copy */}
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Comme discuter avec un associé honnête</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 24, maxWidth: 420 }}>
            Pas de jargon, pas de flatterie. Verdikt te dit ce qu'un cofondateur expérimenté te dirait — y compris quand ça ne fait pas plaisir à entendre.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {checkItems.map(item => (
              <li key={item} style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(62,213,152,.15)',
                  color: 'var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, flexShrink: 0,
                }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal mockup */}
        <div style={{
          background: 'var(--ink)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)',
        }}>
          {/* Bar */}
          <div style={{ display: 'flex', gap: 6, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border)', display: 'inline-block' }} />)}
          </div>

          {/* Chat bubbles */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '82%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  ...(msg.type === 'user'
                    ? { background: 'var(--violet)', color: '#fff', borderBottomRightRadius: 3 }
                    : { background: 'var(--surface-2)', border: '1px solid var(--border)', borderBottomLeftRadius: 3 }),
                }}
              >
                {msg.type === 'ai' && msg.tag && (
                  <span style={{ display: 'block', fontFamily: "'JetBrains Mono'", fontSize: 10.5, color: 'var(--green)', marginBottom: 6, letterSpacing: '.06em' }}>
                    {msg.tag}
                  </span>
                )}
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .terminal-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
