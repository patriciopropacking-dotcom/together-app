import React from 'react'
import { StatusBar, BackBtn, gradFor } from '../components/UI'

export default function PlanDetail({ plan, go, onReroll, onDone }) {
  if (!plan) return null
  const info = [
    ['⏱️', 'Duración', plan.duracion_texto],
    ['💸', 'Costo', plan.costo_texto],
    ['📍', 'Distancia', plan.distancia_texto.split(' ')[0]],
    ['🌤️', 'Clima', plan.clima_ideal],
  ]
  return (
    <div className="screen">
      <StatusBar dark />
      <div style={{ position: 'relative' }}>
        <div className={'photo ' + gradFor(plan.categoria)} style={{ height: 420 }}>
          <div style={{ position: 'absolute', top: 56, left: 22, right: 22 }} className="row between">
            <BackBtn onClick={() => go('home')} />
            <button className="iconbtn" aria-label="Guardar">
              <span style={{ fontSize: 18 }}>🤍</span>
            </button>
          </div>
          <div style={{ position: 'absolute', bottom: 26, left: 24, right: 24, color: '#fff' }}>
            <div style={{ fontSize: 46, marginBottom: 8 }}>{plan.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .95 }}>
              PLAN DEL DÍA · {plan.categoria.toUpperCase()}
            </div>
            <h1 style={{ color: '#fff', marginTop: 8 }}>{plan.titulo}</h1>
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

        <button className="btn btn-coral mt24" onClick={onDone}>Lo hicimos ❤️</button>
        <button className="btn btn-ghost mt12">Guardar para después</button>
        <button className="btn btn-line mt12" onClick={onReroll}>🎲 Otro plan</button>
      </div>
    </div>
  )
}
