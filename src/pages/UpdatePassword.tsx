import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function UpdatePassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Si l'utilisateur n'a pas de hash dans l'URL et n'est pas connecté
    // (normalement la récupération de mot de passe le connecte automatiquement)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && !window.location.hash) {
        navigate('/auth')
      }
    }
    checkSession()
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Mot de passe mis à jour avec succès !')
      setTimeout(() => navigate('/dashboard'), 2000)
    }
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

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>Nouveau mot de passe</h2>
          <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>Saisissez votre nouveau mot de passe ci-dessous.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', marginBottom: 6, fontWeight: 500 }}>
              Mot de passe
            </label>
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
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
