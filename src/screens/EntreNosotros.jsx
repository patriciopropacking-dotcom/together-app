import React, { useState } from 'react'
import { Avatar } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'

const COLORES = {
  coral: 'linear-gradient(135deg,#F5876E,#EE6A54)',
  lav: 'linear-gradient(135deg,#4A3A5E,#2C2636)',
  sage: 'linear-gradient(135deg,#3E5245,#26302A)',
  noche: 'linear-gradient(135deg,#3A2A22,#1A1512)',
}

const REACCIONES = [
  { tipo: 'love', emoji: '❤️', label: 'Me encanta' },
  { tipo: 'moved', emoji: '🥹', label: 'Me emocionó' },
  { tipo: 'lets_do_it', emoji: '✨', label: 'Hagámoslo' },
  { tipo: 'funny', emoji: '😂', label: 'Gracioso' },
  { tipo: 'hug', emoji: '🤗', label: 'Abrazo' },
]

function tiempoRelativo(iso) {
  const d = new Date(iso)
  const ahora = new Date()
  const min = Math.floor((ahora - d) / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`
  const dias = Math.floor(h / 24)
  if (dias < 7) return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function PostCard({ pub, quien, onReaccionar, onBorrar }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [pickerAbierto, setPickerAbierto] = useState(false)
  const avatar = pub.autor === (window.__n1 || 'Luna') ? AVATAR_1 : AVATAR_2
  const grad = pub.autor === (window.__n1 || 'Luna') ? 'g-coral' : 'g-lav'
  const reacciones = Array.isArray(pub.reacciones) ? pub.reacciones : []

  // Agrupar reacciones por tipo
  const conteo = {}
  reacciones.forEach(r => { conteo[r.tipo] = (conteo[r.tipo] || 0) + 1 })
  const miReaccion = reacciones.find(r => r.autor === quien)

  return (
    <div className="post-card fade">
      {/* Cabecera */}
      <div className="row between" style={{ marginBottom: 14 }}>
        <div className="row" style={{ gap: 10 }}>
          <Avatar grad={grad} size={38} foto={avatar} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{pub.autor}</div>
            <div className="sub" style={{ fontSize: 11.5 }}>{tiempoRelativo(pub.creado_en)}{pub.editado_en ? ' · editado' : ''}</div>
          </div>
        </div>
        {pub.autor === quien && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ color: 'var(--ink-2)', fontSize: 20, padding: '2px 8px' }}>⋯</button>
            {menuAbierto && (
              <div style={{ position: 'absolute', right: 0, top: 30, background: 'var(--cream-2)', borderRadius: 14,
                border: '1px solid var(--line)', boxShadow: 'var(--shadow)', zIndex: 20, overflow: 'hidden', minWidth: 130 }}>
                <button onClick={() => { onBorrar(pub); setMenuAbierto(false) }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', color: 'var(--coral)', fontWeight: 700, fontSize: 14 }}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido según tipo */}
      {pub.tipo === 'photo' && (
        <>
          {pub.foto_url && <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: pub.texto ? 12 : 0 }}>
            <img src={pub.foto_url} alt="" style={{ width: '100%', display: 'block' }} /></div>}
          {pub.texto && <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink)' }}>{pub.texto}</p>}
        </>
      )}

      {pub.tipo === 'quote' && (
        <div style={{ background: COLORES[pub.color] || COLORES.coral, borderRadius: 18, padding: '40px 26px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
            "{pub.texto}"
          </div>
        </div>
      )}

      {pub.tipo === 'letter' && (
        <div style={{ background: 'var(--cream-2)', borderRadius: 16, padding: 20 }}>
          {pub.titulo && <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{pub.titulo}</div>}
          <p style={{ fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{pub.texto}</p>
          <div style={{ textAlign: 'right', marginTop: 12, fontStyle: 'italic', color: 'var(--ink-2)', fontFamily: 'var(--serif)' }}>— {pub.autor}</div>
        </div>
      )}

      {/* Reacciones */}
      <div className="row between" style={{ marginTop: 14, alignItems: 'center' }}>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(conteo).map(([tipo, n]) => {
            const r = REACCIONES.find(x => x.tipo === tipo)
            return <span key={tipo} className="chip" style={{ fontSize: 12, padding: '5px 10px' }}>{r?.emoji} {n}</span>
          })}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setPickerAbierto(!pickerAbierto)}
            style={{ color: miReaccion ? 'var(--coral)' : 'var(--ink-2)', fontSize: 20, fontWeight: 700, padding: '4px 8px' }}>
            {miReaccion ? REACCIONES.find(r => r.tipo === miReaccion.tipo)?.emoji : '♡'}
          </button>
          {pickerAbierto && (
            <div className="reaccion-picker" style={{ position: 'absolute', right: 0, bottom: 36, background: 'var(--cream-2)',
              borderRadius: 100, border: '1px solid var(--line)', boxShadow: 'var(--shadow)', display: 'flex', gap: 4, padding: 8, zIndex: 20 }}>
              {REACCIONES.map(r => (
                <button key={r.tipo} onClick={() => { onReaccionar(pub, r.tipo); setPickerAbierto(false) }}
                  aria-label={r.label}
                  style={{ fontSize: 24, padding: 4, transition: 'transform .15s', lineHeight: 1 }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(1.3)'}>
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EntreNosotros({ publicaciones, quien, pareja, onReaccionar, onBorrar, onNuevo }) {
  // Guardar nombres para saber qué avatar usar
  if (pareja) { window.__n1 = pareja.nombre_1; window.__n2 = pareja.nombre_2 }

  return (
    <div>
      <div className="row between" style={{ marginBottom: 6, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700 }}>Entre nosotros</div>
          <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>Fotos, frases y pequeñas cosas que queremos guardar.</div>
        </div>
      </div>

      {publicaciones.length === 0 ? (
        <div className="center" style={{ padding: '50px 20px' }}>
          <div style={{ fontSize: 40, opacity: .5 }}>🌱</div>
          <h3 className="mt16">Este espacio todavía está en blanco</h3>
          <p className="sub mt8" style={{ maxWidth: 300, margin: '8px auto 0' }}>
            Suban una foto, compartan una frase o guarden algo que les haya hecho pensar en el otro.
          </p>
          <button className="btn btn-coral mt24" style={{ maxWidth: 260, margin: '24px auto 0' }} onClick={onNuevo}>
            Crear nuestra primera publicación
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18 }}>
          {publicaciones.map(pub => (
            <PostCard key={pub.id} pub={pub} quien={quien} onReaccionar={onReaccionar} onBorrar={onBorrar} />
          ))}
        </div>
      )}
    </div>
  )
}
