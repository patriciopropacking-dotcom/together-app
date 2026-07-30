import React, { useState } from 'react'
import { StatusBar, TabBar, gradFor, BackBtn } from '../components/UI'
import MapaRecuerdos from '../components/MapaRecuerdos'
import EntreNosotros from './EntreNosotros'

function fechaTexto(iso) {
  const d = new Date(iso)
  const hoy = new Date()
  const difDias = Math.floor((hoy - d) / 86400000)
  if (difDias <= 0) return 'Hoy'
  if (difDias === 1) return 'Ayer'
  if (difDias < 7) return `Hace ${difDias} días`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export default function Memories({ go, recuerdos, onEditar, publicaciones = [], quien, pareja, onReaccionar, onBorrarPub, onNuevaPub, conteosComentarios = {}, onHagamoslo, onConvertirPlan, onResponderPregunta, onFavorito, onFijar }) {
  const [tab, setTab] = useState(0)

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">
        <div className="row" style={{ marginTop: 4, marginBottom: 14 }}>
          <BackBtn onClick={() => go('home')} />
        </div>
        <div className="row between" style={{ marginBottom: 18 }}>
          <h1>Recuerdos</h1>
          <span className="chip" style={{ background: 'var(--peach)' }}>{recuerdos.length} capítulos</span>
        </div>
        <div className="seg" style={{ marginBottom: 24 }}>
          {['Historia', 'Mapa', 'Entre nosotros'].map((t, i) => (
            <button key={i} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {tab === 0 && (
          recuerdos.length === 0 ? (
            <div className="center" style={{ paddingTop: 50 }}>
              <div style={{ fontSize: 54 }}>📖</div>
              <h3 className="mt16">Su historia empieza acá</h3>
              <p className="sub mt8">Completen su primera experiencia y va a aparecer como el capítulo 1.</p>
              <button className="btn btn-coral mt24" onClick={() => go('surprise')}>🎲 Sorpréndenos</button>
            </div>
          ) : (
            <div className="timeline-v2">
              {recuerdos.map((r, i) => {
                const d = new Date(r.completado_en)
                const dia = d.getDate()
                const mes = d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '').toUpperCase()
                return (
                  <div key={r.id} className="tl2-item desliza-diario" style={{ animationDelay: `${Math.min(i * 0.08, 0.5)}s` }}>
                    {/* Fecha al costado */}
                    <div className="tl2-fecha">
                      <div className="tl2-dia">{dia}</div>
                      <div className="tl2-mes">{mes}</div>
                    </div>
                    {/* Punto en la línea */}
                    <div className="tl2-linea">
                      <div className="tl2-punto" />
                    </div>
                    {/* Contenido: título arriba + foto grande */}
                    <button className="tl2-card" onClick={() => onEditar?.(r)}>
                      <div className="tl2-titulo">{r.emoji} {r.titulo}</div>
                      <div className="tl2-foto"
                        style={r.foto_url
                          ? { backgroundImage: `url("${r.foto_url}")` }
                          : { background: 'var(--cream-2)' }}>
                        {!r.foto_url && <span style={{ fontSize: 40, opacity: .5 }}>{r.emoji}</span>}
                      </div>
                      {(r.lugar || r.nota) && (
                        <div className="tl2-meta">
                          {r.lugar && <span>📍 {r.lugar}</span>}
                          {r.nota && <span className="tl2-nota">"{r.nota}"</span>}
                        </div>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 1 && (
          <div className="card" style={{ overflow: 'hidden', padding: 12 }}>
            <MapaRecuerdos recuerdos={recuerdos} />
          </div>
        )}

        {tab === 2 && (
          <EntreNosotros
            publicaciones={publicaciones}
            quien={quien}
            pareja={pareja}
            onReaccionar={onReaccionar}
            onBorrar={onBorrarPub}
            onNuevo={onNuevaPub}
            conteos={conteosComentarios}
            onHagamoslo={onHagamoslo}
            onConvertirPlan={onConvertirPlan}
            onResponderPregunta={onResponderPregunta}
            onFavorito={onFavorito}
            onFijar={onFijar}
          />
        )}
      </div>
      {tab === 0 && recuerdos.length > 0 && (
        <button className="fab" onClick={() => go('surprise')} aria-label="Nuevo recuerdo">+</button>
      )}
      {tab === 2 && publicaciones.length > 0 && (
        <button className="fab" onClick={onNuevaPub} aria-label="Nueva publicación">+</button>
      )}
      <TabBar current="memories" go={go} />
    </div>
  )
}
