import React from 'react'
import { Avatar, BackBtn } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'

function tiempoRel(iso) {
  const d = new Date(iso)
  const min = Math.floor((new Date() - d) / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h}h`
  const dias = Math.floor(h / 24)
  if (dias < 7) return `hace ${dias}d`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

const ICONO = { comentario: '💬', reaccion: '❤️', publicacion: '✨' }

export default function Notificaciones({ notificaciones, pareja, go }) {
  const avatarDe = (autor) => {
    const n1 = pareja?.nombre_1 || 'Luna'
    return autor === n1 ? { foto: AVATAR_1, grad: 'g-coral' } : { foto: AVATAR_2, grad: 'g-lav' }
  }

  return (
    <div className="screen">
      <div className="pad pad-tab">
        <div className="row" style={{ marginTop: 4, marginBottom: 20, gap: 12, alignItems: 'center' }}>
          <BackBtn onClick={() => go('home')} />
          <h3>Novedades</h3>
        </div>

        {notificaciones.length === 0 ? (
          <div className="center" style={{ paddingTop: 60 }}>
            <div style={{ fontSize: 44, opacity: .5 }}>🔔</div>
            <h3 className="mt16">Todo al día</h3>
            <p className="sub mt8">Cuando tu pareja comente, reaccione o comparta algo, lo vas a ver acá.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notificaciones.map(n => {
              const av = avatarDe(n.autor)
              return (
                <button key={n.id} onClick={() => go('memories')} className="card"
                  style={{ padding: 14, textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar grad={av.grad} size={42} foto={av.foto} />
                    <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 15 }}>{ICONO[n.tipo]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700 }}>{n.autor}</span> {n.texto}
                    </div>
                    {n.detalle && <div className="sub" style={{ fontSize: 12.5, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{n.detalle}"</div>}
                    <div className="sub" style={{ fontSize: 11.5, marginTop: 3 }}>{tiempoRel(n.fecha)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
