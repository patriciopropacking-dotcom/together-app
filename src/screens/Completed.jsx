import React, { useState } from 'react'
import { StatusBar, Confetti } from '../components/UI'

export default function Completed({ chapter, go, onSave }) {
  const [mood, setMood] = useState(null)
  const [nota, setNota] = useState('')
  const [cancion, setCancion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const moods = ['😍', '🥰', '😌', '😄', '🤩']

  const guardar = async () => {
    setGuardando(true)
    await onSave({ mood, nota: nota.trim() || null, cancion: cancion.trim() || null })
  }

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
          <div style={{ fontWeight: 700, marginBottom: 10 }}>✍️ Una nota</div>
          <textarea value={nota} onChange={e => setNota(e.target.value)} rows={2}
            placeholder="¿Qué hizo especial este momento?"
            style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 12, font: 'inherit', fontSize: 14, resize: 'none', outline: 'none', color: 'var(--ink)' }} />

          <div style={{ fontWeight: 700, margin: '16px 0 10px' }}>🎵 La canción del momento</div>
          <input value={cancion} onChange={e => setCancion(e.target.value)}
            placeholder="Nombre de la canción"
            style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 12, font: 'inherit', fontSize: 14, outline: 'none', color: 'var(--ink)' }} />

          <div style={{ fontWeight: 700, margin: '16px 0 12px' }}>¿Cómo se sintieron?</div>
          <div className="row" style={{ gap: 10, fontSize: 30 }}>
            {moods.map(m => (
              <button key={m} onClick={() => setMood(m)}
                style={{ transform: mood === m ? 'scale(1.25)' : 'scale(1)', transition: '.15s', filter: mood && mood !== m ? 'grayscale(1) opacity(.5)' : 'none' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-coral fade d4 mt24" disabled={guardando} onClick={guardar}>
          {guardando ? 'Guardando…' : 'Guardar recuerdo'}
        </button>
      </div>
    </div>
  )
}
