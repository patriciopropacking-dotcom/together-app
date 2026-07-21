import React, { useState } from 'react'
import { StatusBar, TabBar, gradFor } from '../components/UI'

function fechaTexto(iso) {
  const d = new Date(iso)
  const hoy = new Date()
  const difDias = Math.floor((hoy - d) / 86400000)
  if (difDias <= 0) return 'Hoy'
  if (difDias === 1) return 'Ayer'
  if (difDias < 7) return `Hace ${difDias} días`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export default function Memories({ go, recuerdos }) {
  const [tab, setTab] = useState(0)

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <div className="row between" style={{ margin: '4px 0 18px' }}>
          <h1>Recuerdos</h1>
          <span className="chip" style={{ background: 'var(--peach)' }}>{recuerdos.length} capítulos</span>
        </div>
        <div className="seg" style={{ marginBottom: 24 }}>
          {['Historia', 'Mapa', 'Álbumes'].map((t, i) => (
            <button key={i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {tab === 0 && (
          recuerdos.length === 0 ? (
            <div className="center" style={{ paddingTop: 50 }}>
              <div style={{ fontSize: 54 }}>📖</div>
              <h3 className="mt16">Su historia empieza acá</h3>
              <p className="sub mt8">Completen su primera experiencia y va a aparecer como el capítulo 1.</p>
              <button className="btn btn-coral mt24" onClick={() => go('surprise')}>🎲 Sorpréndenos</button>
            </div>
          ) : (
            <div className="tl">
              {recuerdos.map((r, i) => {
                const cap = recuerdos.length - i
                return (
                  <div key={r.id} className={'tl-item fade d' + Math.min(i + 1, 6)}>
                    <div className="chapter" style={{ marginBottom: 8 }}>Cap. {cap} · {fechaTexto(r.completado_en)}</div>
                    <div className="card">
                      <div className={'photo ' + gradFor(r.categoria)} style={{ height: 150, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{r.emoji} {r.titulo}</div>
                      </div>
                      {(r.cancion || r.mood || r.nota) && (
                        <div style={{ padding: 15 }}>
                          <div className="row" style={{ gap: 8 }}>
                            {r.cancion && <span className="chip">🎵 {r.cancion}</span>}
                            {r.mood && <span className="chip">{r.mood}</span>}
                          </div>
                          {r.nota && <p className="sub" style={{ fontSize: 14, marginTop: 10 }}>"{r.nota}"</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 1 && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="g-sage" style={{ height: 300, position: 'relative' }}>
              {recuerdos.slice(0, 6).map((_, i) => {
                const pos = [[30, 40], [55, 25], [70, 60], [45, 70], [25, 55], [60, 45]][i]
                return <div key={i} style={{ position: 'absolute', left: pos[0] + '%', top: pos[1] + '%', width: 28, height: 28, borderRadius: '50% 50% 50% 0', background: 'var(--coral)', transform: 'rotate(-45deg)', boxShadow: '0 4px 10px rgba(0,0,0,.2)' }} />
              })}
            </div>
            <div style={{ padding: 16 }} className="center sub">{recuerdos.length} recuerdos guardados</div>
          </div>
        )}

        {tab === 2 && (
          <div className="center" style={{ paddingTop: 40 }}>
            <div style={{ fontSize: 48 }}>📸</div>
            <p className="sub mt16">Los álbumes de fotos llegan pronto.</p>
          </div>
        )}
      </div>
      <TabBar current="memories" go={go} />
    </div>
  )
}
