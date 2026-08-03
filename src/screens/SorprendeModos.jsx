import React from 'react'
import { BackBtn } from '../components/UI'

export default function SorprendeModos({ go, onModo }) {
  return (
    <div className="screen sorpresa-bg" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Capas de profundidad del fondo */}
      <div className="sorpresa-glow" />
      <div className="sorpresa-particulas">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} className={'particula p' + i} />)}
      </div>

      {/* Cerrar */}
      <div style={{ position: 'absolute', top: 'calc(20px + env(safe-area-inset-top,0px))', left: 20, zIndex: 5 }}>
        <BackBtn onClick={() => go('home')} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 26px calc(30px + env(safe-area-inset-bottom,0px))' }}>

        {/* TÍTULO */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.18em', color: 'rgba(240,112,90,.9)', textTransform: 'uppercase' }}>Sorpresa</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: 1.2 }}>
            ¿Cómo elegimos hoy?
          </h1>
        </div>

        {/* DADO — protagonista mágico */}
        <div className="dado-wrap" style={{ margin: '30px 0 40px' }}>
          <div className="dado-halo" />
          <div className="dado-objeto">🎲</div>
        </div>

        {/* OPCIONES */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button onClick={() => onModo('pinta')} className="modo-card-premium">
            <div className="modo-icon-premium" style={{ background: 'linear-gradient(135deg,#5A3A2E,#3A2A22)' }}>🎯</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: '#fff' }}>¿Qué pinta hoy?</div>
              <div style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,.6)', lineHeight: 1.4 }}>Contanos qué ganas tienen y elegimos algo.</div>
            </div>
            <span style={{ color: 'var(--coral)', fontSize: 20 }}>→</span>
          </button>

          <button onClick={() => onModo('azar')} className="modo-card-premium">
            <div className="modo-icon-premium" style={{ background: 'linear-gradient(135deg,#4A3A5E,#2C2636)' }}>🎲</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: '#fff' }}>Elegí por nosotros</div>
              <div style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,.6)', lineHeight: 1.4 }}>Sin pensar demasiado. El azar decide.</div>
            </div>
            <span style={{ color: 'var(--coral)', fontSize: 20 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
