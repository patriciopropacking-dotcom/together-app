import React, { useState } from 'react'
import { BackBtn } from '../components/UI'
import FotoPicker from '../components/FotoPicker'

// Colores cálidos del sistema para frases y cartas
const COLORES = [
  { id: 'coral', bg: 'linear-gradient(135deg,#F5876E,#EE6A54)' },
  { id: 'lav', bg: 'linear-gradient(135deg,#4A3A5E,#2C2636)' },
  { id: 'sage', bg: 'linear-gradient(135deg,#3E5245,#26302A)' },
  { id: 'noche', bg: 'linear-gradient(135deg,#3A2A22,#1A1512)' },
]

const TIPOS = [
  { id: 'photo', label: 'Foto', icon: '📷', desc: 'Una imagen y unas palabras' },
  { id: 'quote', label: 'Frase', icon: '💬', desc: 'Un pensamiento corto' },
  { id: 'letter', label: 'Carta', icon: '✉️', desc: 'Algo más largo, del corazón' },
  { id: 'song', label: 'Canción', icon: '🎵', desc: 'Una que les haga acordar a ustedes' },
  { id: 'plan', label: 'Para hacer juntos', icon: '✨', desc: 'Algo que quieran hacer' },
  { id: 'question', label: 'Pregunta', icon: '❓', desc: 'Algo para que responda el otro' },
]

