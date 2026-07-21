import React, { useState } from 'react'
import { StatusBar } from '../components/UI'

const tastes = [
  ['🌇', 'Románticas', 'g-coral'], ['🏔️', 'Aventura', 'g-sage'], ['🏠', 'En casa', 'g-warm'], ['🍽️', 'Comida', 'g-peach'],
  ['☕', 'Café', 'g-warm'], ['🎨', 'Arte', 'g-lav'], ['🎵', 'Música', 'g-lav'], ['🌿', 'Naturaleza', 'g-sage'],
  ['✈️', 'Viajes', 'g-sky'], ['🏃', 'Deporte', 'g-sky'], ['🆓', 'Gratis', 'g-coral'], ['💎', 'Premium', 'g-lav'],
]
const presupuestos = ['Gratis', 'Bajo', 'Medio', 'Alto']

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState([])
  const [budget, setBudget] = useState(1)
  const [aniversario, setAniversario] = useState('2023-03-12')
  const [ciudad, setCiudad] = useState('San Miguel de Tucumán')
  const [guardando, setGuardando] = useState(false)

  const toggle = (i) => setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  const last = step === 3

  const finalizar = async () => {
    setGuardando(true)
    await onFinish({
      aniversario,
      presupuesto: presupuestos[budget],
      ciudad,
      gustos: sel.map(i => tastes[i][1]),
    })
  }

  const Dots = () => (
    <div className="dots">{[0, 1, 2, 3].map(i => <i key={i} className={i === step ? 'on' : ''} />)}</div>
  )

  const Nav = () => (
    <div className="mt32">
      <Dots />
      <button className="btn btn-coral mt8" disabled={guardando}
        onClick={() => last ? finalizar() : setStep(step + 1)}>
        {guardando ? 'Guardando…' : (last ? 'Comenzar nuestra historia' : 'Continuar')}
      </button>
      {step > 0 && !guardando && <button className="btn btn-line mt12" onClick={() => setStep(step - 1)}>Atrás</button>}
    </div>
  )

  return (
    <div className="screen">
      <StatusBar />
      <div className="pad" key={step}>
        {step === 0 && (
          <div className="fade center" style={{ paddingTop: 40 }}>
            <div style={{ fontSize: 62 }}>📖</div>
            <h1 className="mt24">Cada cita<br />es un capítulo.</h1>
            <p className="sub mt16">Together no organiza tu vida. Los ayuda a vivirla y a guardar cada momento como parte de su historia.</p>
          </div>
        )}
        {step === 1 && (
          <div className="fade" style={{ paddingTop: 30 }}>
            <div className="eyebrow">Paso 2</div>
            <h1 className="mt12">Su aniversario</h1>
            <p className="sub mt12">Lo usamos para sorpresas y para su Cápsula del Tiempo.</p>
            <div className="card mt24" style={{ padding: 20 }}>
              <input type="date" value={aniversario} onChange={e => setAniversario(e.target.value)}
                style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 20, fontWeight: 700, background: 'transparent', width: '100%', color: 'var(--ink)' }} />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="fade" style={{ paddingTop: 30 }}>
            <div className="eyebrow">Paso 3</div>
            <h1 className="mt12">¿Qué los mueve?</h1>
            <p className="sub mt12">Elijan lo que les gusta. Ajustamos cada sugerencia a ustedes.</p>
            <div className="tgrid mt24">
              {tastes.map((t, i) => (
                <button key={i} className={'taste ' + t[2] + (sel.includes(i) ? ' sel' : '')} style={{ position: 'relative' }} onClick={() => toggle(i)}>
                  <span className="em">{t[0]}</span>{t[1]}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="fade" style={{ paddingTop: 30 }}>
            <div className="eyebrow">Paso 4</div>
            <h1 className="mt12">Presupuesto y ciudad</h1>
            <p className="sub mt12">Para no proponerles nada fuera de su alcance.</p>
            <div className="mt24" style={{ fontWeight: 700, marginBottom: 12 }}>Presupuesto típico por cita</div>
            <div className="seg">
              {presupuestos.map((b, i) => (
                <button key={i} className={budget === i ? 'on' : ''} onClick={() => setBudget(i)}>{b}</button>
              ))}
            </div>
            <div className="mt24" style={{ fontWeight: 700, marginBottom: 12 }}>Ciudad</div>
            <div className="card row" style={{ padding: 18 }}>
              <span style={{ fontSize: 22 }}>📍</span>
              <input value={ciudad} onChange={e => setCiudad(e.target.value)}
                style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 16, fontWeight: 700, background: 'transparent', flex: 1, color: 'var(--ink)' }} />
            </div>
          </div>
        )}
        <Nav />
      </div>
    </div>
  )
}
