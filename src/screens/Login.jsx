import React, { useState } from 'react'
import { StatusBar } from '../components/UI'

// Login simple: elegís quién sos. Los datos son compartidos entre los dos.
export default function Login({ pareja, onElegir }) {
  const [eligiendo, setEligiendo] = useState(null)
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  const elegir = (nombre) => {
    setEligiendo(nombre)
    if (navigator.vibrate) navigator.vibrate(12)
    setTimeout(() => onElegir(nombre), 260)
  }

  const Card = ({ nombre, grad }) => (
    <button
      onClick={() => elegir(nombre)}
      className="card"
      style={{
        width: '100%', padding: 0, overflow: 'hidden', textAlign: 'center',
        transform: eligiendo === nombre ? 'scale(.96)' : 'scale(1)',
        transition: 'transform .2s', opacity: eligiendo && eligiendo !== nombre ? .4 : 1,
      }}>
      <div className={grad} style={{ height: 118, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,.6)',
        }}>
          {nombre.charAt(0).toUpperCase()}
        </div>
      </div>
      <div style={{ padding: '16px 12px 18px', fontWeight: 800, fontSize: 18 }}>{nombre}</div>
    </button>
  )

  return (
    <div className="screen" style={{ background: 'linear-gradient(170deg,#FCEDE7,#EAE4F5)' }}>
      <StatusBar />
      <div className="pad" style={{ paddingTop: 90 }}>
        <div className="center fade">
          <div style={{ fontSize: 52 }}>👋</div>
          <h1 className="mt16">¿Quién sos?</h1>
          <p className="sub mt12">Para saber quién escribió cada capítulo.</p>
        </div>

        <div className="mt32" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="fade d2"><Card nombre={n1} grad="g-coral" /></div>
          <div className="fade d3"><Card nombre={n2} grad="g-lav" /></div>
        </div>

        <div className="center sub fade d4 mt32" style={{ fontSize: 13 }}>
          Comparten la misma historia.<br />Lo que uno guarda, el otro lo ve.
        </div>
      </div>
    </div>
  )
}
