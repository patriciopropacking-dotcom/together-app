import React, { useState, useMemo } from 'react'
import { StatusBar, TabBar, gradFor } from '../components/UI'
import { coleccionesConPlanes } from '../data/colecciones'

const filtros = ['Todos', 'Gratis', 'Cerca', 'En casa', 'Aventura', 'Romántica', 'Naturaleza', 'Viaje']

const GRAD_CAT = {
  'Romántica': 'linear-gradient(150deg,#E08C6E,#8A4A3A)',
  'Aventura': 'linear-gradient(150deg,#3E6E52,#1A3524)',
  'Naturaleza': 'linear-gradient(150deg,#5E8A4A,#2C4A1A)',
  'Viaje': 'linear-gradient(150deg,#C98A4A,#6E3A1A)',
  'En casa': 'linear-gradient(150deg,#5A4A6E,#2C2636)',
  'default': 'linear-gradient(150deg,#7A5A4A,#3A2A22)',
}
const gradColor = (cat) => GRAD_CAT[cat] || GRAD_CAT.default

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

  const CardMini = ({ p }) => {
    const tieneFoto = planFotos[p.id]
    return (
      <button className="card-surge" onClick={() => openPlan(p)}
        style={{ textAlign: 'left', width: 168, flexShrink: 0, padding: 0, overflow: 'hidden', borderRadius: 16, border: 'none',
          background: tieneFoto ? '#000' : gradColor(p.categoria), position: 'relative', height: 200,
          boxShadow: '0 6px 20px rgba(40,30,25,.15)' }}>
        {tieneFoto && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.72) 8%, rgba(0,0,0,.15) 45%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' }}>{p.emoji}</div>
        <div style={{ position: 'absolute', left: 13, right: 13, bottom: 13 }}>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.5)' }}>{p.titulo}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', fontWeight: 600, marginTop: 5 }}>
            {p.costo === 0 ? 'Gratis' : p.costo_texto} · {p.duracion_texto}
          </div>
        </div>
      </button>
    )
  }

  const CardFull = ({ p }) => {
    const tieneFoto = planFotos[p.id]
    return (
      <button className="card-surge" onClick={() => openPlan(p)}
        style={{ textAlign: 'left', padding: 0, overflow: 'hidden', borderRadius: 16, border: 'none',
          background: tieneFoto ? '#000' : gradColor(p.categoria), position: 'relative', height: 180,
          boxShadow: '0 6px 20px rgba(40,30,25,.15)' }}>
        {tieneFoto && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.72) 8%, rgba(0,0,0,.15) 45%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 26, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.5))' }}>{p.emoji}</div>
        <div style={{ position: 'absolute', left: 13, right: 13, bottom: 13 }}>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.5)' }}>{p.titulo}</div>
          <div className="row" style={{ gap: 6, marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>
            <span>{p.costo === 0 ? 'Gratis' : p.costo_texto}</span>·<span>{p.duracion_texto}</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <div style={{ margin: '6px 0 18px' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, margin: 0 }}>Explorar</h1>
          <p className="sub" style={{ fontSize: 14, marginTop: 4 }}>Elegí su próxima aventura juntos.</p>
        </div>

        <div className="row" style={{ padding: '12px 16px', background: 'var(--white)', gap: 10, borderRadius: 100, border: '1px solid var(--line)' }}>
          <span style={{ opacity: .4 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar experiencias, lugares…"
            style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 15, background: 'transparent', flex: 1, color: 'var(--ink)' }} />
          {q && <button onClick={() => setQ('')} style={{ color: 'var(--ink-2)', fontSize: 18 }}>✕</button>}
        </div>

        <div className="scroll-x mt16">
          {filtros.map(x => (
            <button key={x} className={'chip' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
          ))}
        </div>

        {!buscando ? (
          <div className="mt24">
            {colecciones.map(col => (
              <div key={col.id} style={{ marginBottom: 32 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--coral)' }}>
                    {col.emoji} Colección
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginTop: 3 }}>
                    {col.titulo}
                  </div>
                  <div className="sub" style={{ fontSize: 13, marginTop: 1 }}>{col.subtitulo}</div>
                </div>
                <div className="scroll-x" style={{ gap: 12, paddingBottom: 4 }}>
                  {col.planes.slice(0, 10).map(p => <CardMini key={p.id} p={p} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="sub mt24" style={{ fontSize: 13, fontWeight: 700 }}>{lista.length} {lista.length === 1 ? 'experiencia' : 'experiencias'}</div>
            <div className="mt16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {lista.map(p => <CardFull key={p.id} p={p} />)}
            </div>
            {lista.length === 0 && (
              <div className="center" style={{ paddingTop: 50 }}>
                <div style={{ fontSize: 38, opacity: .5 }}>🔍</div>
                <p className="sub mt16">No encontramos experiencias con eso.<br />Probá otra búsqueda.</p>
              </div>
            )}
          </>
        )}
      </div>
      <TabBar current="explore" go={go} />
    </div>
  )
}
