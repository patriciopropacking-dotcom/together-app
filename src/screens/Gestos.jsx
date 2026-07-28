import React, { useState } from 'react'
import { StatusBar, BackBtn, Confetti } from '../components/UI'
import { gestoDelDia, gestos as todosLosGestos } from '../data/gestos'

export default function Gestos({ go, gestosHechos, hechoHoy, onCompletar }) {
  const gesto = gestoDelDia()
  const [guardando, setGuardando] = useState(false)
  const [celebrando, setCelebrando] = useState(false)

  const completar = async () => {
    setGuardando(true)
    if (navigator.vibrate) navigator.vibrate([12, 60, 22])
    await onCompletar(gesto)
    setCelebrando(true)
    setGuardando(false)
  }

  // Racha de gestos calculada en App y pasada por props via gestosHechos
  const total = gestosHechos.length

  return (
    <div className="screen" style={{ background: 'linear-gradient(175deg,#26302A,#1A1512 65%)' }}>
      <StatusBar />
      {celebrando && <Confetti run={true} />}
      <div className="pad">
        <div className="row" style={{ marginTop: 4 }}><BackBtn onClick={() => go('home')} /></div>

        <div className="center mt24 fade">
          <div className="eyebrow" style={{ color: 'var(--sage-deep)' }}>Pequeños gestos</div>
          <h1 className="mt12">El gesto de hoy</h1>
          <p className="sub mt12">Dos minutos pueden cambiarle el día.</p>
        </div>

        {/* La carta del gesto */}
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
              <span className="chip">{gesto.tipo}</span>
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
          <button className="btn btn-coral fade d3 mt24" disabled={guardando} onClick={completar}>
            {guardando ? 'Guardando…' : 'Hecho ❤️'}
          </button>
        )}

        {/* Racha de gestos */}
        <div className="card fade d4 mt16" style={{ padding: 20 }}>
          <div className="row between">
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Racha de gestos</div>
              <div className="sub" style={{ fontSize: 13.5, marginTop: 2 }}>
                {total === 0 ? 'Empiecen hoy' : `${total} ${total === 1 ? 'gesto' : 'gestos'} en total`}
              </div>
            </div>
            <div className="center">
              <div style={{ fontSize: 30 }}>🌱</div>
            </div>
          </div>
        </div>

        <div className="center sub fade d5 mt24" style={{ fontSize: 13.5, paddingBottom: 20 }}>
          Los gestos no se planean ni cuestan nada.<br />Son la costumbre de elegirse todos los días.
        </div>
      </div>
    </div>
  )
}
