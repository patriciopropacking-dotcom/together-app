import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

// Gradiente según categoría del plan
export const gradFor = (cat) => ({
  'Romántica':'g-coral','Aventura':'g-sage','En casa':'g-warm','Comida':'g-peach',
  'Café':'g-warm','Creatividad':'g-lav','Arte':'g-lav','Música':'g-lav',
  'Naturaleza':'g-sage','Viaje':'g-sky','Misión':'g-peach','Noche':'g-sky',
  'Crecimiento':'g-sage','Deporte':'g-sky','Espontánea':'g-coral','Ritual':'g-lav'
}[cat] || 'g-coral')

export function StatusBar({ dark }) {
  return (
    <div className={'statusbar' + (dark ? ' on-dark' : '')}>
      <span>9:41</span>
      <span style={{ letterSpacing: '2px' }}>􀙇 􀛨 􀛨</span>
    </div>
  )
}

export function Avatar({ grad = 'g-coral', size = 44, border = 0, foto = null, ampliable = false, nombre = '' }) {
  const [abierto, setAbierto] = React.useState(false)
  const style = {
    width: size, height: size,
    border: border ? `${border}px solid #fff` : 'none',
  }
  const contenido = foto
    ? <div className="avatar" style={{ ...style, backgroundImage: `url("${foto}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    : <div className={'avatar ' + grad} style={style} />

  if (!ampliable || !foto) return contenido

  // El visor se monta con Portal directo en el body, para ocupar toda la pantalla
  const visor = abierto && ReactDOM.createPortal(
    <div onClick={() => setAbierto(false)}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="avatar-zoom" style={{ width: 'min(80vw, 360px)', height: 'min(80vw, 360px)',
        borderRadius: '50%', backgroundImage: `url("${foto}")`, backgroundSize: 'cover', backgroundPosition: 'center',
        boxShadow: '0 20px 80px rgba(0,0,0,.7)', border: '4px solid rgba(255,255,255,.9)' }} />
      {nombre && <div style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, marginTop: 26 }}>{nombre}</div>}
      <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 13, marginTop: 10 }}>Tocá para cerrar</div>
    </div>,
    document.body
  )

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setAbierto(true) }} style={{ padding: 0, lineHeight: 0 }} aria-label={`Ver foto de ${nombre || 'perfil'}`}>
        {contenido}
      </button>
      {visor}
    </>
  )
}

export function BackBtn({ onClick }) {
  return (
    <button className="back" onClick={onClick} aria-label="Volver">
      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
  )
}

const icons = {
  home: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  explore: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>,
  mem: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M9 5v15" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>,
}

export function TabBar({ current, go }) {
  const Tab = ({ id, label, target }) => (
    <button className={'tab' + (current === target ? ' on' : '')} onClick={() => go(target)}>
      <svg viewBox="0 0 24 24">{icons[id]}</svg>
      <span>{label}</span>
    </button>
  )
  return (
    <div className="tabbar">
      <Tab id="home" label="Inicio" target="home" />
      <Tab id="explore" label="Explorar" target="explore" />
      <button className="tab dice" onClick={() => go('surprise')}>
        <div className="dc">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="8.5" cy="8.5" r="1.3" fill="#fff" stroke="none" />
            <circle cx="12" cy="12" r="1.3" fill="#fff" stroke="none" />
            <circle cx="15.5" cy="15.5" r="1.3" fill="#fff" stroke="none" />
          </svg>
        </div>
        <span>Sorpresa</span>
      </button>
      <Tab id="mem" label="Recuerdos" target="memories" />
      <Tab id="profile" label="Nosotros" target="profile" />
    </div>
  )
}

export function Confetti({ run }) {
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    if (!run) return
    const cols = ['#F0705A', '#F8A18C', '#B8A6E8', '#8FBF9F', '#C9D6E8', '#F6C8AE']
    const arr = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      bg: cols[i % cols.length],
      dur: 1.6 + Math.random() * 1.8,
      delay: Math.random() * 0.5,
    }))
    setPieces(arr)
  }, [run])
  if (!run) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} className="confetti"
          style={{ left: p.left + '%', background: p.bg, animationDuration: p.dur + 's', animationDelay: p.delay + 's' }} />
      ))}
    </div>
  )
}

// Gauge semicircular para estadísticas
export function Gauge({ value, max, label }) {
  const pct = Math.min(value / max, 1)
  const r = 78, cx = 90, cy = 90
  const circ = Math.PI * r
  const offset = circ * (1 - pct)
  return (
    <div className="gauge">
      <svg viewBox="0 0 180 100">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--line)" strokeWidth="12" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <defs>
          <linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F0705A" />
            <stop offset="100%" stopColor="#F8A18C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="val">
        <div className="n">{value}</div>
        <div className="l">{label}</div>
      </div>
    </div>
  )
}

// Número que sube contando desde 0 hasta el valor
export function NumeroAnimado({ valor, duracion = 1800, style }) {
  const [n, setN] = React.useState(0)
  React.useEffect(() => {
    const destino = Number(valor) || 0
    if (destino === 0) { setN(0); return }
    let inicio = null
    let raf
    const paso = (t) => {
      if (!inicio) inicio = t
      const prog = Math.min((t - inicio) / duracion, 1)
      // easing con leve overshoot: el número "duda", casi se pasa, y se asienta
      const eased = prog < 1
        ? 1 - Math.pow(1 - prog, 3) + Math.sin(prog * Math.PI) * 0.04
        : 1
      setN(Math.round(destino * Math.min(eased, 1.0)))
      if (prog < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [valor, duracion])
  return <span style={style}>{n}</span>
}

// Explosión de corazones que flotan hacia arriba desde un punto
export function CorazonesFloat({ run, cantidad = 8 }) {
  const [items, setItems] = React.useState([])
  React.useEffect(() => {
    if (!run) return
    const arr = Array.from({ length: cantidad }, (_, i) => ({
      id: Date.now() + i,
      left: 35 + Math.random() * 30,
      delay: Math.random() * 0.4,
      emoji: ['❤️', '💕', '💗', '💓'][i % 4],
    }))
    setItems(arr)
    const t = setTimeout(() => setItems([]), 2200)
    return () => clearTimeout(t)
  }, [run, cantidad])
  if (!items.length) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map(it => (
        <div key={it.id} className="corazon-float"
          style={{ left: it.left + '%', bottom: '30%', animationDelay: it.delay + 's' }}>
          {it.emoji}
        </div>
      ))}
    </div>
  )
}
