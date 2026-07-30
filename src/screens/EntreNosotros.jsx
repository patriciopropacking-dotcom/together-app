import React, { useState } from 'react'
import { Avatar } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'
import Comentarios from './Comentarios'

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

function PostCard({ pub, quien, onReaccionar, onBorrar, conteoInicial = 0, onHagamoslo, onConvertirPlan, onResponderPregunta, onFavorito, onFijar }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [pickerAbierto, setPickerAbierto] = useState(false)
  const [comentariosAbiertos, setComentariosAbiertos] = useState(false)
  const [conteoComentarios, setConteoComentarios] = useState(conteoInicial)
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

      {pub.tipo === 'song' && (() => {
        const s = pub.extra?.cancion || {}
        return (
          <div style={{ background: 'var(--cream-2)', borderRadius: 16, padding: 16 }}>
            <div className="row" style={{ gap: 14, alignItems: 'center' }}>
              <div style={{ width: 58, height: 58, borderRadius: 12, background: 'linear-gradient(135deg,#4A3A5E,#2C2636)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🎵</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.titulo}</div>
                <div className="sub" style={{ fontSize: 13 }}>{s.artista}</div>
                {s.link && <a href={s.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 700 }}>Escuchar →</a>}
              </div>
            </div>
            {s.dedicatoria && <p style={{ fontStyle: 'italic', fontSize: 14, marginTop: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>"{s.dedicatoria}"</p>}
          </div>
        )
      })()}

      {pub.tipo === 'plan' && (() => {
        const pl = pub.extra?.plan || {}
        const aceptado = pub.extra?.aceptado_por || []
        const ambos = aceptado.length >= 2
        const yoAcepte = aceptado.includes(quien)
        return (
          <div>
            {pub.foto_url && <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
              <img src={pub.foto_url} alt="" style={{ width: '100%', display: 'block' }} /></div>}
            <div className="row" style={{ gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', color: 'var(--coral)' }}>✨ PARA HACER JUNTOS</span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700 }}>{pl.titulo}</div>
            {pub.texto && <p style={{ fontSize: 14, marginTop: 6, color: 'var(--ink-2)', lineHeight: 1.5 }}>{pub.texto}</p>}
            <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
              {pl.lugar && <span className="chip" style={{ fontSize: 11 }}>📍 {pl.lugar}</span>}
              {pl.presupuesto && <span className="chip" style={{ fontSize: 11 }}>💸 {pl.presupuesto}</span>}
            </div>
            {ambos ? (
              <div className="card mt12" style={{ padding: 14, background: 'var(--sage)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Los dos quieren hacer este plan ❤️</div>
                <button className="btn btn-coral mt12" style={{ height: 42, fontSize: 14 }}
                  onClick={() => onConvertirPlan?.(pub)}>Convertir en experiencia pendiente</button>
              </div>
            ) : (
              <button className="btn mt12" onClick={() => onHagamoslo?.(pub)}
                style={{ height: 46, fontSize: 14, background: yoAcepte ? 'var(--sage)' : 'var(--coral)', color: yoAcepte ? 'var(--ink)' : '#fff' }}>
                {yoAcepte ? '✓ Dijiste que sí · esperando al otro' : 'Hagámoslo ✨'}
              </button>
            )}
          </div>
        )
      })()}

      {pub.tipo === 'question' && (() => {
        const respuestas = pub.extra?.respuestas || []
        const yoRespondi = respuestas.find(r => r.autor === quien)
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#3E5245,#26302A)', borderRadius: 16, padding: '32px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', color: 'rgba(255,255,255,.7)', marginBottom: 10 }}>❓ PREGUNTA</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{pub.texto}</div>
            </div>
            {respuestas.map((r, i) => (
              <div key={i} className="card mt12" style={{ padding: 14, background: 'var(--cream-2)' }}>
                <div style={{ fontWeight: 700, fontSize: 12.5 }}>{r.autor} respondió</div>
                <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>{r.texto}</div>
              </div>
            ))}
            {!yoRespondi && (
              <button className="btn btn-line mt12" style={{ height: 44, fontSize: 14 }} onClick={() => onResponderPregunta?.(pub)}>
                Responder
              </button>
            )}
          </div>
        )
      })()}

      {pub.tipo === 'locked' && (() => {
        const fecha = pub.extra?.desbloquea_en
        const desbloqueada = fecha && new Date(fecha) <= new Date()
        const soyAutor = pub.autor === quien
        const fechaBonita = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
        // Si no está desbloqueada y no soy el autor: mostrar solo el aviso
        if (!desbloqueada && !soyAutor) {
          return (
            <div style={{ background: 'linear-gradient(135deg,#3A2A22,#2C2636)', borderRadius: 16, padding: '36px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 44 }}>🔒</div>
              <div style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, marginTop: 12 }}>
                {pub.autor} dejó algo para que abras más adelante
              </div>
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, marginTop: 8 }}>Se abre el {fechaBonita}</div>
            </div>
          )
        }
        // Desbloqueada o soy el autor: mostrar contenido
        return (
          <div style={{ background: desbloqueada ? 'var(--cream-2)' : 'linear-gradient(135deg,#3A2A22,#2C2636)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', color: desbloqueada ? 'var(--coral)' : 'rgba(255,255,255,.7)', marginBottom: 10 }}>
              {desbloqueada ? '🔓 SE ABRIÓ' : `🔒 GUARDADA · se abre el ${fechaBonita}`}
            </div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: desbloqueada ? 'var(--ink)' : 'rgba(255,255,255,.85)' }}>{pub.texto}</p>
            {soyAutor && !desbloqueada && <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11.5, marginTop: 10, fontStyle: 'italic' }}>Solo vos ves esto hasta la fecha. Tu pareja ve el sobre cerrado.</div>}
          </div>
        )
      })()}

      {/* Etiquetas de fijado/favorito */}
      {(() => {
        const fijadoDe = pub.fijado_de || []
        const favDe = pub.favorito_de || []
        if (!fijadoDe.length && favDe.length < 2) return null
        return (
          <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {fijadoDe.length > 0 && <span className="chip" style={{ fontSize: 11, background: 'var(--peach)' }}>📌 Fijado</span>}
            {favDe.length >= 2 && <span className="chip" style={{ fontSize: 11, background: 'var(--coral)', color: '#fff' }}>⭐ Favorito de ambos</span>}
          </div>
        )
      })()}

      {/* Reacciones y acciones */}
      <div className="row between" style={{ marginTop: 14, alignItems: 'center' }}>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(conteo).map(([tipo, n]) => {
            const r = REACCIONES.find(x => x.tipo === tipo)
            return <span key={tipo} className="chip" style={{ fontSize: 12, padding: '5px 10px' }}>{r?.emoji} {n}</span>
          })}
          <button onClick={() => setComentariosAbiertos(!comentariosAbiertos)}
            className="sub" style={{ fontSize: 12.5, fontWeight: 700, padding: '4px 6px' }}>
            💬 {conteoComentarios > 0 ? conteoComentarios : ''} {conteoComentarios === 1 ? 'comentario' : conteoComentarios > 1 ? 'comentarios' : 'Comentar'}
          </button>
        </div>
        <div className="row" style={{ gap: 2, alignItems: 'center' }}>
          {/* Favorito */}
          <button onClick={() => onFavorito?.(pub)} aria-label="Guardar como favorito"
            style={{ fontSize: 17, padding: '4px 6px', color: (pub.favorito_de || []).includes(quien) ? 'var(--coral)' : 'var(--ink-2)' }}>
            {(pub.favorito_de || []).includes(quien) ? '★' : '☆'}
          </button>
          {/* Fijar */}
          <button onClick={() => onFijar?.(pub)} aria-label="Fijar"
            style={{ fontSize: 15, padding: '4px 6px', opacity: (pub.fijado_de || []).includes(quien) ? 1 : .4 }}>
            📌
          </button>
          {/* Reaccionar */}
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

      {/* Hilo de comentarios */}
      {comentariosAbiertos && (
        <Comentarios publicacionId={pub.id} quien={quien}
          onCambioConteo={(id, delta) => setConteoComentarios(c => Math.max(0, c + delta))} />
      )}
    </div>
  )
}

