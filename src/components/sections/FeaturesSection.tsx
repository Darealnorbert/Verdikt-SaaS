const features = [
  { icon: '◎', title: 'Scan concurrentiel', desc: "Liste des acteurs existants, leur pricing et leurs points faibles." },
  { icon: '▤', title: 'Taille de marché', desc: "Estimation réaliste de la demande, pas de chiffres marketing gonflés." },
  { icon: '⚠', title: 'Signaux de risque', desc: "Marge, acquisition, saturation : les points qui font échouer un SaaS." },
  { icon: '⬈', title: 'Rapport exportable', desc: "Un PDF clair à partager avec un associé ou un investisseur." },
]

export default function FeaturesSection() {
  return (
    <section style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>Ce que Verdikt analyse pour toi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }} className="feat-grid">
          {features.map(feat => (
            <div key={feat.title} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 26,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--violet-soft)',
                color: 'var(--violet)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, marginBottom: 16,
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: 15.5, marginBottom: 8 }}>{feat.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .feat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
