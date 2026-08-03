import React, { useState, useRef, useEffect } from 'react'
import { BackBtn, gradFor } from '../components/UI'

const FRASES = [
  '❤️ Pensando en ustedes…',
  '✨ Buscando el plan perfecto…',
  '🌙 Revisando sus recuerdos…',
  '💌 Preparando una sorpresa…',
]

const GRAD_CAT = {
  'Romántica': 'linear-gradient(160deg,#E08C6E,#8A4A3A)',
  'Aventura': 'linear-gradient(160deg,#3E6E52,#1A3524)',
  'Naturaleza': 'linear-gradient(160deg,#5E8A4A,#2C4A1A)',
  'Viaje': 'linear-gradient(160deg,#C98A4A,#6E3A1A)',
  'En casa': 'linear-gradient(160deg,#5A4A6E,#2C2636)',
  'default': 'linear-gradient(160deg,#7A5A4A,#3A2A22)',
}
const gradColor = (cat) => GRAD_CAT[cat] || GRAD_CAT.default

export default function ElegiPorNosotros({ planes, recuerdos, go, onDone, planFotos = {} }) {
  const [estado, setEstado] = useState('listo') // listo | girando | revelando | resultado
  const [actual, setActual] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [descartados, setDescartados] = useState([])
  const [frase, setFrase] = useState(FRASES[0])
  const timerRef = useRef(null)
  const fraseRef = useRef(null)

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(fraseRef.current) }, [])

  const disponibles = () => {
    const hechos = new Set(recuerdos.map(r => r.plan_id))
    let pool = planes.filter(p => !hechos.has(p.id) && !descartados.includes(p.id))
    if (!pool.length) pool = planes.filter(p => !descartados.includes(p.id))
    if (!pool.length) pool = planes
    return pool
  }

  const girar = () => {
    const pool = disponibles()
    const elegido = pool[Math.floor(Math.random() * pool.length)]
    if (navigator.vibrate) navigator.vibrate([10, 30, 10])

    if (reducedMotion) {
      setResultado(elegido); setEstado('resultado'); return
    }

    setEstado('girando')

    // Frases emotivas rotando
    let fi = 0
    setFrase(FRASES[0])
    fraseRef.current = setInterval(() => { fi = (fi + 1) % FRASES.length; setFrase(FRASES[fi]) }, 900)

    // Tragamonedas: experiencias pasando, desacelerando
    const total = 2600 + Math.random() * 500
    const inicio = Date.now()

    const tick = () => {
      const t = Date.now() - inicio
      const p = pool[Math.floor(Math.random() * pool.length)]
      setActual(p)
      if (t < total) {
        const delay = 55 + (t / total) * 240
        timerRef.current = setTimeout(tick, delay)
      } else {
        clearInterval(fraseRef.current)
        setActual(elegido)
        setResultado(elegido)
        if (navigator.vibrate) navigator.vibrate(40)
        // Frase personalizada antes de revelar
        setFrase('Creemos que este les va a encantar ❤️')
        setTimeout(() => setEstado('revelando'), 900)
        setTimeout(() => setEstado('resultado'), 1300)
      }
    }
    tick()
  }

  const otraVez = () => {
    if (resultado) setDescartados(d => [...d, resultado.id])
    setResultado(null); setActual(null); setEstado('listo')
    setTimeout(girar, 100)
  }

  // ---------- RESULTADO (cinematográfico) ----------
  if ((estado === 'resultado' || estado === 'revelando') && resultado) {
    const p = resultado
    const fp = planFotos[p.id]
    return (
      <div className="screen" style={{ background: '#141010', position: 'relative', overflow: 'hidden' }}>
        {/* Foto enorme (70% de la pantalla) con zoom lento */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '72%', overflow: 'hidden' }}>
          <div className="reveal-zoom" style={{ position: 'absolute', inset: 0,
            background: fp ? '#000' : gradColor(p.categoria),
            ...(fp ? { backgroundImage: `url("${fp}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #141010 3%, rgba(20,16,16,.35) 40%, transparent 75%)' }} />
          <div style={{ position: 'absolute', top: 56, left: 22 }}><BackBtn onClick={() => go('home')} /></div>
        </div>

        {/* Contenido sobre el degradado */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 28px calc(30px + env(safe-area-inset-bottom,0px))' }}>
          <div className="reveal-texto">
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: 'rgba(240,112,90,.95)', textTransform: 'uppercase' }}>Hoy toca…</div>
            <h1 style={{ color: '#fff', marginTop: 10, fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1.08, textShadow: '0 2px 18px rgba(0,0,0,.6)' }}>{p.titulo}</h1>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14.5, lineHeight: 1.6, marginTop: 14, maxWidth: 320 }}>{p.descripcion}</p>
            <div className="row" style={{ gap: 16, marginTop: 18, color: 'rgba(255,255,255,.85)', fontSize: 13.5, fontWeight: 600 }}>
              <span>⏱️ {p.duracion_texto}</span>
              <span>💸 {p.costo === 0 ? 'Gratuita' : p.costo_texto}</span>
            </div>

            <button className="btn btn-coral mt24" onClick={() => onDone(p)} style={{ borderRadius: 100, height: 54, fontSize: 15.5 }}>Aceptar experiencia ❤️</button>
            <button className="btn mt12" onClick={otraVez} style={{ borderRadius: 100, height: 50, fontSize: 14, background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.15)' }}>🎲 Elegir otra</button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- LISTO ----------
  if (estado === 'listo') {
    return (
      <div className="screen sorpresa-bg" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div className="sorpresa-glow" />
        <div className="sorpresa-particulas">{Array.from({ length: 12 }).map((_, i) => <span key={i} className={'particula p' + i} />)}</div>
        <div style={{ position: 'absolute', top: 'calc(20px + env(safe-area-inset-top,0px))', left: 20, zIndex: 5 }}><BackBtn onClick={() => go('home')} /></div>
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' }}>
          <div className="dado-wrap" style={{ marginBottom: 40 }}>
            <div className="dado-halo" />
            <div className="dado-objeto">🎲</div>
          </div>
          <h1 style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 27 }}>Elegí por nosotros</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', marginTop: 12, marginBottom: 40, maxWidth: 280, lineHeight: 1.5 }}>Sin pensar demasiado. Tocá y dejá que el azar prepare su plan de hoy.</p>
          <button className="btn btn-coral pulso-coral" onClick={girar} style={{ maxWidth: 260, borderRadius: 100, height: 54 }}>Sorprendernos ✨</button>
        </div>
      </div>
    )
  }

  // ---------- GIRANDO (ritual) ----------
  return (
    <div className="screen sorpresa-bg" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div className="sorpresa-glow" />
      <div className="sorpresa-particulas">{Array.from({ length: 14 }).map((_, i) => <span key={i} className={'particula p' + i} />)}</div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 30px' }}>
        {/* Dado girando */}
        <div className="dado-wrap" style={{ marginBottom: 44 }}>
          <div className="dado-halo" />
          <div className="dado-girando">🎲</div>
        </div>

        {/* Experiencias pasando (tragamonedas) */}
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {actual && (
            <div key={actual.id} className="tragamonedas-item">
              <span style={{ fontSize: 26 }}>{actual.emoji}</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, color: '#fff', marginLeft: 10 }}>{actual.titulo}</span>
            </div>
          )}
        </div>

        {/* Frase emotiva */}
        <div key={frase} className="frase-ritual" style={{ marginTop: 30, color: 'rgba(255,255,255,.8)', fontSize: 15, fontWeight: 500, minHeight: 24 }}>
          {frase}
        </div>
      </div>
    </div>
  )
}
