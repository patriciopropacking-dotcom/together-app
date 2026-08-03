import React, { useState, useMemo } from 'react'
import { StatusBar, TabBar } from '../components/UI'
import { coleccionesConPlanes } from '../data/colecciones'

const filtros = ['Todos', 'Gratis', 'Cerca', 'En casa', 'Aventura', 'Romántica', 'Naturaleza', 'Viaje']

const GRAD_CAT = {
  'Romántica': 'linear-gradient(160deg,#E08C6E,#8A4A3A)',
  'Aventura': 'linear-gradient(160deg,#3E6E52,#1A3524)',
  'Naturaleza': 'linear-gradient(160deg,#5E8A4A,#2C4A1A)',
  'Viaje': 'linear-gradient(160deg,#C98A4A,#6E3A1A)',
  'En casa': 'linear-gradient(160deg,#5A4A6E,#2C2636)',
  'default': 'linear-gradient(160deg,#7A5A4A,#3A2A22)',
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

  // HERO CARD — la primera experiencia, enorme, tipo destino soñado
  const HeroCard = ({ p }) => {
    const tieneFoto = planFotos[p.id]
    return (
      <button className="explore-tap" onClick={() => openPlan(p)}
        style={{ width: '100%', textAlign: 'left', padding: 0, overflow: 'hidden', borderRadius: 28, border: 'none',
          background: tieneFoto ? '#000' : gradColor(p.categoria), position: 'relative', height: 440,
          boxShadow: '0 18px 50px rgba(30,20,16,.35)' }}>
        {tieneFoto && (
          <div className="explore-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.82) 6%, rgba(0,0,0,.15) 45%, transparent 72%)' }} />
        {/* Categoría arriba */}
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <span style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', padding: '7px 14px', borderRadius: 100 }}>
            {p.categoria.toUpperCase()}
          </span>
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.08, textShadow: '0 2px 16px rgba(0,0,0,.5)' }}>
            {p.titulo}
          </div>
          <div className="row" style={{ gap: 14, marginTop: 12, color: 'rgba(255,255,255,.92)', fontSize: 13.5, fontWeight: 600 }}>
            <span>{p.costo === 0 ? 'Gratis' : p.costo_texto}</span>
            <span style={{ opacity: .5 }}>·</span>
            <span>{p.duracion_texto}</span>
            <span style={{ opacity: .5 }}>·</span>
            <span>⭐ {(3.9 + p.nivel_aventura * 0.2).toFixed(1)}</span>
          </div>
        </div>
      </button>
    )
  }

  // CARD SECUNDARIA — limpia, foto protagonista, poca info, mucho aire
  const CardMini = ({ p }) => {
    const tieneFoto = planFotos[p.id]
    return (
      <button className="explore-tap" onClick={() => openPlan(p)}
        style={{ textAlign: 'left', width: 210, flexShrink: 0, padding: 0, overflow: 'hidden', borderRadius: 22, border: 'none',
          background: 'transparent' }}>
        <div style={{ position: 'relative', height: 240, borderRadius: 22, overflow: 'hidden',
          background: tieneFoto ? '#000' : gradColor(p.categoria), boxShadow: '0 10px 30px rgba(30,20,16,.22)' }}>
          {tieneFoto && (
            <div className="explore-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6) 4%, transparent 50%)' }} />
        </div>
        {/* Info fuera de la foto, con aire */}
        <div style={{ padding: '14px 4px 0' }}>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25, color: 'var(--ink)' }}>{p.titulo}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600, marginTop: 6 }}>
            {p.costo === 0 ? 'Gratis' : p.costo_texto} · {p.duracion_texto}
          </div>
        </div>
      </button>
    )
  }

  // CARD GRILLA (búsqueda) — misma estética limpia
  const CardFull = ({ p }) => {
    const tieneFoto = planFotos[p.id]
    return (
      <button className="explore-tap" onClick={() => openPlan(p)}
        style={{ textAlign: 'left', padding: 0, overflow: 'hidden', borderRadius: 22, border: 'none', background: 'transparent' }}>
        <div style={{ position: 'relative', height: 190, borderRadius: 22, overflow: 'hidden',
          background: tieneFoto ? '#000' : gradColor(p.categoria), boxShadow: '0 10px 30px rgba(30,20,16,.22)' }}>
          {tieneFoto && (
            <div className="explore-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url("${planFotos[p.id]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.6) 4%, transparent 50%)' }} />
        </div>
        <div style={{ padding: '12px 4px 0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25, color: 'var(--ink)' }}>{p.titulo}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600, marginTop: 5 }}>
            {p.costo === 0 ? 'Gratis' : p.costo_texto} · {p.duracion_texto}
          </div>
        </div>
      </button>
    )
  }

  // La primera colección da su primer plan para el hero
  const heroPlan = !buscando && colecciones[0]?.planes[0]

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        {/* Encabezado editorial */}
        <div style={{ margin: '6px 0 22px' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 700, margin: 0 }}>Explorar</h1>
          <p className="sub" style={{ fontSize: 14.5, marginTop: 5 }}>Elegí su próxima aventura juntos.</p>
        </div>

        {/* Buscador pill */}
        <div className="row" style={{ padding: '13px 18px', background: 'var(--white)', gap: 10, borderRadius: 100, border: '1px solid var(--line)' }}>
          <span style={{ opacity: .4 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar experiencias, lugares…"
            style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 15, background: 'transparent', flex: 1, color: 'var(--ink)' }} />
          {q && <button onClick={() => setQ('')} style={{ color: 'var(--ink-2)', fontSize: 18 }}>✕</button>}
        </div>

        {/* Filtros */}
        <div className="scroll-x mt16">
          {filtros.map(x => (
            <button key={x} className={'chip' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
          ))}
        </div>

        {!buscando ? (
          <>
            {/* HERO */}
            {heroPlan && (
              <div style={{ marginTop: 26 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 12 }}>
                  Destacado de hoy
                </div>
                <HeroCard p={heroPlan} />
              </div>
            )}

            {/* COLECCIONES */}
            <div style={{ marginTop: 40 }}>
              {colecciones.map(col => (
                <div key={col.id} style={{ marginBottom: 44 }}>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--coral)' }}>
                      {col.emoji} Colección
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                      {col.titulo}
                    </div>
                    <div className="sub" style={{ fontSize: 13.5, marginTop: 2 }}>{col.subtitulo}</div>
                  </div>
                  <div className="scroll-x" style={{ gap: 18, paddingBottom: 4 }}>
                    {col.planes.slice(0, 10).map(p => <CardMini key={p.id} p={p} />)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="sub mt24" style={{ fontSize: 13, fontWeight: 700 }}>{lista.length} {lista.length === 1 ? 'experiencia' : 'experiencias'}</div>
            <div className="mt16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, rowGap: 24 }}>
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
