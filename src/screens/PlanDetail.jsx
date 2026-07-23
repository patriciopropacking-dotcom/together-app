import React, { useState } from 'react'
import { StatusBar, BackBtn, gradFor } from '../components/UI'
import { subirFoto, guardarFotoPlan } from '../data/supabase'

export default function PlanDetail({ plan, go, onReroll, onDone, fotoPlan, onFotoPlan }) {
  const [subiendo, setSubiendo] = useState(false)
  if (!plan) return null

  const info = [
    ['⏱️', 'Duración', plan.duracion_texto],
    ['💸', 'Costo', plan.costo_texto],
    ['📍', 'Distancia', plan.distancia_texto.split(' ')[0]],
    ['🌤️', 'Clima', plan.clima_ideal],
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
    ? { height: 420, backgroundImage: `linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,.05) 55%), url("${fotoPlan}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { height: 420 }

  return (
    <div className="screen">
      <StatusBar dark />
      <div style={{ position: 'relative' }}>
        <div className={'photo ' + (fotoPlan ? '' : gradFor(plan.categoria))} style={heroStyle}>
          <div style={{ position: 'absolute', top: 56, left: 22, right: 22 }} className="row between">
            <BackBtn onClick={() => go('home')} />
            <label className="iconbtn" style={{ cursor: 'pointer' }} title="Cambiar foto">
              <span style={{ fontSize: 16 }}>{subiendo ? '⏳' : '📷'}</span>
              <input type="file" accept="image/*" onChange={cambiarFoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ position: 'absolute', bottom: 26, left: 24, right: 24, color: '#fff' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{plan.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .95 }}>
              PLAN DEL DÍA · {plan.categoria.toUpperCase()}
            </div>
            <h1 style={{ color: '#fff', marginTop: 8, textShadow: fotoPlan ? '0 2px 14px rgba(0,0,0,.45)' : 'none' }}>{plan.titulo}</h1>
          </div>
        </div>
      </div>

      <div className="pad" style={{ paddingTop: 22 }}>
        <p className="sub">{plan.descripcion}</p>

        <div className="mt24" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {info.map((it, i) => (
            <div key={i} className="statbox">
              <div className="l">{it[0]} {it[1]}</div>
              <div className="n" style={{ fontSize: 17, marginTop: 4 }}>{it[2]}</div>
            </div>
          ))}
        </div>

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

        <button className="btn btn-coral mt24" onClick={onDone}>Lo hicimos ❤️</button>
        <button className="btn btn-ghost mt12">Guardar para después</button>
        <button className="btn btn-line mt12" onClick={onReroll}>🎲 Otro plan</button>
      </div>
    </div>
  )
}
