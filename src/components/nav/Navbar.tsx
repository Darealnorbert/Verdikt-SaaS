import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const navigate = useNavigate()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(14,16,19,0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
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

        {/* Nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, color: 'var(--text-dim)' }}>
          {[
            { label: 'Fonctionnalités', href: '#fonctionnalites' },
            { label: 'Comment ça marche', href: '#comment' },
            { label: 'Tarifs', href: '#tarifs' },
            { label: 'FAQ', href: '#faq' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{ color: 'var(--text-dim)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => session ? navigate('/dashboard') : window.dispatchEvent(new Event('open-auth-modal'))}
          style={{
            background: 'var(--text)',
            color: 'var(--ink)',
            fontWeight: 600,
            fontSize: 14,
            padding: '10px 18px',
            borderRadius: 9,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {session ? 'Mon Dashboard' : "S'inscrire / Se connecter"}
        </button>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .nav-links-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
