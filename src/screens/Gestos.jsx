import React, { useState } from 'react'
import { StatusBar, BackBtn, CorazonesFloat } from '../components/UI'
import { gestoDelDia, gestos as todosLosGestos } from '../data/gestos'

export default function Gestos({ go, gestosHechos, hechoHoy, onCompletar }) {
  const gesto = gestoDelDia()
  const [guardando, setGuardando] = useState(false)
  const [celebrando, setCelebrando] = useState(false)
  const [filtro, setFiltro] = useState('todos') // todos | sorprender | juntos
  const [completandoId, setCompletandoId] = useState(null)

  const total = gestosHechos.length

  const completarDelDia = async () => {
    if (guardando || hechoHoy) return
    setGuardando(true)
    if (navigator.vibrate) navigator.vibrate([12, 60, 22])
    await onCompletar(gesto)
    setCelebrando(true)
    setGuardando(false)
  }

  // Completar un gesto suelto de la lista (evita doble toque con completandoId)
  const completarGesto = async (g) => {
    if (completandoId) return
    setCompletandoId(g.id)
    if (navigator.vibrate) navigator.vibrate([10, 40, 15])
    await onCompletar(g)
    setCelebrando(true)
    setTimeout(() => { setCelebrando(false); setCompletandoId(null) }, 1600)
  }

  const lista = todosLosGestos.filter(g => filtro === 'todos' || g.categoria === filtro)

  const tipoLabel = (cat) => cat === 'juntos'
    ? { txt: 'Para hacer juntos', color: 'var(--lav)' }
    : { txt: 'Para sorprender', color: 'var(--peach)' }

  return (
    <div className="screen" style={{ background: 'linear-gradient(175deg,#26302A,#1A1512 65%)' }}>
      <StatusBar />
      {celebrando && <CorazonesFloat run={true} cantidad={2} />}
      <div className="pad pad-tab">
        <div className="row" style={{ marginTop: 4 }}><BackBtn onClick={() => go('home')} /></div>

        <div className="center mt24 fade">
          <div className="eyebrow" style={{ color: 'var(--sage-deep)' }}>Pequeños gestos</div>
          <h1 className="mt12">El gesto de hoy</h1>
          <p className="sub mt12">Dos minutos pueden cambiarle el día.</p>
        </div>

        {/* Gesto del día */}
        <div className="card fade d2 mt24" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="g-sage" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 54 }}>{gesto.emoji}</div>
          </div>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-.01em' }}>
              {gesto.texto}
            </div>
            <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <span className="chip">⏱️ {gesto.min} min</span>
              <span className="chip" style={{ background: tipoLabel(gesto.categoria).color }}>{tipoLabel(gesto.categoria).txt}</span>
            </div>
          </div>
        </div>

        {hechoHoy || celebrando ? (
          <div className="card fade d3 mt24 center" style={{ padding: 22, background: 'var(--sage)' }}>
            <div style={{ fontSize: 34 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>Gesto cumplido</div>
            <div className="sub mt8" style={{ fontSize: 14 }}>Mañana los espera uno nuevo.</div>
          </div>
        ) : (
          <button className="btn btn-coral fade d3 mt24" disabled={guardando} onClick={completarDelDia}>
            {guardando ? 'Guardando…' : 'Hecho ❤️'}
          </button>
        )}

        {/* Racha de gestos */}
        <div className="card fade d4 mt16" style={{ padding: 20 }}>
          <div className="row between">
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Gestos completados</div>
              <div className="sub" style={{ fontSize: 13.5, marginTop: 2 }}>
                {total === 0 ? 'Empiecen hoy' : `${total} ${total === 1 ? 'gesto' : 'gestos'} en total`}
              </div>
            </div>
            <div style={{ fontSize: 30 }}>🌱</div>
          </div>
        </div>

        {/* Explorar gestos por tipo */}
        <div className="mt32">
          <h3 style={{ marginBottom: 14 }}>Explorar gestos</h3>
          <div className="seg" style={{ marginBottom: 20 }}>
            {[['todos', 'Todos'], ['sorprender', 'Para sorprender'], ['juntos', 'Para hacer juntos']].map(([v, l]) => (
              <button key={v} className={filtro === v ? 'on' : ''} onClick={() => setFiltro(v)} style={{ fontSize: 12.5 }}>{l}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lista.map(g => {
              const tl = tipoLabel(g.categoria)
              const done = completandoId === g.id
              return (
                <div key={g.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 30, flexShrink: 0 }}>{g.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{g.texto}</div>
                    <div className="row" style={{ gap: 6, marginTop: 7 }}>
                      <span className="chip" style={{ fontSize: 11, padding: '5px 9px' }}>⏱️ {g.min}'</span>
                      <span className="chip" style={{ fontSize: 11, padding: '5px 9px', background: tl.color }}>{tl.txt}</span>
                    </div>
                  </div>
                  <button onClick={() => completarGesto(g)} disabled={done}
                    style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '50%',
                      background: done ? 'var(--sage)' : 'var(--coral)', color: '#fff', fontSize: 18,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done ? '✓' : '❤'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
