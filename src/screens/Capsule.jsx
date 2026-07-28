import React from 'react'
import { StatusBar, BackBtn } from '../components/UI'

export default function Capsule({ go }) {
  return (
    <div className="screen" style={{ background: 'linear-gradient(175deg,#2C2636,#1A1512 70%)' }}>
      <StatusBar />
      <div className="pad">
        <div className="row" style={{ marginTop: 4 }}><BackBtn onClick={() => go('home')} /></div>

        <div className="center mt24 fade">
          <div className="pop" style={{ fontSize: 60 }}>⏳</div>
          <div className="eyebrow mt16">Cápsula del tiempo</div>
          <h1 className="mt12">Hoy, hace un año…</h1>
        </div>

        <div className="card fade d2 mt24">
          <div className="photo g-coral" style={{ height: 220, display: 'flex', alignItems: 'flex-end', padding: 18 }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 40 }}>🌇</div>
              <h2 style={{ color: '#fff', marginTop: 6 }}>Atardecer en el dique</h2>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <p className="sub">"Nos quedamos hasta que se hizo de noche. No queríamos que terminara."</p>
            <div className="divider" />
            <div className="row" style={{ gap: 8 }}>
              <span className="chip">🎵 Canción de ese día</span>
              <span className="chip">😍</span>
            </div>
          </div>
        </div>

        <div className="center sub fade d3 mt24" style={{ fontSize: 14 }}>
          Cada experiencia que completan vuelve a ustedes exactamente un año después. ❤️
        </div>

        <button className="btn btn-coral fade d4 mt24" onClick={() => go('surprise')}>Vivir algo nuevo hoy</button>
      </div>
    </div>
  )
}
