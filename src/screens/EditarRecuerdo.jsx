import React, { useState } from 'react'
import { StatusBar, BackBtn } from '../components/UI'
import FotoPicker from '../components/FotoPicker'

const EMOCIONES = [
  { e: '🥰', l: 'Enamorados' }, { e: '😂', l: 'Risa' }, { e: '😌', l: 'En paz' },
  { e: '🤩', l: 'Asombro' }, { e: '🥹', l: 'Emoción' }, { e: '🔥', l: 'Intensidad' },
]

// Fuera del componente para que el input no pierda foco en cada tecla
const inputStyle = {
  width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 12,
  font: 'inherit', fontSize: 14.5, outline: 'none', color: 'var(--ink)', background: 'var(--white)',
}
const Campo = ({ icon, label, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>{icon} {label}</div>
    {children}
  </div>
)

export default function EditarRecuerdo({ recuerdo, onGuardar, onBorrar, onVolver }) {
  const [nota, setNota] = useState(recuerdo.nota || '')
  const [cancion, setCancion] = useState(recuerdo.cancion || '')
  const [lugar, setLugar] = useState(recuerdo.lugar || '')
  const [emocion, setEmocion] = useState(recuerdo.emocion || recuerdo.mood || null)
  const [calif, setCalif] = useState(recuerdo.calificacion || 0)
  const [fotoUrl, setFotoUrl] = useState(recuerdo.foto_url || null)
  const [guardando, setGuardando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    if (navigator.vibrate) navigator.vibrate(12)
    await onGuardar(recuerdo.id, {
      nota: nota.trim() || null,
      cancion: cancion.trim() || null,
      lugar: lugar.trim() || null,
      emocion, mood: emocion,
      calificacion: calif || null,
      foto_url: fotoUrl,
    })
  }

  const borrar = async () => {
    setGuardando(true)
    await onBorrar(recuerdo.id)
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad">
        <div className="row between" style={{ marginTop: 4 }}>
          <BackBtn onClick={onVolver} />
          <h3>Editar recuerdo</h3>
          <div style={{ width: 40 }} />
        </div>

        <div className="center mt24">
          <div style={{ fontSize: 44 }}>{recuerdo.emoji}</div>
          <h2 className="mt8">{recuerdo.titulo}</h2>
        </div>

        <div className="card mt24" style={{ padding: 22 }}>
          <Campo icon="📸" label="Foto">
            <FotoPicker carpeta="recuerdos" valor={fotoUrl} onSubida={setFotoUrl} />
          </Campo>

          <Campo icon="✍️" label="Nota">
            <textarea value={nota} onChange={e => setNota(e.target.value)} rows={2}
              placeholder="¿Qué hizo especial este momento?" style={{ ...inputStyle, resize: 'none' }} />
          </Campo>

          <Campo icon="🎵" label="Canción">
            <input value={cancion} onChange={e => setCancion(e.target.value)}
              placeholder="Nombre de la canción" style={inputStyle} />
          </Campo>

          <Campo icon="📍" label="Lugar">
            <input value={lugar} onChange={e => setLugar(e.target.value)}
              placeholder="¿Dónde fue?" style={inputStyle} />
          </Campo>

          <Campo icon="💭" label="¿Cómo se sintieron?">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {EMOCIONES.map(m => (
                <button key={m.e} onClick={() => setEmocion(emocion === m.e ? null : m.e)}
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
                <button key={n} onClick={() => setCalif(calif === n ? 0 : n)}
                  style={{ filter: n <= calif ? 'none' : 'grayscale(1) opacity(.32)', transition: '.15s' }}>
                  ⭐
                </button>
              ))}
            </div>
          </Campo>
        </div>

        <button className="btn btn-coral mt24" disabled={guardando} onClick={guardar}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {!confirmar ? (
          <button className="btn btn-line mt12" onClick={() => setConfirmar(true)}
            style={{ color: 'var(--coral)', borderColor: 'var(--peach)' }}>
            Borrar este recuerdo
          </button>
        ) : (
          <div className="card mt12" style={{ padding: 18, background: 'var(--peach)' }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>¿Seguro que querés borrarlo?</div>
            <div className="sub" style={{ fontSize: 13.5, marginBottom: 14 }}>Este capítulo desaparece para siempre.</div>
            <div className="row" style={{ gap: 10 }}>
              <button className="btn btn-line" style={{ flex: 1, padding: 13 }} onClick={() => setConfirmar(false)}>Cancelar</button>
              <button className="btn btn-coral" style={{ flex: 1, padding: 13 }} disabled={guardando} onClick={borrar}>Sí, borrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
