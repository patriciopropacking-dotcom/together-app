import React, { useState, useEffect } from 'react'
import { planes } from './data/planes'
import {
  getPareja, guardarConfig, getRecuerdos, guardarRecuerdo,
  getGestos, guardarGesto, gestoHechoHoy, calcularRacha, supabase,
} from './data/supabase'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Explore from './screens/Explore'
import Reveal from './screens/Reveal'
import PlanDetail from './screens/PlanDetail'
import Completed from './screens/Completed'
import Memories from './screens/Memories'
import Profile from './screens/Profile'
import Capsule from './screens/Capsule'
import Gestos from './screens/Gestos'

const randomPlan = (recuerdos) => {
  // No repetir experiencias ya hechas, salvo que ya las hayan hecho todas
  const hechos = new Set(recuerdos.map(r => r.plan_id))
  const nuevos = planes.filter(p => !hechos.has(p.id))
  const pool = nuevos.length ? nuevos : planes
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [plan, setPlan] = useState(null)
  const [pareja, setPareja] = useState(null)
  const [recuerdos, setRecuerdos] = useState([])
  const [gestosHechos, setGestosHechos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [ultimoRecuerdo, setUltimoRecuerdo] = useState(null)

  // Cargar todo al arrancar
  useEffect(() => {
    (async () => {
      const [p, r, g] = await Promise.all([getPareja(), getRecuerdos(), getGestos()])
      setPareja(p)
      setRecuerdos(r)
      setGestosHechos(g)
      setCargando(false)
    })()
  }, [])

  // Splash: decidir destino
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
  const streakGestos = calcularRacha(gestosHechos)
  const hechoHoy = gestoHechoHoy(gestosHechos)
  const stats = { done, streak, streakGestos, hechoHoy, gestosTotal: gestosHechos.length }

  const go = (s) => {
    if (s === 'surprise') { setPlan(randomPlan(recuerdos)); setScreen('reveal'); return }
    setScreen(s)
  }
  const openPlan = (p) => { setPlan(p); setScreen('plan') }
  const reroll = () => { setPlan(randomPlan(recuerdos)); setScreen('reveal') }

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

  const saveDetails = async (detalles) => {
    if (ultimoRecuerdo) {
      await supabase.from('recuerdos').update(detalles).eq('id', ultimoRecuerdo.id)
      setRecuerdos(prev => prev.map(r => r.id === ultimoRecuerdo.id ? { ...r, ...detalles } : r))
    }
    setScreen('memories')
  }

  const completarGesto = async (gesto) => {
    const nuevo = await guardarGesto(gesto)
    if (nuevo) setGestosHechos(prev => [nuevo, ...prev])
  }

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
      {screen === 'reveal' && <Reveal plan={plan} onOpen={() => setScreen('plan')} />}
      {screen === 'plan' && <PlanDetail plan={plan} go={go} onReroll={reroll} onDone={complete} />}
      {screen === 'completed' && <Completed chapter={done} go={go} onSave={saveDetails} />}
      {screen === 'memories' && <Memories go={go} recuerdos={recuerdos} />}
      {screen === 'profile' && <Profile go={go} doneCount={done} pareja={pareja} recuerdos={recuerdos} streak={streak} gestosTotal={gestosHechos.length} />}
      {screen === 'capsule' && <Capsule go={go} />}
      {screen === 'gestos' && <Gestos go={go} gestosHechos={gestosHechos} hechoHoy={hechoHoy} onCompletar={completarGesto} />}
    </div>
  )
}
