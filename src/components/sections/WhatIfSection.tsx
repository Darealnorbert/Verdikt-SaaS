const items = [
  { num: '01', title: 'Que ton marché existe vraiment', desc: "Verdikt estime la taille réelle de la demande, pas des chiffres gonflés de business plan." },
  { num: '02', title: 'Qui te fait déjà concurrence', desc: "Détection automatique des acteurs existants, leur positionnement et leurs failles." },
  { num: '03', title: 'Où se cachent les signaux d\'alerte', desc: "Marge trop faible, marché saturé, acquisition trop chère : Verdikt les repère avant toi." },
  { num: '04', title: 'Quoi faire ensuite, concrètement', desc: "Un plan d'action clair selon le verdict : lancer, ajuster le positionnement, ou changer d'idée." },
]

export default function WhatIfSection() {
  return (
    <section id="fonctionnalites" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        {/* Head */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>
            Et si tu savais, avant de coder une seule ligne...
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
          className="whatif-grid"
        >
          {items.map(item => (
            <div key={item.num} style={{ background: 'var(--surface)', padding: '30px 24px' }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: 'var(--violet)', marginBottom: 14, display: 'block' }}>
                {item.num}
              </span>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-dim)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: 36, color: 'var(--text-dim)', fontSize: 15 }}>
          ...au lieu de le découvrir 6 mois et plusieurs milliers d'euros plus tard ?
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) { .whatif-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  )
}
