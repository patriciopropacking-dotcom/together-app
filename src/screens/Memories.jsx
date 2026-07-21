import React, { useState } from 'react'
import { StatusBar, TabBar, gradFor } from '../components/UI'

const recuerdos = [
  { cap: 44, fecha: 'Hoy', titulo: 'Picnic al atardecer', cat: 'Romántica', nota: '"El cielo se puso rosa justo cuando llegamos."', song: 'Tu canción', mood: '😍' },
  { cap: 43, fecha: 'Hace 3 días', titulo: 'Café nuevo en el centro', cat: 'Café', nota: '"Encontramos nuestro lugar."', song: 'Here Comes The Sun', mood: '🥰' },
  { cap: 42, fecha: 'La semana pasada', titulo: 'Caminata al amanecer', cat: 'Naturaleza', nota: '"Vale cada minuto de sueño perdido."', song: null, mood: '😌' },
  { cap: 41, fecha: '12 may', titulo: 'Noche de pizza casera', cat: 'En casa', nota: '"Competimos por quién hacía la mejor 😅"', song: 'Love Me Like You Do', mood: '😄' },
]

export default function Memories({ go }) {
  const [tab, setTab] = useState(0)
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <div className="row between" style={{ margin: '4px 0 18px' }}>
          <h1>Recuerdos</h1>
          <span className="chip" style={{ background: 'var(--peach)' }}>43 capítulos</span>
        </div>
        <div className="seg" style={{ marginBottom: 24 }}>
          {['Historia', 'Mapa', 'Álbumes'].map((t, i) => (
            <button key={i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {tab === 0 && (
          <div className="tl">
            {recuerdos.map((r, i) => (
              <div key={r.cap} className={'tl-item fade d' + (i + 1)}>
                <div className="chapter" style={{ marginBottom: 8 }}>Cap. {r.cap} · {r.fecha}</div>
                <div className="card">
                  <div className={'photo ' + gradFor(r.cat)} style={{ height: 150, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{r.titulo}</div>
                  </div>
                  <div style={{ padding: 15 }}>
                    <div className="row" style={{ gap: 8 }}>
                      {r.song && <span className="chip">🎵 {r.song}</span>}
                      <span className="chip">{r.mood}</span>
                    </div>
                    <p className="sub" style={{ fontSize: 14, marginTop: 10 }}>{r.nota}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="g-sage" style={{ height: 300, position: 'relative' }}>
              {[[30, 40], [55, 25], [70, 60], [45, 70], [25, 55]].map(([x, y], i) => (
                <div key={i} style={{ position: 'absolute', left: x + '%', top: y + '%', width: 28, height: 28, borderRadius: '50% 50% 50% 0', background: 'var(--coral)', transform: 'rotate(-45deg)', boxShadow: '0 4px 10px rgba(0,0,0,.2)' }} />
              ))}
            </div>
            <div style={{ padding: 16 }} className="center sub">43 recuerdos en 4 ciudades</div>
          </div>
        )}

        {tab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {['Amaneceres', 'Escapadas', 'Cenas', 'En casa'].map((a, i) => (
              <div key={a} className="card">
                <div className={'photo ' + gradFor(['Naturaleza', 'Viaje', 'Comida', 'En casa'][i])} style={{ height: 120 }} />
                <div style={{ padding: 14 }}><div style={{ fontWeight: 800 }}>{a}</div><div className="sub" style={{ fontSize: 13 }}>{[7, 4, 12, 9][i]} fotos</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TabBar current="memories" go={go} />
    </div>
  )
}
