import React, { useState, useMemo } from 'react'
import { StatusBar, TabBar, gradFor } from '../components/UI'
import { coleccionesConPlanes } from '../data/colecciones'

const filtros = ['Todos', 'Gratis', 'Cerca', 'En casa', 'Aventura', 'Romántica', 'Naturaleza', 'Viaje']

export default function Explore({ planes, go, openPlan, planFotos = {} }) {
  const [f, setF] = useState('Todos')
  const [q, setQ] = useState('')

  const buscando = q.trim() !== '' || f !== 'Todos'

  const lista = useMemo(() => {
    return planes.filter(p => {
      if (q && !(`${p.titulo} ${p.descripcion} ${p.etiquetas.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (f === 'Todos') return true
      if (f === 'Gratis') return p.costo === 0
      if (f === 'Cerca') return p.distancia === 'cerca'
      return p.categoria === f
    })
  }, [planes, f, q])

  const colecciones = useMemo(() => coleccionesConPlanes(planes), [planes])

  // Card chica para el carrusel de colecciones
  const CardMini = ({ p }) => (
    <button className="card" style={{ textAlign: 'left', width: 160, flexShrink: 0, padding: 0, overflow: 'hidden' }} onClick={() => openPlan(p)}>
      <div className={'photo ' + (planFotos[p.id] ? '' : gradFor(p.categoria))}
        style={{ height: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 10,
          ...(planFotos[p.id] ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.05)), url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
        <span style={{ fontSize: 22, filter: planFotos[p.id] ? 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' : 'none' }}>{p.emoji}</span>
      </div>
      <div style={{ padding: '10px 12px 13px' }}>
        <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.2, color: 'var(--ink)' }}>{p.titulo}</div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-2)', fontWeight: 700, marginTop: 6 }}>
          {p.costo === 0 ? 'Gratis' : p.costo_texto} · {p.duracion_texto}
        </div>
      </div>
    </button>
  )

  // Card grande para la grilla
  const CardFull = ({ p }) => (
    <button className="card" style={{ textAlign: 'left', padding: 0, overflow: 'hidden' }} onClick={() => openPlan(p)}>
      <div className={'photo ' + (planFotos[p.id] ? '' : gradFor(p.categoria))}
        style={{ height: 128, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 12,
          ...(planFotos[p.id] ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.05)), url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
        <span style={{ fontSize: 26, filter: planFotos[p.id] ? 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' : 'none' }}>{p.emoji}</span>
      </div>
      <div style={{ padding: '12px 13px 15px' }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.2, color: 'var(--ink)' }}>{p.titulo}</div>
        <div className="row" style={{ gap: 6, marginTop: 8, fontSize: 11, color: 'var(--ink-2)', fontWeight: 700 }}>
          <span>{p.costo === 0 ? 'Gratis' : p.costo_texto}</span>·<span>{p.duracion_texto}</span>
        </div>
      </div>
    </button>
  )

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <h1 style={{ margin: '4px 0 16px' }}>Explorar</h1>

        <div className="card row" style={{ padding: 14, background: 'var(--white)', gap: 10 }}>
          <span style={{ opacity: .4 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar experiencias, lugares…"
            style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 15, background: 'transparent', flex: 1, color: 'var(--ink)' }} />
        </div>

        <div className="scroll-x mt16">
          {filtros.map(x => (
            <button key={x} className={'chip' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
          ))}
        </div>

        {/* MODO COLECCIONES (sin búsqueda ni filtro) */}
        {!buscando ? (
          <div className="mt24">
            {colecciones.map(col => (
              <div key={col.id} style={{ marginBottom: 30 }}>
                <div className="row between" style={{ marginBottom: 14, alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
                      {col.emoji} {col.titulo}
                    </div>
                    <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>{col.subtitulo}</div>
                  </div>
                </div>
                <div className="scroll-x" style={{ gap: 12, paddingBottom: 4 }}>
                  {col.planes.slice(0, 10).map(p => <CardMini key={p.id} p={p} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* MODO BÚSQUEDA (grilla) */
          <>
            <div className="sub mt16" style={{ fontSize: 13, fontWeight: 700 }}>{lista.length} experiencias</div>
            <div className="mt16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {lista.map(p => <CardFull key={p.id} p={p} />)}
            </div>
            {lista.length === 0 && (
              <div className="center sub" style={{ paddingTop: 40 }}>No encontramos experiencias con eso. Probá otra búsqueda.</div>
            )}
          </>
        )}
      </div>
      <TabBar current="explore" go={go} />
    </div>
  )
}
