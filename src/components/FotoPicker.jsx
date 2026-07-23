import React, { useState, useRef } from 'react'
import { subirFoto } from '../data/supabase'

// Selector de foto con vista previa y subida a Supabase Storage.
export default function FotoPicker({ carpeta = 'recuerdos', valor, onSubida, alto = 190, texto = 'Tocá para elegir una foto' }) {
  const [preview, setPreview] = useState(valor || null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const elegir = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (!file.type.startsWith('image/')) { setError('Ese archivo no es una imagen.'); return }
    if (file.size > 8 * 1024 * 1024) { setError('La foto pesa más de 8 MB. Probá con una más liviana.'); return }

    // Vista previa inmediata
    setPreview(URL.createObjectURL(file))
    setSubiendo(true)
    const url = await subirFoto(file, carpeta)
    setSubiendo(false)

    if (url) {
      setPreview(url)
      onSubida?.(url)
    } else {
      setError('No se pudo subir. Probá de nuevo.')
      setPreview(valor || null)
    }
  }

  return (
    <div>
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          width: '100%', height: alto, borderRadius: 18, overflow: 'hidden',
          border: preview ? 'none' : '2px dashed var(--line)',
          background: preview ? `center/cover url("${preview}")` : 'var(--white)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', color: 'var(--ink-2)', fontSize: 14, fontWeight: 600,
        }}>
        {!preview && <span>📸 {texto}</span>}
        {subiendo && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,.82)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: 'var(--ink)',
          }}>
            Subiendo…
          </div>
        )}
        {preview && !subiendo && (
          <div style={{
            position: 'absolute', right: 10, bottom: 10, background: 'rgba(255,255,255,.92)',
            borderRadius: 100, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: 'var(--ink)',
          }}>
            Cambiar
          </div>
        )}
      </button>

      <input ref={inputRef} type="file" accept="image/*" onChange={elegir} style={{ display: 'none' }} />
      {error && <div style={{ color: 'var(--coral)', fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>{error}</div>}
    </div>
  )
}
