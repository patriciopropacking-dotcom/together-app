import React, { useState } from 'react'
import { StatusBar, TabBar, Avatar, Gauge, BackBtn } from '../components/UI'

const stats = [
  ['⏱️', '312', 'Horas juntos', 'var(--peach)'],
  ['🌅', '7', 'Amaneceres', 'var(--sage)'],
  ['🚗', '128', 'Km juntos', 'var(--lav)'],
  ['☕', '19', 'Cafés', 'var(--sky)'],
  ['🆓', '27', 'Planes gratis', 'var(--peach)'],
  ['🌃', '11', 'Citas nocturnas', 'var(--lav)'],
]

const logros = [
  { ic: '💞', name: 'Primera cita', grad: 'g-coral', done: true },
  { ic: '🌅', name: 'Primer amanecer', grad: 'g-sage', done: true },
  { ic: '🚗', name: 'Road trip', grad: 'g-sky', done: true },
  { ic: '🔥', name: '10 seguidos', grad: 'g-peach', done: true },
  { ic: '🏠', name: '5 en casa', grad: 'g-warm', done: true },
  { ic: '⭐', name: '10 experiencias', grad: 'g-coral', done: true },
  { ic: '🧭', name: 'Exploradores', grad: 'g-sage', done: false, prog: '43/50' },
  { ic: '✈️', name: 'Viajeros', grad: 'g-sky', done: false, prog: '2/10' },
  { ic: '💯', name: '100 días', grad: 'g-lav', done: false, prog: '18/100' },
]

export default function Profile({ go, doneCount }) {
  const [tab, setTab] = useState(0)
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
          <h2 className="mt12">Luna &amp; Pato</h2>
          <div className="sub">Juntos desde 12 mar 2023 · 🔥 18 días</div>
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
              {logros.filter(l => !l.done).map((l, i) => (
                <div key={i} className="medal fade" style={{ animationDelay: `${i * .06}s` }}>
                  <div className={'hex lock ' + l.grad}>{l.ic}</div>
                  <div className="name">{l.name}</div>
                  <div className="prog">{l.prog}</div>
                </div>
              ))}
            </div>
            <div className="eyebrow mt32" style={{ marginBottom: 16 }}>Completados</div>
            <div className="agrid">
              {logros.filter(l => l.done).map((l, i) => (
                <div key={i} className="medal fade" style={{ animationDelay: `${i * .06}s` }}>
                  <div className={'hex ' + l.grad}>{l.ic}</div>
                  <div className="name">{l.name}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <TabBar current="profile" go={go} />
    </div>
  )
}
