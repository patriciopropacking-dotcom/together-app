import React from 'react'
import { StatusBar, Avatar, TabBar } from '../components/UI'

export default function Home({ go, stats, pareja, quien }) {
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'
  return (
    <div className="screen">
      <StatusBar />
      <div className="pad pad-tab">

        <div className="row between fade d1" style={{ marginTop: 4 }}>
          <div>
            <div className="chapter">Capítulo {stats.done + 1}</div>
            <h1 style={{ marginTop: 6 }}>Hola,<br />{n1} &amp; {n2}</h1>
          </div>
          <button onClick={() => go('profile')} className="pair">
            <Avatar grad="g-coral" size={44} border={3} />
            <Avatar grad="g-lav" size={44} border={3} />
          </button>
        </div>

        {/* Racha */}
        <div className="card fade d2 row mt24" style={{ padding: 16, background: 'var(--peach)' }}>
          <div style={{ fontSize: 32 }}>{stats.streak > 0 ? '🔥' : '✨'}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19 }}>
              {stats.streak > 0 ? `${stats.streak} ${stats.streak === 1 ? 'día' : 'días'} de racha` : 'Empiecen su racha'}
            </div>
            <div className="sub" style={{ fontSize: 13.5 }}>
              {stats.streak > 0 ? 'No la rompan hoy — vivan algo nuevo' : 'Completen una experiencia hoy'}
            </div>
          </div>
        </div>

        {/* Sorpréndenos — protagonista */}
        <div className="fade d3 center" style={{ margin: '30px 0 22px' }}>
          <div className="eyebrow">Tu plan, elegido por Together</div>
          <button className="btn btn-coral" onClick={() => go('surprise')}
            style={{ marginTop: 16, height: 184, borderRadius: 42, flexDirection: 'column', gap: 12, fontSize: 23, fontWeight: 800 }}>
            <span style={{ fontSize: 50 }}>🎲</span>
            Sorpréndenos
          </button>
          <div className="sub mt12" style={{ fontSize: 13.5 }}>Un toque. Una experiencia nueva.</div>
        </div>

        {/* Pequeños Gestos */}
        <button className="card fade d4 mt16" style={{ width: '100%', textAlign: 'left', padding: 18, background: stats.hechoHoy ? 'var(--sage)' : 'var(--white)' }}
          onClick={() => go('gestos')}>
          <div className="row">
            <div style={{ fontSize: 30 }}>{stats.hechoHoy ? '✅' : '❤️'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16.5 }}>
                {stats.hechoHoy ? 'Gesto de hoy cumplido' : 'Pequeño gesto de hoy'}
              </div>
              <div className="sub" style={{ fontSize: 13.5, marginTop: 2 }}>
                {stats.hechoHoy
                  ? `${stats.streakGestos} ${stats.streakGestos === 1 ? 'día' : 'días'} seguidos`
                  : 'Dos minutos. Sin salir de casa.'}
              </div>
            </div>
            <div style={{ color: 'var(--slate)', fontSize: 20 }}>›</div>
          </div>
        </button>

        {/* Frase */}
        <div className="fade d4 center" style={{ padding: '6px 8px 20px', fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
          "Los mejores recuerdos<br />no se planean, se viven."
        </div>

        {/* Próximo logro */}
        <div className="card fade d5" style={{ padding: 18 }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <h3>Próximo logro</h3>
            <span className="chip" style={{ background: 'var(--sage)' }}>{50 - stats.done} restantes</span>
          </div>
          <div className="sub" style={{ fontSize: 13.5, marginBottom: 12 }}>Exploradores · 50 experiencias juntos</div>
          <div className="pbar"><i style={{ width: `${(stats.done / 50) * 100}%` }} /></div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--slate)', marginTop: 8, fontWeight: 700 }}>{stats.done} / 50</div>
        </div>

        {/* Cápsula del tiempo */}
        <button className="card fade d6 mt16" style={{ width: '100%', textAlign: 'left' }} onClick={() => go('capsule')}>
          <div className="photo g-lav" style={{ height: 148, display: 'flex', alignItems: 'flex-end', padding: 18 }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', opacity: .95 }}>CÁPSULA DEL TIEMPO ⏳</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                {stats.done > 0 ? 'Sus recuerdos vuelven en un año' : 'Todo lo que vivan hoy vuelve en un año'}
              </div>
            </div>
          </div>
        </button>

      </div>
      <TabBar current="home" go={go} />
    </div>
  )
}
