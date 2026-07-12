import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type Analysis = {
  id: string
  idea_text: string
  score: number
  verdict: 'build' | 'pivot' | 'kill'
  report: {
    market_size: string
    competitors: string[]
    risks: string[]
    action_plan: string
  }
  pdf_url: string | null
  created_at: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalyses() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/auth')
        return
      }

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAnalyses(data)
      }
      setLoading(false)
    }

    fetchAnalyses()
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  async function exportPdf(analysisId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ analysis_id: analysisId })
      })

      const data = await response.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        alert("Erreur lors de la génération du PDF")
      }
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la génération du PDF")
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>
      <nav style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: 'var(--text)' }} onClick={() => navigate('/')} className="cursor-pointer">
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--green), var(--violet))',
            display: 'inline-block',
          }} />
          Verdikt
        </div>
        <button 
          onClick={handleLogout}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 8, color: 'var(--text-dim)', fontSize: 14, cursor: 'pointer' }}
        >
          Déconnexion
        </button>
      </nav>

      <div style={{ maxWidth: 1120, margin: '48px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Mes analyses</h1>
        
        {analyses.length === 0 ? (
          <div style={{ background: 'var(--surface)', padding: 48, borderRadius: 16, textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>Tu n'as pas encore analysé d'idées.</p>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'var(--violet)', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Lancer ma première analyse
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {analyses.map(analysis => (
              <div key={analysis.id} style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 300 }}>
                    <p style={{ fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>{analysis.idea_text}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
                        {analysis.score}/100
                      </span>
                      <span style={{
                        fontFamily: "'JetBrains Mono'", fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 700, textTransform: 'uppercase',
                        ...(analysis.verdict === 'build' ? { background: 'rgba(62,213,152,.15)', color: 'var(--green)' }
                          : analysis.verdict === 'pivot' ? { background: 'rgba(245,184,74,.15)', color: 'var(--amber)' }
                          : { background: 'rgba(255,92,106,.15)', color: 'var(--red)' })
                      }}>
                        {analysis.verdict === 'build' ? 'À construire' : analysis.verdict === 'pivot' ? 'À pivoter' : 'À abandonner'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginRight: 16, textDecoration: 'underline' }}
                    >
                      {expandedId === analysis.id ? 'Masquer le rapport' : 'Voir le rapport'}
                    </button>
                    <button
                      onClick={() => exportPdf(analysis.id)}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Exporter PDF
                    </button>
                  </div>
                </div>
                
                {/* Expanded Report View */}
                {expandedId === analysis.id && analysis.report && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 24, animation: 'fadeIn 0.3s ease-out' }}>
                    <div>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Taille du marché</h4>
                      <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{analysis.report.market_size}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Concurrents identifiés</h4>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                        {analysis.report.competitors?.map((comp, i) => <li key={i}>{comp}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Risques principaux</h4>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                        {analysis.report.risks?.map((risk, i) => <li key={i}>{risk}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Plan d'action</h4>
                      <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{analysis.report.action_plan}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
