import React from 'react'
import { StatusBar, Avatar, TabBar } from '../components/UI'

export default function Home({ go, stats }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">

        <div className="row between fade d1" style={{ marginTop: 4 }}>
          <div>
            <div className="chapter">Capítulo {stats.done + 1}</div>
            <h1 style={{ marginTop: 6 }}>Hola,<br />Luna &amp; Pato</h1>
          </div>
          <button onClick={() => go('profile')} className="pair">
            <Avatar grad="g-coral" size={44} border={3} />
            <Avatar grad="g-lav" size={44} border={3} />
          </button>
        </div>

        {/* Racha */}
        <div className="card fade d2 row mt24" style={{ padding: 16, background: 'var(--peach)' }}>
          <div style={{ fontSize: 32 }}>🔥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19 }}>{stats.streak} días de racha</div>
            <div className="sub" style={{ fontSize: 13.5 }}>No la rompan hoy — misión lista abajo</div>
          </div>
        </div>

        {/* Sorpréndenos — protagonista */}
        <div className="fade d3 center" style={{ margin: '30px 0 22px' }}>
          <div className="eyebrow">Tu plan, elegido por Together</div>
          <button className="btn btn-coral" onClick={() => go('surprise')}
            style={{ marginTop: 16, height: 184, borderRadius: 42, flexDirection: 'column', gap: 12, fontSize: 23, fontWeight: 800 }}>
            <span style={{ fontSize: 50 }}>🎲</span>
            Sorpréndenos
          </button>
          <div className="sub mt12" style={{ fontSize: 13.5 }}>Un toque. Una experiencia nueva.</div>
        </div>

        {/* Frase */}
        <div className="fade d4 center" style={{ padding: '6px 8px 20px', fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
          "Los mejores recuerdos<br />no se planean, se viven."
        </div>

        {/* Próximo logro */}
        <div className="card fade d5" style={{ padding: 18 }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <h3>Próximo logro</h3>
            <span className="chip" style={{ background: 'var(--sage)' }}>{50 - stats.done} restantes</span>
          </div>
          <div className="sub" style={{ fontSize: 13.5, marginBottom: 12 }}>Exploradores · 50 experiencias juntos</div>
          <div className="pbar"><i style={{ width: `${(stats.done / 50) * 100}%` }} /></div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--slate)', marginTop: 8, fontWeight: 700 }}>{stats.done} / 50</div>
        </div>

        {/* Cápsula del tiempo */}
        <button className="card fade d6 mt16" style={{ width: '100%', textAlign: 'left' }} onClick={() => go('capsule')}>
          <div className="photo g-lav" style={{ height: 148, display: 'flex', alignItems: 'flex-end', padding: 18 }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .95 }}>CÁPSULA DEL TIEMPO ⏳</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>Hace un año: atardecer en el dique</div>
            </div>
          </div>
        </button>

      </div>
      <TabBar current="home" go={go} />
    </div>
  )
}
