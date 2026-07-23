import React, { useState } from 'react'
import { StatusBar, TabBar, Avatar, Gauge, BackBtn } from '../components/UI'

const logros = [
  { ic: '💞', name: 'Primera cita', grad: 'g-coral', need: 1 },
  { ic: '⭐', name: '10 experiencias', grad: 'g-coral', need: 10 },
  { ic: '🧭', name: 'Exploradores', grad: 'g-sage', need: 50 },
  { ic: '💯', name: '100 recuerdos', grad: 'g-lav', need: 100 },
]

function diasJuntos(aniversario) {
  if (!aniversario) return 0
  return Math.max(0, Math.floor((new Date() - new Date(aniversario)) / 86400000))
}
function fechaBonita(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Profile({ go, doneCount, pareja, recuerdos = [], streak = 0, gestosTotal = 0, quien }) {
  const [tab, setTab] = useState(0)
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  // Contadores reales derivados de los recuerdos
  const porCat = (c) => recuerdos.filter(r => r.categoria === c).length
  const stats = [
    ['📖', String(doneCount), 'Experiencias', 'var(--peach)'],
    ['❤️', String(gestosTotal), 'Pequeños gestos', 'var(--sage)'],
    ['🔥', String(streak), 'Racha (días)', 'var(--lav)'],
    ['🌇', String(porCat('Romántica')), 'Románticas', 'var(--sky)'],
    ['🏔️', String(porCat('Aventura')), 'Aventuras', 'var(--peach)'],
    ['☕', String(porCat('Café') + porCat('Comida')), 'Comidas y cafés', 'var(--lav)'],
  ]

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <div className="row between" style={{ marginTop: 4 }}>
          <BackBtn onClick={() => go('home')} />
          <h3>Nuestro camino ❤️</h3>
          <div style={{ width: 40 }} />
        </div>

        <div className="center mt24">
          <div className="pair" style={{ justifyContent: 'center' }}>
            <Avatar grad="g-coral" size={74} border={4} />
            <Avatar grad="g-lav" size={74} border={4} />
          </div>
          <h2 className="mt12">{n1} &amp; {n2}</h2>
          <div className="sub">Juntos desde {fechaBonita(pareja?.aniversario)} · {diasJuntos(pareja?.aniversario)} días</div>
          {quien && (
            <button className="chip mt12" onClick={() => go('logout')} style={{ background: 'var(--cream-2)' }}>
              👤 Sos {quien} · cambiar
            </button>
          )}
        </div>

        <div className="seg mt24">
          {['Estadísticas', 'Logros'].map((t, i) => (
            <button key={i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className="card mt24 center" style={{ padding: '26px 20px 20px' }}>
              <Gauge value={doneCount} max={50} label="Experiencias completadas" />
            </div>
            <div className="mt16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {stats.map((s, i) => (
                <div key={i} className="statbox fade" style={{ animationDelay: `${i * .05}s` }}>
                  <div className="ic" style={{ display: 'inline-flex', width: 36, height: 36, borderRadius: 12, background: s[3], alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s[0]}</div>
                  <div className="n">{s[1]}</div>
                  <div className="l">{s[2]}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 1 && (
          <>
            <div className="eyebrow mt24" style={{ marginBottom: 16 }}>En progreso</div>
            <div className="agrid">
              {logros.filter(l => doneCount < l.need).map((l, i) => (
                <div key={i} className="medal fade" style={{ animationDelay: `${i * .06}s` }}>
                  <div className={'hex lock ' + l.grad}>{l.ic}</div>
                  <div className="name">{l.name}</div>
                  <div className="prog">{doneCount}/{l.need}</div>
                </div>
              ))}
            </div>
            <div className="eyebrow mt32" style={{ marginBottom: 16 }}>Completados</div>
            <div className="agrid">
              {logros.filter(l => doneCount >= l.need).map((l, i) => (
                <div key={i} className="medal fade" style={{ animationDelay: `${i * .06}s` }}>
                  <div className={'hex ' + l.grad}>{l.ic}</div>
                  <div className="name">{l.name}</div>
                </div>
              ))}
              {logros.filter(l => doneCount >= l.need).length === 0 && (
                <p className="sub" style={{ gridColumn: '1/-1' }}>Todavía ninguno. ¡El primero está cerca!</p>
              )}
            </div>
          </>
        )}
      </div>
      <TabBar current="profile" go={go} />
    </div>
  )
}
