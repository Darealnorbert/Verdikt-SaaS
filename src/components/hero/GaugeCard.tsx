import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type Verdict = 'build' | 'pivot' | 'kill' | null

const VERDICT_MAP = {
  build: { label: 'À construire', className: 'verdict-build', note: 'Marché viable, angle différenciant identifié.' },
  pivot: { label: 'À pivoter', className: 'verdict-pivot', note: 'Le concept tient, l\'angle doit être ajusté.' },
  kill: { label: 'À abandonner', className: 'verdict-kill', note: 'Marché trop saturé ou demande insuffisante.' },
}

export default function GaugeCard() {
  const navigate = useNavigate()
  const [idea, setIdea] = useState('')
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [report, setReport] = useState<any>(null)
  const [note, setNote] = useState("Clique sur « Lancer l'analyse » pour voir Verdikt en action")
  const [btnLabel, setBtnLabel] = useState("Lancer l'analyse")
  const needleRef = useRef<SVGGElement>(null)
  const arcRef = useRef<SVGPathElement>(null)
  const displayRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function runAnalysis() {
    if (running) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/auth')
      return
    }

    setRunning(true)
    setBtnLabel('Analyse en cours...')
    setScore(null)
    setVerdict(null)
    setReport(null)
    setNote("Appel à l'IA Verdikt...")

    if (needleRef.current) needleRef.current.style.transform = 'rotate(-90deg)'
    if (arcRef.current) arcRef.current.style.strokeDashoffset = '283'

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ idea_text: idea })
      })

      const data = await response.json()
      console.log('[Verdikt] API response:', data)

      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)
      
      const s = data.score
      const v = data.verdict as Verdict

      const angle = -90 + (s / 100) * 180
      if (needleRef.current) needleRef.current.style.transform = `rotate(${angle}deg)`
      if (arcRef.current) arcRef.current.style.strokeDashoffset = String(283 - (283 * s / 100))

      displayRef.current = 0
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        displayRef.current += 2
        if (displayRef.current >= s) {
          displayRef.current = s
          clearInterval(intervalRef.current!)
        }
        setScore(displayRef.current)
      }, 20)

      setVerdict(v)
      setReport(data.report)
      setNote(VERDICT_MAP[v!].note)
    } catch (err: any) {
      console.error('[Verdikt] Error:', err)
      setNote(`Erreur : ${err.message}`)
    } finally {
      setRunning(false)
      setBtnLabel("Relancer l'analyse")
    }
  }

  const arcColor = verdict === 'build' ? 'var(--green)' : verdict === 'pivot' ? 'var(--amber)' : verdict === 'kill' ? 'var(--red)' : 'var(--violet)'

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: 28,
      position: 'relative',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)', display: 'inline-block' }} />)}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: 'var(--text-dim)' }}>verdikt.ai/scan</span>
      </div>

      {/* Label */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        Décris ton idée de SaaS
      </div>

      {/* Textarea */}
      <textarea
        value={idea}
        onChange={e => setIdea(e.target.value)}
        placeholder={`Ex : "Une app qui aide les restaurants à gérer leurs réservations et réduire les no-shows grâce à des rappels automatiques par SMS."

Plus tu es précis, plus l'analyse sera pertinente.`}
        style={{
          width: '100%',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          color: 'var(--text)',
          fontFamily: "'Inter'",
          fontSize: 13.5,
          padding: 12,
          resize: 'none',
          height: 90,
          marginBottom: 14,
          outline: 'none',
          lineHeight: 1.6,
        }}
        onFocus={e => (e.target.style.outline = '1px solid var(--violet)')}
        onBlur={e => (e.target.style.outline = 'none')}
      />

      {/* Analyze button */}
      <button
        disabled={running}
        onClick={runAnalysis}
        style={{
          width: '100%',
          background: 'var(--violet)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          border: 'none',
          borderRadius: 9,
          padding: 11,
          cursor: running ? 'progress' : 'pointer',
          marginBottom: 22,
          opacity: running ? 0.6 : 1,
          transition: 'opacity .2s',
        }}
      >
        {btnLabel}
      </button>

      {/* Gauge visual */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <svg width="220" height="130" viewBox="0 0 220 130">
          {/* Track */}
          <path d="M 20 120 A 90 90 0 0 1 200 120" fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
          {/* Fill */}
          <path
            ref={arcRef}
            d="M 20 120 A 90 90 0 0 1 200 120"
            fill="none"
            stroke={arcColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="283"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1), stroke .3s ease' }}
          />
          {/* Needle */}
          <g
            ref={needleRef}
            style={{
              transformOrigin: '110px 120px',
              transform: 'rotate(-90deg)',
              transition: 'transform 1s cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <line x1="110" y1="120" x2="110" y2="45" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="110" cy="120" r="6" fill="var(--text)" />
          </g>
        </svg>

        {/* Score number */}
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 44, fontWeight: 700, marginTop: -8, color: 'var(--text)' }}>
          {score !== null ? score : '--'}
        </div>

        {/* Verdict badge */}
        <div style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: 12,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 100,
          fontWeight: 700,
          ...(verdict === 'build' ? { background: 'rgba(62,213,152,.15)', color: 'var(--green)' }
            : verdict === 'pivot' ? { background: 'rgba(245,184,74,.15)', color: 'var(--amber)' }
            : verdict === 'kill' ? { background: 'rgba(255,92,106,.15)', color: 'var(--red)' }
            : { background: 'var(--surface-2)', color: 'var(--text-dim)' }),
        }}>
          {verdict ? VERDICT_MAP[verdict].label : 'En attente'}
        </div>

        {/* Note */}
        <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginTop: 4 }}>
          {note}
        </div>
      </div>

      {/* Full Report Details */}
      {report && (
        <div style={{ 
          marginTop: 32, 
          paddingTop: 24, 
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Taille du marché</h4>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{report.market_size}</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Concurrents identifiés</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
              {report.competitors?.map((comp: string, i: number) => <li key={i}>{comp}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Risques principaux</h4>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
              {report.risks?.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '.05em' }}>Plan d'action</h4>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{report.action_plan}</p>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: 12,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            Voir dans mon historique →
          </button>
        </div>
      )}
    </div>
  )
}
