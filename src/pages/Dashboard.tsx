import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

import { AnalysisManagementTable, type Analysis } from '@/components/ui/analysis-management-table'

export default function Dashboard() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [profile, setProfile] = useState<{ plan: string, analyses_used: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, analyses_used')
        .eq('id', session.user.id)
        .single()
        
      if (profileData) {
        setProfile(profileData)
      }

      setLoading(false)
    }

    fetchAnalyses()
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  async function handleUpgrade() {
    setUpgrading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fedapay-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Erreur de paiement: " + (data.error || 'Inconnue'))
      }
    } catch (error) {
      alert("Erreur lors de la redirection")
    }
    setUpgrading(false)
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          Verdikt
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 8, color: 'var(--text-dim)', fontSize: 14, cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1120, margin: '48px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Mes analyses</h1>
          {profile?.plan === 'founder' ? (
            <span style={{ background: 'rgba(62,213,152,.15)', color: 'var(--green)', padding: '8px 16px', borderRadius: 100, fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>
              👑 Plan Founder
            </span>
          ) : (
            <button 
              onClick={handleUpgrade}
              disabled={upgrading}
              style={{ background: 'var(--violet)', border: 'none', padding: '10px 20px', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 600, cursor: upgrading ? 'not-allowed' : 'pointer' }}
            >
              {upgrading ? 'Redirection...' : 'Passer Premium 🚀 (5000 FCFA)'}
            </button>
          )}
        </div>
        
        <AnalysisManagementTable 
          analyses={analyses} 
          onExportPdf={exportPdf} 
        />
      </div>
    </div>
  )
}
