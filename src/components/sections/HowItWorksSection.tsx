const steps = [
  { num: '1', title: 'Décris ton idée', desc: "En deux ou trois phrases, comme tu l'expliquerais à un ami." },
  { num: '2', title: 'Verdikt scanne le marché', desc: "Concurrence, demande, tendances — analysés en temps réel." },
  { num: '3', title: 'Calcul du score', desc: "Un score de viabilité sur 100, basé sur des critères objectifs." },
  { num: '4', title: 'Reçois ton verdict', desc: "Construire, pivoter ou abandonner — avec les raisons détaillées." },
]

export default function HowItWorksSection() {
  return (
    <section id="comment" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>Comment ça marche</h2>
          <p style={{ color: 'var(--text-dim)', marginTop: 12, fontSize: 15 }}>Quatre étapes, aucune expertise business requise.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="steps-grid">
          {steps.map(step => (
            <div key={step.num} style={{ paddingTop: 8 }}>
              <div style={{
                fontFamily: "'Space Grotesk'",
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--violet)',
                border: '1px solid var(--border)',
                width: 48,
                height: 48,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
                background: 'var(--surface)',
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-dim)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .steps-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
