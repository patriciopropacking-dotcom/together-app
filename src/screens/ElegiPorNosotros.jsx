import React, { useState, useRef } from 'react'
import { BackBtn, gradFor } from '../components/UI'

export default function ElegiPorNosotros({ planes, recuerdos, go, onDone, planFotos = {} }) {
  const [estado, setEstado] = useState('listo') // listo | girando | resultado
  const [actual, setActual] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [descartados, setDescartados] = useState([])
  const timerRef = useRef(null)

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
      // Sin animación: fade directo
      setResultado(elegido)
      setEstado('resultado')
      return
    }

    setEstado('girando')
    // Ruleta: cambia rápido y desacelera
    let i = 0
    let delay = 60
    const total = 2200 + Math.random() * 400
    const inicio = Date.now()

    const tick = () => {
      const t = Date.now() - inicio
      const p = pool[Math.floor(Math.random() * pool.length)]
      setActual(p)
      if (t < total) {
        // desacelerar progresivamente
        delay = 60 + (t / total) * 220
        timerRef.current = setTimeout(tick, delay)
      } else {
        setActual(elegido)
        setResultado(elegido)
        if (navigator.vibrate) navigator.vibrate(30)
        setTimeout(() => setEstado('resultado'), 400)
      }
    }
    tick()
  }

  const otraVez = () => {
    if (resultado) setDescartados(d => [...d, resultado.id])
    setResultado(null); setActual(null); setEstado('listo')
    setTimeout(girar, 100)
  }

  // RESULTADO
  if (estado === 'resultado' && resultado) {
    const p = resultado
    const fp = planFotos[p.id]
    return (
      <div className="screen">
        <div style={{ position: 'relative' }}>
          <div className={'photo ' + (fp ? '' : gradFor(p.categoria))}
            style={{ height: 340, display: 'flex', alignItems: 'flex-end', padding: 22,
              ...(fp ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0) 60%), url("${fp}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
            <div style={{ position: 'absolute', top: 56, left: 22 }}><BackBtn onClick={() => go('home')} /></div>
            <div style={{ color: '#fff' }} className="fade">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .9 }}>ESTE ES SU PLAN DE HOY</div>
              <h1 style={{ color: '#fff', marginTop: 8, fontSize: 27, textShadow: '0 2px 14px rgba(0,0,0,.5)' }}>{p.emoji} {p.titulo}</h1>
            </div>
          </div>
        </div>
        <div className="pad">
          <p className="sub fade">{p.descripcion}</p>
          <div className="row wrap mt16 fade" style={{ gap: 8 }}>
            <span className="chip">⏱️ {p.duracion_texto}</span>
            <span className="chip">💸 {p.costo_texto}</span>
            {p.es_local && <span className="chip" style={{ background: 'var(--lav)' }}>📍 Tucumán</span>}
          </div>
          <button className="btn btn-coral mt24" onClick={() => onDone(p)}>Lo hacemos ❤️</button>
          <button className="btn btn-line mt12" onClick={otraVez}>Girar otra vez 🎲</button>
          <button className="btn btn-ghost mt12" onClick={() => go('home')}>Volver</button>
        </div>
      </div>
    )
  }

  // GIRANDO o LISTO
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="pad" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="row" style={{ marginTop: 4 }}><BackBtn onClick={() => go('home')} /></div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {estado === 'listo' && (
            <div className="fade">
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎲</div>
              <h1 style={{ marginBottom: 12 }}>Elegí por nosotros</h1>
              <p className="sub" style={{ marginBottom: 40, maxWidth: 280 }}>Sin pensar demasiado. Tocá y el azar decide su plan de hoy.</p>
              <button className="btn btn-coral pulso-coral" onClick={girar} style={{ maxWidth: 260 }}>Elegir nuestro plan</button>
            </div>
          )}

          {estado === 'girando' && actual && (
            <div style={{ width: '100%' }}>
              <div className="sub" style={{ marginBottom: 20, letterSpacing: '.1em', fontWeight: 700 }}>ELIGIENDO…</div>
              <div className="ruleta-card" key={actual.id}>
                <div style={{ fontSize: 44 }}>{actual.emoji}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, marginTop: 10, color: 'var(--ink)' }}>{actual.titulo}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
