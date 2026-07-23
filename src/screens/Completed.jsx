import React, { useState } from 'react'
import { StatusBar, Confetti } from '../components/UI'

const EMOCIONES = [
  { e: '🥰', l: 'Enamorados' }, { e: '😂', l: 'Risa' }, { e: '😌', l: 'En paz' },
  { e: '🤩', l: 'Asombro' }, { e: '🥹', l: 'Emoción' }, { e: '🔥', l: 'Intensidad' },
]

export default function Completed({ chapter, go, onSave }) {
  const [emocion, setEmocion] = useState(null)
  const [nota, setNota] = useState('')
  const [cancion, setCancion] = useState('')
  const [lugar, setLugar] = useState('')
  const [calif, setCalif] = useState(0)
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    if (navigator.vibrate) navigator.vibrate([12, 50, 20])
    await onSave({
      emocion, mood: emocion,
      nota: nota.trim() || null,
      cancion: cancion.trim() || null,
      lugar: lugar.trim() || null,
      calificacion: calif || null,
    })
  }

  const Campo = ({ icon, label, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>{icon} {label}</div>
      {children}
    </div>
  )
  const inputStyle = {
    width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 12,
    font: 'inherit', fontSize: 14.5, outline: 'none', color: 'var(--ink)', background: 'var(--white)',
  }

  return (
    <div className="screen">
      <StatusBar />
      <Confetti run={true} />
      <div className="pad center" style={{ paddingTop: 60 }}>
        <div className="pop" style={{ fontSize: 64 }}>❤️</div>
        <div className="eyebrow fade d2 mt16">Capítulo {chapter}</div>
        <h1 className="fade d2 mt12" style={{ lineHeight: 1.1 }}>Acaban de crear<br />un nuevo recuerdo.</h1>
        <p className="sub fade d3 mt12">Guárdenlo antes de que se escape. En un año va a volver.</p>

        <div className="card fade d3 mt24" style={{ padding: 22, textAlign: 'left' }}>

          <Campo icon="📸" label="Una foto">
            <label style={{ ...inputStyle, display: 'block', textAlign: 'center', cursor: 'pointer', color: 'var(--ink-2)', borderStyle: 'dashed', padding: 20 }}>
              Tocá para elegir una foto
              <input type="file" accept="image/*" style={{ display: 'none' }} />
            </label>
            <div className="sub" style={{ fontSize: 11.5, marginTop: 6 }}>Las fotos se guardan en la próxima actualización.</div>
          </Campo>

          <Campo icon="✍️" label="Una nota">
            <textarea value={nota} onChange={e => setNota(e.target.value)} rows={2}
              placeholder="¿Qué hizo especial este momento?" style={{ ...inputStyle, resize: 'none' }} />
          </Campo>

          <Campo icon="🎵" label="La canción del momento">
            <input value={cancion} onChange={e => setCancion(e.target.value)}
              placeholder="Nombre de la canción" style={inputStyle} />
          </Campo>

          <Campo icon="📍" label="El lugar">
            <input value={lugar} onChange={e => setLugar(e.target.value)}
              placeholder="¿Dónde fue?" style={inputStyle} />
          </Campo>

          <Campo icon="💭" label="¿Cómo se sintieron?">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {EMOCIONES.map(m => (
                <button key={m.e} onClick={() => setEmocion(m.e)}
                  style={{
                    borderRadius: 16, padding: '12px 4px', textAlign: 'center',
                    border: emocion === m.e ? '2px solid var(--coral)' : '1.5px solid var(--line)',
                    background: emocion === m.e ? 'var(--peach)' : 'var(--white)', transition: '.15s',
                  }}>
                  <div style={{ fontSize: 24 }}>{m.e}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 3, color: 'var(--ink-2)' }}>{m.l}</div>
                </button>
              ))}
            </div>
          </Campo>

          <Campo icon="⭐" label="¿Cómo estuvo?">
            <div className="row" style={{ gap: 6, fontSize: 30 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setCalif(n)}
                  style={{ filter: n <= calif ? 'none' : 'grayscale(1) opacity(.32)', transition: '.15s' }}>
                  ⭐
                </button>
              ))}
            </div>
          </Campo>

        </div>

        <button className="btn btn-coral fade d4 mt24" disabled={guardando} onClick={guardar}>
          {guardando ? 'Guardando…' : 'Guardar este recuerdo'}
        </button>
      </div>
    </div>
  )
}