export default function Composer({ quien, onPublicar, onCancelar }) {
  const [tipo, setTipo] = useState(null)
  const [texto, setTexto] = useState('')
  const [titulo, setTitulo] = useState('')
  const [fotoUrl, setFotoUrl] = useState(null)
  const [color, setColor] = useState('coral')
  const [publicando, setPublicando] = useState(false)
  // Campos específicos
  const [cancion, setCancion] = useState({ titulo: '', artista: '', dedicatoria: '', link: '' })
  const [plan, setPlan] = useState({ titulo: '', lugar: '', presupuesto: '' })

  const publicar = async () => {
    if (publicando) return
    setPublicando(true)
    if (navigator.vibrate) navigator.vibrate(12)
    let extra = {}
    if (tipo === 'song') extra = { cancion }
    if (tipo === 'plan') extra = { plan, aceptado_por: [] }
    if (tipo === 'question') extra = { respuestas: [] }
    await onPublicar({
      tipo, autor: quien,
      texto: texto.trim() || null,
      titulo: titulo.trim() || null,
      foto_url: tipo === 'photo' ? fotoUrl : null,
      color: (tipo === 'quote' || tipo === 'letter') ? color : null,
      extra,
    })
  }

  const puedePublicar = () => {
    if (tipo === 'photo') return fotoUrl || texto.trim()
    if (tipo === 'song') return cancion.titulo.trim() && cancion.artista.trim()
    if (tipo === 'plan') return plan.titulo.trim()
    if (tipo === 'question') return texto.trim().length > 0
    return texto.trim().length > 0
  }

  const inputStyle = {
    width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 14,
    font: 'inherit', fontSize: 15, outline: 'none', color: 'var(--ink)', background: 'var(--white)',
  }

  // Selección de tipo
  if (!tipo) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <button onClick={onCancelar} aria-label="Cerrar"
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 0 }} />
        <div className="sheet-up" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-1)',
          borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '14px 22px calc(40px + env(safe-area-inset-bottom,0px))' }}>
          <div style={{ width: 42, height: 5, borderRadius: 3, background: 'var(--line)', margin: '0 auto 22px' }} />
          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>¿Qué querés compartir?</h2>
          <p className="sub center" style={{ marginBottom: 24 }}>Una cosita para su rincón privado.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TIPOS.map(t => (
              <button key={t.id} onClick={() => setTipo(t.id)} className="modo-card">
                <div className="modo-icon" style={{ background: 'var(--cream-2)' }}>{t.icon}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{t.label}</div>
                  <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>{t.desc}</div>
                </div>
                <span style={{ color: 'var(--coral)', fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="pad pad-tab">
        <div className="row between" style={{ marginTop: 4, marginBottom: 20 }}>
          <BackBtn onClick={() => setTipo(null)} />
          <h3>{TIPOS.find(t => t.id === tipo).label}</h3>
          <div style={{ width: 40 }} />
        </div>

        {/* FOTO */}
        {tipo === 'photo' && (
          <>
            <FotoPicker carpeta="entrenosotros" onSubida={setFotoUrl} alto={260} texto="Elegí una foto para compartir" />
            <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={3}
              placeholder="Escribí algo… (opcional)" style={{ ...inputStyle, resize: 'none', marginTop: 16 }} />
          </>
        )}

        {/* FRASE */}
        {tipo === 'quote' && (
          <>
            <div style={{ background: COLORES.find(c => c.id === color).bg, borderRadius: 22, padding: '44px 26px',
              minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={4} autoFocus
                placeholder="Escribí una frase…"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                  textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: '#fff',
                  lineHeight: 1.4 }} />
            </div>
            <div className="row" style={{ gap: 12, marginTop: 18, justifyContent: 'center' }}>
              {COLORES.map(c => (
                <button key={c.id} onClick={() => setColor(c.id)}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: c.bg,
                    border: color === c.id ? '3px solid var(--ink)' : '3px solid transparent' }} />
              ))}
            </div>
          </>
        )}

        {/* CARTA */}
        {tipo === 'letter' && (
          <>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título (opcional)"
              style={{ ...inputStyle, fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 12 }} />
            <div style={{ background: 'var(--cream-2)', borderRadius: 18, padding: 20 }}>
              <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={10} autoFocus
                placeholder="Querido/a…"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                  font: 'inherit', fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)', fontFamily: 'var(--serif)' }} />
              <div style={{ textAlign: 'right', marginTop: 12, fontStyle: 'italic', color: 'var(--ink-2)', fontFamily: 'var(--serif)' }}>
                — {quien}
              </div>
            </div>
          </>
        )}

        {/* CANCIÓN */}
        {tipo === 'song' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center', background: 'var(--cream-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#4A3A5E,#2C2636)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🎵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{cancion.titulo || 'Nombre de la canción'}</div>
                <div className="sub" style={{ fontSize: 12.5 }}>{cancion.artista || 'Artista'}</div>
              </div>
            </div>
            <input value={cancion.titulo} onChange={e => setCancion({ ...cancion, titulo: e.target.value })} placeholder="Nombre de la canción" style={inputStyle} />
            <input value={cancion.artista} onChange={e => setCancion({ ...cancion, artista: e.target.value })} placeholder="Artista" style={inputStyle} />
            <input value={cancion.link} onChange={e => setCancion({ ...cancion, link: e.target.value })} placeholder="Link (Spotify, YouTube…) — opcional" style={inputStyle} />
            <textarea value={cancion.dedicatoria} onChange={e => setCancion({ ...cancion, dedicatoria: e.target.value })} rows={3} placeholder="Dedicatoria (opcional)" style={{ ...inputStyle, resize: 'none' }} />
          </div>
        )}

        {/* PARA HACER JUNTOS */}
        {tipo === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FotoPicker carpeta="entrenosotros" onSubida={setFotoUrl} alto={180} texto="Una foto del lugar (opcional)" />
            <input value={plan.titulo} onChange={e => setPlan({ ...plan, titulo: e.target.value })} placeholder="¿Qué querés hacer? Ej: Ir al Cadillal" style={inputStyle} />
            <input value={plan.lugar} onChange={e => setPlan({ ...plan, lugar: e.target.value })} placeholder="Lugar (opcional)" style={inputStyle} />
            <input value={plan.presupuesto} onChange={e => setPlan({ ...plan, presupuesto: e.target.value })} placeholder="Presupuesto estimado (opcional)" style={inputStyle} />
            <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={2} placeholder="Contale por qué querés ir…" style={{ ...inputStyle, resize: 'none' }} />
          </div>
        )}

        {/* PREGUNTA */}
        {tipo === 'question' && (
          <div style={{ background: 'linear-gradient(135deg,#3E5245,#26302A)', borderRadius: 22, padding: '40px 26px', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={3} autoFocus
              placeholder="¿Cuál es tu recuerdo favorito de nosotros?"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 700, color: '#fff', lineHeight: 1.4 }} />
          </div>
        )}

        <button className="btn btn-coral mt24" disabled={!puedePublicar() || publicando} onClick={publicar}
          style={{ opacity: puedePublicar() ? 1 : .5 }}>
          {publicando ? 'Publicando…' : 'Publicar ❤️'}
        </button>
      </div>
    </div>
  )
}
