import React, { useState } from 'react'
import { StatusBar, BackBtn, gradFor } from '../components/UI'
import { subirFoto, guardarFotoPlan } from '../data/supabase'

const GRAD_CAT = {
  'Romántica': 'linear-gradient(160deg,#E08C6E,#8A4A3A)',
  'Aventura': 'linear-gradient(160deg,#3E6E52,#1A3524)',
  'Naturaleza': 'linear-gradient(160deg,#5E8A4A,#2C4A1A)',
  'Viaje': 'linear-gradient(160deg,#C98A4A,#6E3A1A)',
  'En casa': 'linear-gradient(160deg,#5A4A6E,#2C2636)',
  'default': 'linear-gradient(160deg,#7A5A4A,#3A2A22)',
}
const gradColor = (cat) => GRAD_CAT[cat] || GRAD_CAT.default

export default function PlanDetail({ plan, go, onReroll, onDone, fotoPlan, onFotoPlan }) {
  const [subiendo, setSubiendo] = useState(false)
  if (!plan) return null

  const info = [
    ['💸', plan.costo === 0 ? 'Gratis' : plan.costo_texto],
    ['⏱️', plan.duracion_texto],
    ['🌤️', plan.clima_ideal],
  ]

  const cambiarFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setSubiendo(true)
    const url = await subirFoto(file, 'planes')
    if (url) {
      await guardarFotoPlan(plan.id, url)
      onFotoPlan?.(plan.id, url)
    }
    setSubiendo(false)
  }

  const heroStyle = fotoPlan
    ? { height: 380, backgroundImage: `url("${fotoPlan}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { height: 380, background: gradColor(plan.categoria) }

  return (
    <div className="screen">
      <StatusBar dark />
      <div style={{ position: 'relative' }}>
        <div style={{ ...heroStyle, position: 'relative' }}>
          {/* Velo cinematográfico */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,15,12,.92) 4%, rgba(20,15,12,.25) 45%, rgba(0,0,0,.2) 100%)' }} />

          <div style={{ position: 'absolute', top: 56, left: 22, right: 22, zIndex: 2 }} className="row between">
            <BackBtn onClick={() => go('home')} />
            <label className="iconbtn" style={{ cursor: 'pointer' }} title="Cambiar foto">
              <span style={{ fontSize: 16 }}>{subiendo ? '⏳' : '📷'}</span>
              <input type="file" accept="image/*" onChange={cambiarFoto} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff', zIndex: 2 }}>
            <div style={{ fontSize: 40, marginBottom: 10, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }}>{plan.emoji}</div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.14em', color: 'rgba(255,255,255,.9)' }}>
              {plan.categoria.toUpperCase()}
            </div>
            <h1 style={{ color: '#fff', marginTop: 8, fontFamily: 'var(--serif)', fontSize: 30, lineHeight: 1.1,
              textShadow: '0 2px 16px rgba(0,0,0,.5)' }}>{plan.titulo}</h1>
          </div>
        </div>
      </div>

      <div className="pad" style={{ paddingTop: 22 }}>
        {/* Tarjetitas de info */}
        <div style={{ display: 'flex', gap: 8 }}>
          {info.map((it, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--cream-2)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{it[0]}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 700, marginTop: 5, lineHeight: 1.2 }}>{it[1]}</div>
            </div>
          ))}
        </div>

        <p className="sub mt24" style={{ fontSize: 14.5, lineHeight: 1.65 }}>{plan.descripcion}</p>

        <div className="row wrap mt16" style={{ gap: 8 }}>
          {plan.ideal_para.map((t, i) => <span key={i} className="chip" style={{ background: 'var(--peach)' }}>💑 {t}</span>)}
          <span className="chip" style={{ background: 'var(--sage)' }}>🌱 Aventura {plan.nivel_aventura}/5</span>
          {plan.es_local && <span className="chip" style={{ background: 'var(--lav)' }}>📍 Tucumán</span>}
        </div>

        {!fotoPlan && (
          <div className="sub mt16" style={{ fontSize: 12.5 }}>
            📷 Tocá la cámara arriba para ponerle una foto a este plan.
          </div>
        )}

        <button className="btn btn-coral mt24" onClick={onDone} style={{ borderRadius: 100, height: 54, fontSize: 15.5 }}>Vivimos esta experiencia ✨</button>
        <button className="btn btn-line mt12" onClick={onReroll} style={{ borderRadius: 100 }}>🎲 Otro plan</button>
      </div>
    </div>
  )
}
