import React, { useState, useEffect } from 'react'
import { StatusBar, gradFor } from '../components/UI'

// Secuencia: sobre cerrado → se abre → carta girando → revela el plan
export default function Reveal({ plan, onOpen }) {
  const [fase, setFase] = useState('cerrado') // cerrado | abriendo | revelado

  const abrir = () => {
    if (navigator.vibrate) navigator.vibrate([14, 70, 26, 60, 40])
    setFase('abriendo')
    setTimeout(() => setFase('revelado'), 1250)
  }

  // Al revelar, esperar un momento y pasar al detalle
  useEffect(() => {
    if (fase === 'revelado') {
      const t = setTimeout(() => onOpen(), 1500)
      return () => clearTimeout(t)
    }
  }, [fase, onOpen])

  return (
    <div className="screen reveal-bg">
      <StatusBar />
      <div className="reveal-wrap">

        {fase === 'cerrado' && (
          <div className="center fade">
            <div className="eyebrow">Su plan de hoy</div>
            <h1 className="mt12" style={{ marginBottom: 34 }}>Un regalo<br />para ustedes</h1>
            <button className="gift" onClick={abrir} aria-label="Abrir">
              <div className="gift-box">
                <div className="gift-lid" />
                <div className="gift-ribbon" />
                <div className="gift-emoji">🎁</div>
              </div>
            </button>
            <div className="sub mt24">Tocá para abrir</div>
          </div>
        )}

        {fase === 'abriendo' && (
          <div className="center">
            <div className="gift-burst">
              <div className="gift-box opening">
                <div className="gift-lid flying" />
                <div className="gift-ribbon" />
                <div className="gift-emoji">🎁</div>
              </div>
              {[...Array(14)].map((_, i) => (
                <span key={i} className="spark" style={{
                  '--a': `${(360 / 14) * i}deg`,
                  animationDelay: `${i * 0.02}s`,
                  background: ['#F0705A', '#B8A6E8', '#8FBF9F', '#F6C8AE'][i % 4],
                }} />
              ))}
            </div>
          </div>
        )}

        {fase === 'revelado' && plan && (
          <div className="center card-flip">
            <div className={'reveal-card ' + gradFor(plan.categoria)}>
              <div className="reveal-emoji">{plan.emoji}</div>
              <div className="reveal-cat">{plan.categoria.toUpperCase()}</div>
              <div className="reveal-title">{plan.titulo}</div>
              <div className="reveal-meta">
                <span>{plan.duracion_texto}</span>
                <span>·</span>
                <span>{plan.costo_texto}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
