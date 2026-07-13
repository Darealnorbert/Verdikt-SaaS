import { useState } from 'react'

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="tarifs" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>Tarifs simples, sans surprise</h2>
          <p style={{ color: 'var(--text-dim)', marginTop: 12, fontSize: 15 }}>Commence gratuitement, passe à l'échelle quand tu en as besoin.</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: 13.5, color: annual ? 'var(--text-dim)' : 'var(--text)', fontWeight: annual ? 400 : 600 }}>Mensuel</span>
          <div
            onClick={() => setAnnual(!annual)}
            style={{
              width: 44, height: 24, borderRadius: 100,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              position: 'relative', cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%',
              background: 'var(--violet)', transition: 'transform .2s ease',
              transform: annual ? 'translateX(20px)' : 'translateX(0)',
            }} />
          </div>
          <span style={{ fontSize: 13.5, color: annual ? 'var(--text)' : 'var(--text-dim)', fontWeight: annual ? 600 : 400 }}>Annuel</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, background: 'rgba(62,213,152,.15)', color: 'var(--green)', padding: '2px 8px', borderRadius: 100 }}>-20%</span>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="pricing-grid">
          {/* Card 1 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 10 }}>Découverte</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 36, fontWeight: 700, marginBottom: 4 }}>0 <span style={{ fontSize: 16, fontFamily: "'Inter'" }}>FCFA</span> <span style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: "'Inter'", fontWeight: 400 }}>/ mois</span></div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 22 }}>Pour tester une première idée</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26, flexGrow: 1 }}>
              {['1 analyse / mois', 'Score de viabilité', 'Scan concurrentiel basique'].map(feat => (
                <li key={feat} style={{ fontSize: 13.5, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(62,213,152,.15)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', textAlign: 'center', padding: 11, borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Commencer gratuitement
            </div>
          </div>

          {/* Card 2 - Featured */}
          <div style={{ border: '1px solid var(--violet)', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', position: 'relative', background: 'linear-gradient(180deg, rgba(124,108,246,.08), var(--surface) 40%)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--violet)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, fontFamily: "'JetBrains Mono'" }}>Le plus choisi</div>
            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 10 }}>Fondateur</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 36, fontWeight: 700, marginBottom: 4 }}>{annual ? '4000' : '5000'} <span style={{ fontSize: 16, fontFamily: "'Inter'" }}>FCFA</span> <span style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: "'Inter'", fontWeight: 400 }}>/ mois</span></div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 22 }}>Pour valider plusieurs pistes sérieusement</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26, flexGrow: 1 }}>
              {['Analyses illimitées', 'Rapport PDF exportable', 'Alertes de signaux d\'alerte', 'Historique des idées'].map(feat => (
                <li key={feat} style={{ fontSize: 13.5, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(62,213,152,.15)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            <div style={{ background: 'var(--violet)', border: '1px solid var(--violet)', color: '#fff', textAlign: 'center', padding: 11, borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Démarrer l'essai
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 10 }}>Studio</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 36, fontWeight: 700, marginBottom: 4 }}>{annual ? '6500' : '8000'} <span style={{ fontSize: 16, fontFamily: "'Inter'" }}>FCFA</span> <span style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: "'Inter'", fontWeight: 400 }}>/ mois</span></div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 22 }}>Pour les équipes et incubateurs</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26, flexGrow: 1 }}>
              {['Tout Fondateur, +', '5 sièges d\'équipe', 'Comparateur multi-idées', 'Accès API'].map(feat => (
                <li key={feat} style={{ fontSize: 13.5, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(62,213,152,.15)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', textAlign: 'center', padding: 11, borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Contacter l'équipe
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
