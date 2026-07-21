import React, { useState, useEffect } from 'react'
import { planes } from './data/planes'
import { getPareja, guardarConfig, getRecuerdos, guardarRecuerdo, calcularRacha, supabase } from './data/supabase'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Explore from './screens/Explore'
import PlanDetail from './screens/PlanDetail'
import Completed from './screens/Completed'
import Memories from './screens/Memories'
import Profile from './screens/Profile'
import Capsule from './screens/Capsule'

const randomPlan = () => planes[Math.floor(Math.random() * planes.length)]

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [plan, setPlan] = useState(null)
  const [pareja, setPareja] = useState(null)
  const [recuerdos, setRecuerdos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [ultimoRecuerdo, setUltimoRecuerdo] = useState(null)

  // Al arrancar: cargar config + recuerdos desde Supabase
  useEffect(() => {
    (async () => {
      const [p, r] = await Promise.all([getPareja(), getRecuerdos()])
      setPareja(p)
      setRecuerdos(r)
      setCargando(false)
    })()
  }, [])

  // Cuando termina el splash y ya cargaron los datos, decidir a donde ir
  useEffect(() => {
    if (screen === 'splash' && !cargando) {
      const t = setTimeout(() => {
        setScreen(pareja?.onboarding_completo ? 'home' : 'onboarding')
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [screen, cargando, pareja])

  const done = recuerdos.length
  const streak = calcularRacha(recuerdos)
  const stats = { done, streak }

  const go = (s) => {
    if (s === 'surprise') { setPlan(randomPlan()); setScreen('plan'); return }
    setScreen(s)
  }
  const openPlan = (p) => { setPlan(p); setScreen('plan') }
  const reroll = () => setPlan(randomPlan())

  // Completar experiencia: guardar en Supabase
  const complete = async () => {
    const nuevo = await guardarRecuerdo({
      plan_id: plan.id, titulo: plan.titulo, categoria: plan.categoria, emoji: plan.emoji,
    })
    if (nuevo) {
      setUltimoRecuerdo(nuevo)
      setRecuerdos(prev => [nuevo, ...prev])
    }
    setScreen('completed')
  }

  // Guardar detalles (nota, cancion, mood) del ultimo recuerdo
  const saveDetails = async (detalles) => {
    if (ultimoRecuerdo) {
      await supabase.from('recuerdos').update(detalles).eq('id', ultimoRecuerdo.id)
      setRecuerdos(prev => prev.map(r => r.id === ultimoRecuerdo.id ? { ...r, ...detalles } : r))
    }
    setScreen('memories')
  }

  // Terminar onboarding: guardar config
  const finishOnboarding = async (cfg) => {
    await guardarConfig(cfg)
    setPareja(prev => ({ ...prev, ...cfg, onboarding_completo: true }))
    setScreen('home')
  }

  return (
    <div className="phone">
      <div className="notch" />
      {screen === 'splash' && <Splash />}
      {screen === 'onboarding' && <Onboarding onFinish={finishOnboarding} />}
      {screen === 'home' && <Home go={go} stats={stats} pareja={pareja} />}
      {screen === 'explore' && <Explore planes={planes} go={go} openPlan={openPlan} />}
      {screen === 'plan' && <PlanDetail plan={plan} go={go} onReroll={reroll} onDone={complete} />}
      {screen === 'completed' && <Completed chapter={done} go={go} onSave={saveDetails} />}
      {screen === 'memories' && <Memories go={go} recuerdos={recuerdos} />}
      {screen === 'profile' && <Profile go={go} doneCount={done} pareja={pareja} recuerdos={recuerdos} streak={streak} />}
      {screen === 'capsule' && <Capsule go={go} />}
    </div>
  )
}
