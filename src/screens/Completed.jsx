import React, { useState } from 'react'
import { StatusBar, Confetti } from '../components/UI'

export default function Completed({ chapter, go }) {
  const [mood, setMood] = useState(null)
  const moods = ['😍', '🥰', '😌', '😄', '🤩']
  return (
    <div className="screen">
      <StatusBar />
      <Confetti run={true} />
      <div className="pad center" style={{ paddingTop: 64 }}>
        <div className="pop" style={{ fontSize: 68 }}>🎉</div>
        <div className="eyebrow fade d2 mt16">Capítulo {chapter} desbloqueado</div>
        <h1 className="fade d2 mt12" style={{ lineHeight: 1.1 }}>Un recuerdo más<br />para ustedes.</h1>
        <p className="sub fade d3 mt12">Guarden este momento antes de que se escape.</p>

        <div className="card fade d3 mt24" style={{ padding: 20, textAlign: 'left' }}>
          <button className="row between" style={{ width: '100%' }}>
            <div className="row"><span style={{ fontSize: 22 }}>📸</span><span style={{ fontWeight: 700 }}>Agreguen una foto</span></div>
            <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Subir</span>
          </button>
          <div className="divider" />
          <button className="row between" style={{ width: '100%' }}>
            <div className="row"><span style={{ fontSize: 22 }}>🎵</span><span style={{ fontWeight: 700 }}>La canción del momento</span></div>
            <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Elegir</span>
          </button>
          <div className="divider" />
          <button className="row between" style={{ width: '100%' }}>
            <div className="row"><span style={{ fontSize: 22 }}>✍️</span><span style={{ fontWeight: 700 }}>Una nota para el futuro</span></div>
            <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Escribir</span>
          </button>
          <div className="divider" />
          <div style={{ fontWeight: 700, marginBottom: 12 }}>¿Cómo se sintieron?</div>
          <div className="row" style={{ gap: 10, fontSize: 30 }}>
            {moods.map(m => (
              <button key={m} onClick={() => setMood(m)}
                style={{ transform: mood === m ? 'scale(1.25)' : 'scale(1)', transition: '.15s', filter: mood && mood !== m ? 'grayscale(1) opacity(.5)' : 'none' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-coral fade d4 mt24" onClick={() => go('memories')}>Guardar recuerdo</button>
      </div>
    </div>
  )
}
