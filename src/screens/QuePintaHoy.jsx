import React, { useState } from 'react'
import { BackBtn, gradFor } from '../components/UI'
import { TIEMPO_OPCIONES, PRESUPUESTO_OPCIONES, LUGAR_OPCIONES, MOOD_OPCIONES, MOVILIDAD_OPCIONES, LABEL } from '../data/opciones'
import { recomendar, explicar } from '../data/motor'

export default function QuePintaHoy({ planes, recuerdos, go, onDone, planFotos = {} }) {
  const [filtros, setFiltros] = useState({ tiempo: null, presupuesto: null, lugar: null, mood: null, movilidad: null })
  const [resultado, setResultado] = useState(null)   // { plan, exacto }
  const [descartados, setDescartados] = useState([])

  const set = (campo, valor) => setFiltros(f => ({ ...f, [campo]: f[campo] === valor ? null : valor }))
  const limpiar = () => setFiltros({ tiempo: null, presupuesto: null, lugar: null, mood: null, movilidad: null })

  // Obligatorios: al menos tiempo y mood
  const completo = filtros.tiempo && filtros.mood

  const buscar = (nuevoDescarte = descartados) => {
    const r = recomendar(planes, filtros, nuevoDescarte, recuerdos)
    setResultado(r)
  }

  const otraOpcion = () => {
    if (resultado?.plan) {
      const nuevo = [...descartados, resultado.plan.id]
      setDescartados(nuevo)
      buscar(nuevo)
    }
  }

  // --- PANTALLA DE FILTROS ---
  const Grupo = ({ titulo, opciones, campo }) => (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{titulo}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {opciones.map(o => {
          const activo = filtros[campo] === o.valor
          return (
            <button key={o.valor} onClick={() => { set(campo, o.valor); if (navigator.vibrate) navigator.vibrate(8) }}
              className="chip-sel" style={{
                background: activo ? 'var(--coral)' : 'var(--cream-2)',
                color: activo ? '#fff' : 'var(--ink)',
                border: activo ? '1px solid var(--coral)' : '1px solid var(--line)',
                transform: activo ? 'scale(1.03)' : 'scale(1)',
              }}>
              <span>{o.icon}</span> {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (resultado) {
    const p = resultado.plan
    const fp = planFotos[p?.id]
    return (
      <div className="screen">
        <div style={{ position: 'relative' }}>
          <div className={'photo ' + (fp ? '' : gradFor(p.categoria))}
            style={{ height: 340, display: 'flex', alignItems: 'flex-end', padding: 22,
              ...(fp ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0) 60%), url("${fp}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
            <div style={{ position: 'absolute', top: 56, left: 22 }}><BackBtn onClick={() => setResultado(null)} /></div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .9 }}>HOY LES RECOMENDAMOS</div>
              <h1 style={{ color: '#fff', marginTop: 8, fontSize: 27, textShadow: '0 2px 14px rgba(0,0,0,.5)' }}>{p.emoji} {p.titulo}</h1>
            </div>
          </div>
        </div>

        <div className="pad">
          {!resultado.exacto && (
            <div className="card fade" style={{ padding: 14, marginBottom: 16, background: 'var(--peach)' }}>
              <div className="sub" style={{ fontSize: 13.5 }}>No encontramos una coincidencia exacta, pero creemos que esta les puede gustar.</div>
            </div>
          )}

          <p className="sub fade">{p.descripcion}</p>

          <div className="card fade mt16" style={{ padding: 16 }}>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-2)', fontStyle: 'italic' }}>
              {explicar(filtros, LABEL)}
            </div>
          </div>

          <div className="row wrap mt16" style={{ gap: 8 }}>
            <span className="chip">⏱️ {p.duracion_texto}</span>
            <span className="chip">💸 {p.costo_texto}</span>
            {p.es_local && <span className="chip" style={{ background: 'var(--lav)' }}>📍 Tucumán</span>}
          </div>

          <button className="btn btn-coral mt24" onClick={() => onDone(p)}>Lo hacemos ❤️</button>
          <button className="btn btn-line mt12" onClick={otraOpcion}>Ver otra opción</button>
          <button className="btn btn-ghost mt12" onClick={() => setResultado(null)}>Cambiar preferencias</button>
        </div>
      </div>
    )
  }

  // --- FILTROS ---
  return (
    <div className="screen">
      <div className="pad">
        <div className="row between" style={{ marginTop: 4, marginBottom: 20 }}>
          <BackBtn onClick={() => go('home')} />
          <h3>¿Qué pinta hoy?</h3>
          <button onClick={limpiar} className="sub" style={{ fontSize: 13, fontWeight: 700 }}>Limpiar</button>
        </div>

        <p className="sub" style={{ marginBottom: 26 }}>Contanos qué ganas tienen y elegimos algo para ustedes.</p>

        <Grupo titulo="⏱️ ¿Cuánto tiempo tienen?" opciones={TIEMPO_OPCIONES} campo="tiempo" />
        <Grupo titulo="💸 ¿Qué presupuesto?" opciones={PRESUPUESTO_OPCIONES} campo="presupuesto" />
        <Grupo titulo="📍 ¿Dónde?" opciones={LUGAR_OPCIONES} campo="lugar" />
        <Grupo titulo="💭 ¿Qué onda buscan?" opciones={MOOD_OPCIONES} campo="mood" />
        <Grupo titulo="🚗 ¿Cómo se mueven?" opciones={MOVILIDAD_OPCIONES} campo="movilidad" />

        <div style={{ height: 90 }} />
      </div>

      {/* CTA fijo */}
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(20px + env(safe-area-inset-bottom,0px))', padding: '0 24px', zIndex: 50 }}>
        <button className="btn btn-coral" disabled={!completo} onClick={() => buscar()}
          style={{ opacity: completo ? 1 : .5, boxShadow: '0 10px 30px rgba(240,112,90,.4)' }}>
          {completo ? 'Ver nuestro plan' : 'Elegí al menos tiempo y onda'}
        </button>
      </div>
    </div>
  )
}