export default function EntreNosotros({ publicaciones, quien, pareja, onReaccionar, onBorrar, onNuevo, conteos = {}, onHagamoslo, onConvertirPlan, onResponderPregunta, onFavorito, onFijar }) {
  // Guardar nombres para saber qué avatar usar
  if (pareja) { window.__n1 = pareja.nombre_1; window.__n2 = pareja.nombre_2 }

  const [vista, setVista] = useState('feed') // feed | albumes | resumen
  const [albumActivo, setAlbumActivo] = useState(null)

  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  // Álbumes automáticos: agrupan las publicaciones por criterios
  const ALBUMES = [
    { id: 'fotos', titulo: 'Fotos', emoji: '📷', filtro: p => p.tipo === 'photo' || p.tipo === 'moment' },
    { id: 'frases', titulo: 'Frases', emoji: '💬', filtro: p => p.tipo === 'quote' },
    { id: 'cartas', titulo: 'Cartas', emoji: '✉️', filtro: p => p.tipo === 'letter' },
    { id: 'canciones', titulo: 'Canciones', emoji: '🎵', filtro: p => p.tipo === 'song' },
    { id: 'planes', titulo: 'Para hacer', emoji: '✨', filtro: p => p.tipo === 'plan' },
    { id: 'n1', titulo: `De ${n1}`, emoji: '💗', filtro: p => p.autor === n1 },
    { id: 'n2', titulo: `De ${n2}`, emoji: '💙', filtro: p => p.autor === n2 },
    { id: 'favoritos', titulo: 'Favoritos', emoji: '⭐', filtro: p => (p.favorito_de || []).length >= 2 },
  ].map(a => ({ ...a, items: publicaciones.filter(a.filtro) })).filter(a => a.items.length > 0)

  // "Hace 6 meses / hace un año": buscar una publicación de ~6 o ~12 meses atrás (±5 días)
  const recuerdoDelPasado = (() => {
    const hoy = new Date()
    for (const meses of [12, 6]) {
      const objetivo = new Date(hoy); objetivo.setMonth(objetivo.getMonth() - meses)
      const match = publicaciones.find(p => {
        const d = new Date(p.creado_en)
        return Math.abs((d - objetivo) / 86400000) <= 5
      })
      if (match) return { pub: match, meses }
    }
    return null
  })()

  // Resumen del mes actual
  const resumenMes = (() => {
    const hoy = new Date()
    const mes = hoy.getMonth(); const anio = hoy.getFullYear()
    const delMes = publicaciones.filter(p => {
      const d = new Date(p.creado_en); return d.getMonth() === mes && d.getFullYear() === anio
    })
    const nombreMes = hoy.toLocaleDateString('es-AR', { month: 'long' })
    return {
      nombreMes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      total: delMes.length,
      fotos: delMes.filter(p => p.tipo === 'photo').length,
      canciones: delMes.filter(p => p.tipo === 'song').length,
      cartas: delMes.filter(p => p.tipo === 'letter').length,
      planes: delMes.filter(p => p.tipo === 'plan').length,
      comentarios: delMes.reduce((s, p) => s + (conteos[p.id] || 0), 0),
    }
  })()

  const renderPost = (pub) => (
    <PostCard key={pub.id} pub={pub} quien={quien} onReaccionar={onReaccionar} onBorrar={onBorrar} conteoInicial={conteos[pub.id] || 0}
      onHagamoslo={onHagamoslo} onConvertirPlan={onConvertirPlan} onResponderPregunta={onResponderPregunta}
      onFavorito={onFavorito} onFijar={onFijar} />
  )

  return (
    <div>
      <div className="row between" style={{ marginBottom: 14, alignItems: 'flex-end' }}>
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
        <>
          {/* Selector de vista */}
          <div className="seg" style={{ marginBottom: 18 }}>
            {[['feed', 'Feed'], ['albumes', 'Álbumes'], ['resumen', 'Resumen']].map(([v, l]) => (
              <button key={v} className={vista === v ? 'on' : ''} onClick={() => { setVista(v); setAlbumActivo(null) }}>{l}</button>
            ))}
          </div>

          {/* FEED */}
          {vista === 'feed' && (
            <>
              {/* Recuerdo del pasado */}
              {recuerdoDelPasado && (
                <div className="card fade" style={{ padding: 16, marginBottom: 18, background: 'linear-gradient(135deg, rgba(240,112,90,.14), rgba(240,112,90,.05))', border: '1px solid rgba(240,112,90,.3)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--coral)', letterSpacing: '.05em' }}>
                    ⏳ HACE {recuerdoDelPasado.meses === 12 ? 'UN AÑO' : '6 MESES'}
                  </div>
                  <div className="sub" style={{ fontSize: 13, marginTop: 4 }}>Este día compartían esto:</div>
                  <div style={{ marginTop: 10 }}>{renderPost(recuerdoDelPasado.pub)}</div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {publicaciones.map(renderPost)}
              </div>
            </>
          )}

          {/* ÁLBUMES */}
          {vista === 'albumes' && (
            albumActivo ? (
              <div>
                <button onClick={() => setAlbumActivo(null)} className="sub" style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>← Álbumes</button>
                <h3 style={{ marginBottom: 16 }}>{albumActivo.emoji} {albumActivo.titulo}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {albumActivo.items.map(renderPost)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {ALBUMES.map(a => (
                  <button key={a.id} onClick={() => setAlbumActivo(a)} className="card" style={{ padding: 20, textAlign: 'left' }}>
                    <div style={{ fontSize: 32 }}>{a.emoji}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{a.titulo}</div>
                    <div className="sub" style={{ fontSize: 12.5, marginTop: 2 }}>{a.items.length} {a.items.length === 1 ? 'publicación' : 'publicaciones'}</div>
                  </button>
                ))}
              </div>
            )
          )}

          {/* RESUMEN */}
          {vista === 'resumen' && (
            <div className="card fade" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg,#3A2A22,#2C2636)', padding: '30px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', color: 'var(--coral)' }}>SU MES</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 6 }}>{resumenMes.nombreMes} juntos</div>
              </div>
              <div style={{ padding: 24 }}>
                {resumenMes.total === 0 ? (
                  <p className="sub center">Todavía no publicaron nada este mes. ¡Arranquen!</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[['📝', resumenMes.total, 'publicaciones'], ['💬', resumenMes.comentarios, 'comentarios'],
                      ['📷', resumenMes.fotos, 'fotos'], ['🎵', resumenMes.canciones, 'canciones'],
                      ['✉️', resumenMes.cartas, 'cartas'], ['✨', resumenMes.planes, 'planes']].map(([e, n, l], i) => (
                      <div key={i} className="center" style={{ background: 'var(--cream-2)', borderRadius: 16, padding: '18px 12px' }}>
                        <div style={{ fontSize: 24 }}>{e}</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, marginTop: 4 }}>{n}</div>
                        <div className="sub" style={{ fontSize: 12 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
