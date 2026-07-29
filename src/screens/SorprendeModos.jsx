import React from 'react'
import { BackBtn } from '../components/UI'

// Bottom sheet elegante con los dos modos de Sorpréndenos
export default function SorprendeModos({ go, onModo }) {
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Fondo tocable para cerrar */}
      <button onClick={() => go('home')} aria-label="Cerrar"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 0 }} />

      <div className="sheet-up" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-1)',
        borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '14px 22px calc(40px + env(safe-area-inset-bottom,0px))',
        boxShadow: '0 -20px 60px rgba(0,0,0,.5)' }}>

        <div style={{ width: 42, height: 5, borderRadius: 3, background: 'var(--line)', margin: '0 auto 22px' }} />

        <h2 style={{ textAlign: 'center', marginBottom: 6 }}>¿Cómo elegimos hoy?</h2>
        <p className="sub center" style={{ marginBottom: 26 }}>Dos formas de encontrar su próximo plan.</p>

        {/* Opción A: ¿Qué pinta hoy? */}
        <button onClick={() => onModo('pinta')} className="modo-card" style={{ marginBottom: 14 }}>
          <div className="modo-icon" style={{ background: 'linear-gradient(135deg,#3A2A22,#5A3A2E)' }}>🎯</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>¿Qué pinta hoy?</div>
            <div className="sub" style={{ fontSize: 13, marginTop: 3 }}>Contanos qué ganas tienen y elegimos algo para ustedes.</div>
          </div>
          <span style={{ color: 'var(--coral)', fontSize: 20 }}>→</span>
        </button>

        {/* Opción B: Elegí por nosotros */}
        <button onClick={() => onModo('azar')} className="modo-card">
          <div className="modo-icon" style={{ background: 'linear-gradient(135deg,#2C2636,#4A3A5E)' }}>🎲</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Elegí por nosotros</div>
            <div className="sub" style={{ fontSize: 13, marginTop: 3 }}>Sin pensar demasiado. El azar decide el plan.</div>
          </div>
          <span style={{ color: 'var(--coral)', fontSize: 20 }}>→</span>
        </button>
      </div>
    </div>
  )
}
