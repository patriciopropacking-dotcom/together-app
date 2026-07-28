import React from 'react'
import { StatusBar } from '../components/UI'

export default function Splash() {
  return (
    <div className="screen" style={{
      background: 'linear-gradient(165deg,#2E251F,#241C17 55%,#1A1512)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
    }}>
      <StatusBar />
      <div className="pop" style={{ position: 'relative', width: 76, height: 76 }}>
        <div style={{ position: 'absolute', left: 0, top: 12, width: 52, height: 52, borderRadius: '50%', border: '3.5px solid var(--coral)' }} />
        <div style={{ position: 'absolute', right: 0, top: 12, width: 52, height: 52, borderRadius: '50%', border: '3.5px solid var(--ink)' }} />
      </div>
      <div className="fade d3" style={{ marginTop: 26, fontSize: 30, fontWeight: 800, letterSpacing: '-.02em' }}>Together</div>
      <div className="fade d4 sub" style={{ marginTop: 8 }}>Escriban su historia, juntos.</div>
    </div>
  )
}
