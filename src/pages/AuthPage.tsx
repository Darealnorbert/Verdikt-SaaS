import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type Mode = 'sign_in' | 'sign_up' | 'forgot_password'

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('sign_in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/dashboard')
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
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setMode('sign_in')
          setError('Ce compte existe déjà. Veuillez vous connecter.')
        } else {
          setError(error.message)
        }
      }
      else setMessage('Compte créé ! Tu peux maintenant te connecter.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', alignItems: 'center',
      justifyContent: 'center', background: 'var(--ink)', padding: 24
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: 'var(--surface)',
        padding: 40, borderRadius: 20, border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,.4)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 32, justifyContent: 'center' }}>
          <span style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--green), var(--violet))',
            display: 'inline-block', flexShrink: 0
          }} />
          Verdikt
        </div>

        {/* Tabs */}
        {mode !== 'forgot_password' ? (
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--surface-2)', borderRadius: 10, padding: 4 }}>
            {(['sign_in', 'sign_up'] as Mode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); setMessage(null) }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 14, fontFamily: "'Inter'",
                  background: mode === m ? 'var(--surface)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--text-dim)',
                  transition: 'all .2s',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,.3)' : 'none'
                }}
              >
                {m === 'sign_in' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>Mot de passe oublié</h2>
            <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', marginBottom: 6, fontWeight: 500 }}>
              Adresse e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 15, fontFamily: "'Inter'",
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', fontWeight: 500 }}>
                  Mot de passe
                </label>
                {mode === 'sign_in' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); setError(null); setMessage(null) }}
                    style={{ background: 'none', border: 'none', color: 'var(--violet)', fontSize: 12, cursor: 'pointer', padding: 0 }}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 15, fontFamily: "'Inter'",
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Error/Success messages */}
          {error && (
            <div style={{ background: 'rgba(255,92,106,.12)', border: '1px solid rgba(255,92,106,.3)', color: 'var(--red)', padding: '10px 14px', borderRadius: 10, fontSize: 14 }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ background: 'rgba(62,213,152,.12)', border: '1px solid rgba(62,213,152,.3)', color: 'var(--green)', padding: '10px 14px', borderRadius: 10, fontSize: 14 }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
              background: loading ? 'var(--surface-2)' : 'var(--violet)',
              color: loading ? 'var(--text-dim)' : '#fff',
              fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk'",
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all .2s', marginTop: 4
            }}
          >
            {loading ? 'Chargement...' : mode === 'sign_in' ? 'Se connecter' : mode === 'sign_up' ? 'Créer mon compte' : 'Envoyer le lien'}
          </button>

          {mode === 'forgot_password' && (
            <button
              type="button"
              onClick={() => { setMode('sign_in'); setError(null); setMessage(null) }}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer', marginTop: 8 }}
            >
              Retour à la connexion
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
