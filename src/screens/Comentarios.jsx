import React, { useState, useEffect, useRef } from 'react'
import { Avatar } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'
import { getComentarios, crearComentario, borrarComentario } from '../data/supabase'

function tiempoCorto(iso) {
  const d = new Date(iso)
  const min = Math.floor((new Date() - d) / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const dias = Math.floor(h / 24)
  if (dias < 7) return `${dias}d`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function avatarDe(autor) {
  const n1 = window.__n1 || 'Luna'
  return autor === n1 ? { foto: AVATAR_1, grad: 'g-coral' } : { foto: AVATAR_2, grad: 'g-lav' }
}

export default function Comentarios({ publicacionId, quien, onCambioConteo }) {
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [texto, setTexto] = useState('')
  const [respondiendo, setRespondiendo] = useState(null) // comentario al que respondo
  const [enviando, setEnviando] = useState(false)
  const finRef = useRef(null)

  useEffect(() => {
    (async () => {
      const c = await getComentarios(publicacionId)
      setLista(c); setCargando(false)
    })()
  }, [publicacionId])

  const enviar = async () => {
    if (!texto.trim() || enviando) return
    setEnviando(true)
    if (navigator.vibrate) navigator.vibrate(8)
    const nuevo = await crearComentario({
      publicacion_id: publicacionId,
      padre_id: respondiendo?.id || null,
      autor: quien, texto: texto.trim(),
    })
    if (nuevo) {
      setLista(prev => [...prev, nuevo])
      onCambioConteo?.(publicacionId, 1)
      setTexto(''); setRespondiendo(null)
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }
    setEnviando(false)
  }

  const borrar = async (c) => {
    await borrarComentario(c.id)
    setLista(prev => prev.filter(x => x.id !== c.id && x.padre_id !== c.id))
    onCambioConteo?.(publicacionId, -1)
  }

  // Organizar: comentarios raíz + sus respuestas
  const raiz = lista.filter(c => !c.padre_id)
  const respuestasDe = (id) => lista.filter(c => c.padre_id === id)

  const Comentario = ({ c, esRespuesta }) => {
    const av = avatarDe(c.autor)
    return (
      <div style={{ display: 'flex', gap: 10, marginLeft: esRespuesta ? 38 : 0, marginTop: 12 }}>
        <Avatar grad={av.grad} size={30} foto={av.foto} />
        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--cream-2)', borderRadius: 14, padding: '9px 13px' }}>
            <div style={{ fontWeight: 700, fontSize: 12.5 }}>{c.autor}</div>
            <div style={{ fontSize: 14, lineHeight: 1.4, marginTop: 2, color: 'var(--ink)' }}>{c.texto}</div>
          </div>
          <div className="row" style={{ gap: 14, marginTop: 5, paddingLeft: 4 }}>
            <span className="sub" style={{ fontSize: 11 }}>{tiempoCorto(c.creado_en)}</span>
            {!esRespuesta && (
              <button onClick={() => setRespondiendo(c)} className="sub" style={{ fontSize: 11, fontWeight: 700 }}>Responder</button>
            )}
            {c.autor === quien && (
              <button onClick={() => borrar(c)} className="sub" style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral)' }}>Eliminar</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
      {cargando ? (
        <div className="sub" style={{ fontSize: 13 }}>Cargando…</div>
      ) : (
        <>
          {raiz.map(c => (
            <div key={c.id}>
              <Comentario c={c} />
              {respuestasDe(c.id).map(r => <Comentario key={r.id} c={r} esRespuesta />)}
            </div>
          ))}
          <div ref={finRef} />
        </>
      )}

      {/* Input de comentario */}
      <div style={{ marginTop: 14 }}>
        {respondiendo && (
          <div className="row between" style={{ marginBottom: 6, fontSize: 12 }}>
            <span className="sub">Respondiendo a {respondiendo.autor}</span>
            <button onClick={() => setRespondiendo(null)} className="sub" style={{ fontWeight: 700 }}>✕</button>
          </div>
        )}
        <div className="row" style={{ gap: 8, alignItems: 'flex-end' }}>
          <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={1}
            placeholder="Escribí un comentario…"
            style={{ flex: 1, border: '1.5px solid var(--line)', borderRadius: 18, padding: '10px 14px',
              font: 'inherit', fontSize: 14, outline: 'none', resize: 'none', color: 'var(--ink)', background: 'var(--white)' }} />
          <button onClick={enviar} disabled={!texto.trim() || enviando}
            style={{ width: 40, height: 40, borderRadius: '50%', background: texto.trim() ? 'var(--coral)' : 'var(--cream-2)',
              color: '#fff', fontSize: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
