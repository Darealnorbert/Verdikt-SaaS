import * as Accordion from '@radix-ui/react-accordion'

const faqs = [
  {
    q: 'Comment Verdikt calcule le score ?',
    a: 'Le score combine la taille du marché estimée, la densité concurrentielle, la difficulté d\'acquisition et la viabilité de la marge — chaque critère est pondéré et détaillé dans le rapport.'
  },
  {
    q: 'Verdikt remplace-t-il une étude de marché complète ?',
    a: 'Non. Verdikt te donne un premier filtre fiable en quelques secondes pour éviter de perdre du temps sur une idée clairement faible. Pour un lancement engageant beaucoup de capital, une étude approfondie reste recommandée.'
  },
  {
    q: 'Puis-je exporter mes rapports ?',
    a: 'Oui, dès le plan Fondateur tu peux exporter chaque analyse en PDF pour la partager avec un associé ou un investisseur.'
  },
  {
    q: 'Mes idées restent-elles confidentielles ?',
    a: 'Oui. Tes idées ne sont jamais partagées ni utilisées pour entraîner un modèle. Elles restent strictement liées à ton compte.'
  }
]

export default function FaqSection() {
  return (
    <section id="faq" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>Questions fréquentes</h2>
        </div>

        <Accordion.Root type="single" collapsible className="faq-list" style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => (
            <Accordion.Item value={`item-${i}`} key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <Accordion.Header style={{ margin: 0 }}>
                <Accordion.Trigger
                  style={{
                    padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', fontSize: 14.5, fontWeight: 600, width: '100%', background: 'transparent',
                    border: 'none', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit'
                  }}
                  className="group"
                >
                  <span>{faq.q}</span>
                  <span
                    style={{ fontFamily: "'JetBrains Mono'", color: 'var(--text-dim)', transition: 'transform .2s ease' }}
                    className="group-data-[state=open]:rotate-45 group-data-[state=open]:text-[var(--green)]"
                  >
                    +
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                style={{ overflow: 'hidden' }}
                className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
              >
                <p style={{ padding: '0 20px 18px', fontSize: 13.5, color: 'var(--text-dim)' }}>
                  {faq.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      <style>{`
        @keyframes accordion-down {
          from { height: 0 }
          to { height: var(--radix-accordion-content-height) }
        }
        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height) }
          to { height: 0 }
        }
        .animate-accordion-down { animation: accordion-down 0.2s ease-out; }
        .animate-accordion-up { animation: accordion-up 0.2s ease-out; }
      `}</style>
    </section>
  )
}
