import React, { useState } from 'react'
import { StatusBar, TabBar, Avatar, Gauge, BackBtn, NumeroAnimado } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'
import { calcularLogros } from '../data/logros'

function diasJuntos(aniversario) {
  if (!aniversario) return 0
  return Math.max(0, Math.floor((new Date() - new Date(aniversario)) / 86400000))
}
function fechaBonita(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Profile({ go, doneCount, pareja, recuerdos = [], streak = 0, gestosTotal = 0, gestosLista = [], quien, onAniversario }) {
  const [tab, setTab] = useState(0)
  const [editandoFecha, setEditandoFecha] = useState(false)
  const [fechaTmp, setFechaTmp] = useState('')
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
          <div className="row" style={{ justifyContent: 'center', gap: 28, alignItems: 'flex-start' }}>
            <div className="center respira">
              <Avatar grad="g-coral" size={82} border={3} foto={AVATAR_1} ampliable nombre={n1} />
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{n1}</div>
            </div>
            <div style={{ fontSize: 26, alignSelf: 'center', marginTop: -14 }}>❤️</div>
            <div className="center respira">
              <Avatar grad="g-lav" size={82} border={3} foto={AVATAR_2} ampliable nombre={n2} />
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{n2}</div>
            </div>
          </div>

          <div className="sub mt16">
            {editandoFecha ? (
              <div className="row" style={{ gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                <input type="date" value={fechaTmp} onChange={e => setFechaTmp(e.target.value)}
                  style={{ border: '1.5px solid var(--line)', borderRadius: 12, padding: '8px 10px', font: 'inherit', fontSize: 14, background: 'var(--white)', color: 'var(--ink)' }} />
                <button className="chip" style={{ background: 'var(--coral)', color: '#fff' }}
                  onClick={async () => { await onAniversario?.(fechaTmp); setEditandoFecha(false) }}>Guardar</button>
                <button className="chip" onClick={() => setEditandoFecha(false)}>Cancelar</button>
              </div>
            ) : (
              <button onClick={() => { setFechaTmp(pareja?.aniversario || ''); setEditandoFecha(true) }}
                style={{ color: 'var(--ink-2)', fontSize: 13.5 }}>
                Juntos desde {fechaBonita(pareja?.aniversario)} · {diasJuntos(pareja?.aniversario)} días ✏️
              </button>
            )}
          </div>

          {quien && (
            <button className="chip mt12" onClick={() => go('logout')} style={{ background: 'var(--cream-2)' }}>
              👤 Sos {quien} · cambiar
            </button>
          )}
        </div>

        {/* Acceso a "Su año juntos" (Wrapped) */}
        <button onClick={() => go('wrapped')} className="card mt24" style={{ width: '100%', textAlign: 'left', padding: 0, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(120deg,#EE6A54,#4A3A5E)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 34 }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: '#fff' }}>Su año juntos</div>
              <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, marginTop: 2 }}>El resumen de todo lo que vivieron ❤️</div>
            </div>
            <span style={{ color: '#fff', fontSize: 20 }}>→</span>
          </div>
        </button>

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
                  <div className="n"><NumeroAnimado valor={s[1]} /></div>
                  <div className="l">{s[2]}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 1 && (
          <>
            {(() => {
              const datos = { recuerdos, gestos: gestosLista, racha: streak }
              const todos = calcularLogros(datos)
              const pendientes = todos.filter(l => !l.hecho)
              const completados = todos.filter(l => l.hecho)
              return (
                <>
                  <div className="eyebrow mt24" style={{ marginBottom: 16 }}>En progreso</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pendientes.map((l, i) => (
                      <div key={l.id} className="card fade" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${i * .05}s` }}>
                        <div className={'hex lock ' + l.grad} style={{ flexShrink: 0 }}>{l.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{l.titulo}</div>
                          <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>{l.desc}</div>
                          <div className="pbar" style={{ marginTop: 8 }}><i style={{ width: `${l.progreso * 100}%` }} /></div>
                        </div>
                        <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: 'var(--slate)' }}>{l.actual}/{l.meta}</div>
                      </div>
                    ))}
                    {pendientes.length === 0 && <p className="sub">¡Completaron todos los logros! 🏆</p>}
                  </div>

                  <div className="eyebrow mt32" style={{ marginBottom: 16 }}>Desbloqueados</div>
                  <div className="agrid">
                    {completados.map((l, i) => (
                      <div key={l.id} className="medal fade" style={{ animationDelay: `${i * .06}s` }}>
                        <div className={'hex brillo medalla-desbloqueada ' + l.grad}>{l.icon}</div>
                        <div className="name">{l.titulo}</div>
                      </div>
                    ))}
                    {completados.length === 0 && (
                      <p className="sub" style={{ gridColumn: '1/-1' }}>Todavía ninguno. ¡El primero está cerca!</p>
                    )}
                  </div>
                </>
              )
            })()}
          </>
        )}
      </div>
      <TabBar current="profile" go={go} />
    </div>
  )
}
