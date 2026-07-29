import React from 'react'
import { Avatar, TabBar } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'
import { proximoLogro } from '../data/logros'

const FOTO_HOME = 'https://bvvpezjevwvwlunraacb.supabase.co/storage/v1/object/public/fotos/ddc071ac-8953-499f-b5ad-f1e1b53133c4.png'

export default function Home({ go, stats, pareja, quien, recuerdos = [], gestos = [] }) {
  const proxLogro = proximoLogro({ recuerdos, gestos, racha: stats.streak })
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  // Glassmorphism: vidrio esmerilado, borde blanco 1px sutil, sombra mínima
  const glass = {
    background: 'rgba(40,32,27,.42)',
    backdropFilter: 'blur(22px) saturate(140%)',
    WebkitBackdropFilter: 'blur(22px) saturate(140%)',
    border: '1px solid rgba(255,255,255,.14)',
    boxShadow: '0 8px 30px rgba(0,0,0,.18)',
  }

  return (
    <div className="screen">
      <div className="pad-tab" style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom,0px))' }}>

        {/* ===== FOTO PROTAGONISTA (68% de pantalla, borde inferior curvo) ===== */}
        <div style={{ position: 'relative', height: '68vh', minHeight: 520, overflow: 'hidden',
          borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>

          {FOTO_HOME && (
            <div className="ken-burns" style={{ position: 'absolute', inset: 0,
              backgroundImage: `url("${FOTO_HOME}")`, backgroundSize: 'cover', backgroundPosition: 'center 62%', zIndex: 0 }} />
          )}

          {/* COLOR GRADING cálido tipo Airbnb: overlay beige/arena/coral desaturado */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, mixBlendMode: 'soft-light',
            background: 'linear-gradient(160deg, rgba(226,190,150,.55), rgba(224,140,110,.35) 60%, rgba(120,90,70,.4))' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, mixBlendMode: 'multiply',
            background: 'linear-gradient(180deg, rgba(60,45,38,.12), rgba(40,30,26,.22))' }} />

          {/* Degradado de legibilidad: leve arriba, más abajo hacia el borde */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(30,22,18,.42) 0%, rgba(30,22,18,.05) 22%, rgba(30,22,18,0) 50%, rgba(30,22,18,.35) 88%, rgba(30,22,18,.58) 100%)' }} />

          {/* Contenido sobre la foto */}
          <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', flexDirection: 'column',
            padding: '60px 26px 34px' }}>

            <div className="row between fade d1">
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '.01em' }}>Together ❤</div>
              <button onClick={() => go('profile')} className="pair respira">
                <Avatar grad="g-coral" size={42} border={2} foto={AVATAR_1} />
                <Avatar grad="g-lav" size={42} border={2} foto={AVATAR_2} />
              </button>
            </div>

            {/* Título editorial: más chico, mucho aire con el subtítulo */}
            <div className="fade d2" style={{ marginTop: 26 }}>
              <h1 style={{ fontSize: 30, color: '#fff', lineHeight: 1.14, fontWeight: 600,
                textShadow: '0 2px 22px rgba(0,0,0,.4)' }}>¿Qué recuerdo<br />van a crear hoy?</h1>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 14.5, marginTop: 20, lineHeight: 1.55,
                textShadow: '0 1px 14px rgba(0,0,0,.4)', maxWidth: 240 }}>
                Cada momento juntos,<br />se convierte en historia.
              </p>
            </div>

            <div style={{ flex: 1 }} />

            {/* BOTÓN SORPRÉNDENOS: ancho, alto, glow coral */}
            <button className="btn-sorprende fade d3 brillo-recorre" onClick={() => go('surprise')}>
              <span style={{ fontSize: 19 }}>✨</span>
              <span>Sorpréndenos</span>
            </button>
          </div>
        </div>

        {/* ===== CARDS FLOTANTES (glass), suben sobre el borde de la foto ===== */}
        <div style={{ padding: '0 20px', marginTop: -14, position: 'relative', zIndex: 5 }}>
          <div className="row fade d4" style={{ gap: 14, alignItems: 'stretch' }}>

            <button onClick={() => go('gestos')} style={{ ...glass, flex: 1, textAlign: 'left', borderRadius: 24, padding: '18px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>❤️ Gesto del día</div>
              <div style={{ fontSize: 12.5, marginTop: 6, color: 'rgba(255,255,255,.72)', lineHeight: 1.4 }}>
                {stats.hechoHoy ? 'Cumplido ✓' : 'Tocá para verlo'}
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff' }}>→</span>
              </div>
            </button>

            <div style={{ ...glass, flex: 1, borderRadius: 24, padding: '18px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}><span className="fuego">🔥</span> Racha actual</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 700, marginTop: 6, color: '#fff' }}>
                {stats.streak} <span style={{ fontSize: 15, fontFamily: 'var(--font)', color: 'rgba(255,255,255,.6)' }}>días</span>
              </div>
              {stats.comodinUsado ? (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 4, fontWeight: 700 }}>🛟 Comodín usado este mes</div>
              ) : (
                <div className="pbar" style={{ marginTop: 12, background: 'rgba(255,255,255,.18)' }}>
                  <i style={{ width: `${Math.min(100, (stats.streak / 30) * 100)}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Resto con mucho aire ===== */}
        <div style={{ padding: '40px 24px 0' }}>

          <div className="fade center" style={{ padding: '0 8px 34px' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, lineHeight: 1.5, color: 'var(--ink)' }}>
              "Los mejores recuerdos<br />no se planean, se viven."
            </div>
          </div>

          {proxLogro ? (
            <div className="card fade" style={{ padding: 20 }}>
              <div className="row between" style={{ marginBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font)' }}>Próximo logro</h3>
                <span className="chip" style={{ background: 'var(--sage)' }}>{proxLogro.meta - proxLogro.actual} para lograrlo</span>
              </div>
              <div className="row" style={{ gap: 12, marginBottom: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 30 }}>{proxLogro.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{proxLogro.titulo}</div>
                  <div className="sub" style={{ fontSize: 12.5 }}>{proxLogro.desc}</div>
                </div>
              </div>
              <div className="pbar"><i style={{ width: `${proxLogro.progreso * 100}%` }} /></div>
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--slate)', marginTop: 8, fontWeight: 700 }}>{proxLogro.actual} / {proxLogro.meta}</div>
            </div>
          ) : (
            <div className="card fade" style={{ padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font)' }}>🏆 ¡Completaron todos los logros!</h3>
              <div className="sub" style={{ fontSize: 13.5, marginTop: 6 }}>Son oficialmente inseparables.</div>
            </div>
          )}

          <button className="card fade mt16" style={{ width: '100%', textAlign: 'left', padding: 0, overflow: 'hidden' }} onClick={() => go('capsule')}>
            <div style={{ background: 'linear-gradient(135deg,#2C2636,#3A2A22)', padding: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: 'var(--coral)' }}>CÁPSULA DEL TIEMPO <span className="latido" style={{ display: 'inline-block' }}>⏳</span></div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginTop: 8, color: 'var(--ink)' }}>
                {stats.done > 0 ? 'Sus recuerdos vuelven en un año' : 'Todo lo que vivan hoy vuelve en un año'}
              </div>
            </div>
          </button>

        </div>
      </div>
      <TabBar current="home" go={go} />
    </div>
  )
}
