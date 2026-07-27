export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0', fontSize: 13, color: 'var(--text-dim)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)' }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--green), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          Verdikt
        </div>
        <div>© 2026 Verdikt. Tous droits réservés.</div>
      </div>
    </footer>
  )
}
