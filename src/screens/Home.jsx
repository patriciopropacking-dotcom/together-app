import React from 'react'
import { StatusBar, Avatar, TabBar } from '../components/UI'
import { AVATAR_1, AVATAR_2 } from '../data/avatares'

// Foto de fondo del Home. Cambiá esta URL por una foto de ustedes cuando quieras.
// Si la dejás vacía (''), usa un degradado oscuro elegante.
const FOTO_HOME = 'https://bvvpezjevwvwlunraacb.supabase.co/storage/v1/object/public/fotos/ddc071ac-8953-499f-b5ad-f1e1b53133c4.png'

export default function Home({ go, stats, pareja, quien }) {
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  const heroGrad = 'linear-gradient(to bottom, rgba(20,16,14,.12) 0%, rgba(20,16,14,.06) 40%, rgba(20,16,14,.55) 82%, var(--bg-1) 100%)'

  return (
    <div className="screen">
      <StatusBar dark />
      <div className="pad-tab" style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom,0px))' }}>

        {/* HERO estilo editorial: título arriba (cielo), foto grande al medio, botones abajo */}
        <div style={{ position: 'relative', minHeight: 560, overflow: 'hidden' }}>
          {/* Capa foto con Ken Burns */}
          {FOTO_HOME && (
            <div className="ken-burns" style={{ position: 'absolute', inset: 0, backgroundImage: `url("${FOTO_HOME}")`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
          )}
          {/* Degradado suave: deja ver la foto clara, solo oscurece los bordes para el texto */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1,
            background: FOTO_HOME
              ? 'linear-gradient(to bottom, rgba(20,16,14,.35) 0%, rgba(20,16,14,.05) 18%, rgba(20,16,14,0) 42%, rgba(20,16,14,0) 60%, rgba(20,16,14,.45) 80%, var(--bg-1) 100%)'
              : 'linear-gradient(160deg,#3A2A22,#2A211C 45%,var(--bg-1))' }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '58px 24px 26px', display: 'flex', flexDirection: 'column', minHeight: 560 }}>
            {/* Top bar */}
            <div className="row between fade d1">
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: '#fff' }}>Together ❤</div>
              <button onClick={() => go('profile')} className="pair respira">
                <Avatar grad="g-coral" size={40} border={2} foto={AVATAR_1} />
                <Avatar grad="g-lav" size={40} border={2} foto={AVATAR_2} />
              </button>
            </div>

            {/* Título sobre el cielo */}
            <div className="fade d2" style={{ marginTop: 22 }}>
              <h1 style={{ fontSize: 32, color: '#fff', lineHeight: 1.12, textShadow: '0 2px 18px rgba(0,0,0,.5)' }}>¿Qué recuerdo<br />van a crear hoy?</h1>
              <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 15, marginTop: 12, lineHeight: 1.5, textShadow: '0 1px 12px rgba(0,0,0,.5)' }}>
                Cada momento juntos,<br />se convierte en historia.
              </p>
            </div>

            {/* Empuja el botón y tarjetas al fondo del hero (sobre la parte oscura) */}
            <div style={{ flex: 1, minHeight: 90 }} />

            {/* Sorpréndenos */}
            <button className="btn btn-coral fade d3 pulso-coral brillo-recorre" onClick={() => go('surprise')}
              style={{ height: 62, borderRadius: 100, fontSize: 18, fontWeight: 800 }}>
              <span style={{ fontSize: 20 }}>✨</span> Sorpréndenos
            </button>

            {/* Gesto + Racha lado a lado */}
            <div className="row fade d4" style={{ gap: 12, marginTop: 14, alignItems: 'stretch' }}>
              <button onClick={() => go('gestos')}
                style={{ flex: 1, textAlign: 'left', background: 'rgba(46,37,31,.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--line)', borderRadius: 20, padding: 15 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>❤️ Gesto del día</div>
                <div className="sub" style={{ fontSize: 12.5, marginTop: 4 }}>
                  {stats.hechoHoy ? 'Cumplido ✓' : 'Tocá para verlo'}
                </div>
              </button>
              <div style={{ flex: 1, background: 'rgba(46,37,31,.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid var(--line)', borderRadius: 20, padding: 15 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}><span className="fuego">🔥</span> Racha actual</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, marginTop: 2 }}>
                  {stats.streak} <span style={{ fontSize: 14, fontFamily: 'var(--font)', color: 'var(--ink-2)' }}>días</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resto sobre fondo oscuro */}
        <div style={{ padding: '24px 24px 0' }}>

          {/* Frase */}
          <div className="fade center" style={{ padding: '4px 8px 22px' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)' }}>
              "Los mejores recuerdos<br />no se planean, se viven."
            </div>
          </div>

          {/* Próximo logro */}
          <div className="card fade" style={{ padding: 18 }}>
            <div className="row between" style={{ marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'var(--font)' }}>Próximo logro</h3>
              <span className="chip" style={{ background: 'var(--sage)' }}>{Math.max(0, 50 - stats.done)} restantes</span>
            </div>
            <div className="sub" style={{ fontSize: 13.5, marginBottom: 12 }}>Exploradores · 50 experiencias juntos</div>
            <div className="pbar"><i style={{ width: `${Math.min(100, (stats.done / 50) * 100)}%` }} /></div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--slate)', marginTop: 8, fontWeight: 700 }}>{stats.done} / 50</div>
          </div>

          {/* Cápsula del tiempo */}
          <button className="card fade mt16" style={{ width: '100%', textAlign: 'left', padding: 0, overflow: 'hidden' }} onClick={() => go('capsule')}>
            <div style={{ background: 'linear-gradient(135deg,#2C2636,#3A2A22)', padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', color: 'var(--coral)' }}>CÁPSULA DEL TIEMPO <span className="latido" style={{display:"inline-block"}}>⏳</span></div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginTop: 6, color: 'var(--ink)' }}>
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
