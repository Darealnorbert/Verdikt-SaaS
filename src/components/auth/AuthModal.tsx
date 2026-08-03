import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type Mode = 'sign_in' | 'sign_up' | 'forgot_password'

export default function AuthModal() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    window.addEventListener('open-auth-modal', handleOpen)
    window.addEventListener('close-auth-modal', handleClose)
    return () => {
      window.removeEventListener('open-auth-modal', handleOpen)
      window.removeEventListener('close-auth-modal', handleClose)
    }
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsOpen(false)
        if (localStorage.getItem('pendingIdea')) {
          navigate('/')
        } else {
          navigate('/dashboard')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'forgot_password') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) setError(error.message)
      else setMessage('Un e-mail de réinitialisation vous a été envoyé.')
    } else if (mode === 'sign_up') {
      // Password Validation
      const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if (!pwdRegex.test(password)) {
        setError('Le mot de passe doit faire 8 caractères minimum et inclure une lettre, un chiffre et un caractère spécial.')
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setMode('sign_in')
          setError('Ce compte existe déjà. Veuillez vous connecter.')
        } else {
          setError(error.message)
        }
      } else {
        setMessage('Un lien de vérification vous a été envoyé par email. Veuillez vérifier votre boîte de réception (et vos spams) pour activer votre compte.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10, 17, 40, 0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 24, animation: 'fadeIn 0.2s ease-out'
    }} onClick={() => setIsOpen(false)}>
      <div 
        style={{
          width: '100%', maxWidth: 400, background: 'var(--surface)',
          padding: 40, borderRadius: 20, border: '1px solid var(--border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsOpen(false)}
          style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 24 }}
        >
          &times;
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--green), var(--violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text)' }}>
            {mode === 'sign_in' ? 'Bon retour' : mode === 'sign_up' ? 'Créer un compte' : 'Mot de passe oublié'}
          </h1>
          <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: 14 }}>
            {mode === 'sign_in' ? 'Prêt à analyser de nouvelles idées ?' : mode === 'sign_up' ? 'Rejoins les SaaS Builders africains.' : 'Pas de panique, ça arrive.'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,92,106,.15)', color: 'var(--red)', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 24, border: '1px solid rgba(255,92,106,.3)' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ background: 'rgba(62,213,152,.15)', color: 'var(--green)', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 24, border: '1px solid rgba(62,213,152,.3)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-dim)', marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                padding: '12px 16px', borderRadius: 8, color: 'var(--text)', fontSize: 15,
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--violet)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-dim)', marginBottom: 8 }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                  padding: '12px 16px', borderRadius: 8, color: 'var(--text)', fontSize: 15,
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--violet)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: 'var(--text)', color: 'var(--ink)',
              padding: 14, borderRadius: 8, fontSize: 15, fontWeight: 600,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8
            }}
          >
            {loading ? 'Chargement...' : mode === 'sign_in' ? 'Se connecter' : mode === 'sign_up' ? "S'inscrire" : 'Envoyer le lien'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'sign_in' ? (
            <>
              <button type="button" onClick={() => setMode('sign_up')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                Pas encore de compte ? S'inscrire
              </button>
              <button type="button" onClick={() => setMode('forgot_password')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer' }}>
                Mot de passe oublié ?
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setMode('sign_in')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              Déjà un compte ? Se connecter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
