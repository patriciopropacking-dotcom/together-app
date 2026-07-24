import React, { useState, useEffect } from 'react'
import { planes } from './data/planes'
import {
  getPareja, guardarConfig, getRecuerdos, guardarRecuerdo,
  getGestos, guardarGesto, gestoHechoHoy, calcularRacha,
  getPlanFotos, actualizarRecuerdo, borrarRecuerdo, supabase,
} from './data/supabase'
import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Login from './screens/Login'
import Home from './screens/Home'
import Explore from './screens/Explore'
import Reveal from './screens/Reveal'
import PlanDetail from './screens/PlanDetail'
import Completed from './screens/Completed'
import Memories from './screens/Memories'
import Profile from './screens/Profile'
import Capsule from './screens/Capsule'
import Gestos from './screens/Gestos'
import EditarRecuerdo from './screens/EditarRecuerdo'

const randomPlan = (recuerdos) => {
  const hechos = new Set(recuerdos.map(r => r.plan_id))
  const nuevos = planes.filter(p => !hechos.has(p.id))
  const pool = nuevos.length ? nuevos : planes
  return pool[Math.floor(Math.random() * pool.length)]
}

const QUIEN = 'together_quien'

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [plan, setPlan] = useState(null)
  const [pareja, setPareja] = useState(null)
  const [recuerdos, setRecuerdos] = useState([])
  const [gestosHechos, setGestosHechos] = useState([])
  const [planFotos, setPlanFotos] = useState({})
  const [cargando, setCargando] = useState(true)
  const [ultimoRecuerdo, setUltimoRecuerdo] = useState(null)
  const [editando, setEditando] = useState(null)
  const [quien, setQuien] = useState(() => {
    try { return localStorage.getItem(QUIEN) } catch (e) { return null }
  })

  // Cargar todo al arrancar
  useEffect(() => {
    (async () => {
      const [p, r, g, f] = await Promise.all([getPareja(), getRecuerdos(), getGestos(), getPlanFotos()])
      setPareja(p); setRecuerdos(r); setGestosHechos(g); setPlanFotos(f)
      setCargando(false)
    })()
  }, [])

  // Splash: decidir destino
  useEffect(() => {
    if (screen === 'splash' && !cargando) {
      const t = setTimeout(() => {
        if (!pareja?.onboarding_completo) setScreen('onboarding')
        else if (!quien) setScreen('login')
        else setScreen('home')
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [screen, cargando, pareja, quien])

  const done = recuerdos.length
  const streak = calcularRacha(recuerdos)
  const streakGestos = calcularRacha(gestosHechos)
  const hechoHoy = gestoHechoHoy(gestosHechos)
  const stats = { done, streak, streakGestos, hechoHoy, gestosTotal: gestosHechos.length }

  const go = (s) => {
    if (s === 'surprise') { setPlan(randomPlan(recuerdos)); setScreen('reveal'); return }
    if (s === 'logout') { try { localStorage.removeItem(QUIEN) } catch (e) {} ; setQuien(null); setScreen('login'); return }
    setScreen(s)
  }

  // Botón "atrás" del teléfono y del navegador
  useEffect(() => {
    // Una sola entrada de historial que se repone tras cada "atrás"
    window.history.pushState({ app: true }, '')
    const onPop = () => {
      window.history.pushState({ app: true }, '')
      setEditando(null)
      setScreen(prev => {
        if (['splash', 'onboarding', 'login', 'home'].includes(prev)) return prev
        if (prev === 'editar') return 'memories'
        if (prev === 'plan' || prev === 'reveal') return 'home'
        return 'home'
      })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openPlan = (p) => { setPlan(p); setScreen('plan') }
  const reroll = () => { setPlan(randomPlan(recuerdos)); setScreen('reveal') }

  const elegirQuien = (nombre) => {
    try { localStorage.setItem(QUIEN, nombre) } catch (e) {}
    setQuien(nombre)
    setScreen('home')
  }

  const complete = async () => {
    const nuevo = await guardarRecuerdo({
      plan_id: plan.id, titulo: plan.titulo, categoria: plan.categoria,
      emoji: plan.emoji, autor: quien,
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

  const abrirEdicion = (r) => { setEditando(r); setScreen('editar') }

  const guardarEdicion = async (id, cambios) => {
    await actualizarRecuerdo(id, cambios)
    setRecuerdos(prev => prev.map(r => r.id === id ? { ...r, ...cambios } : r))
    setEditando(null)
    setScreen('memories')
  }

  const eliminarRecuerdo = async (id) => {
    await borrarRecuerdo(id)
    setRecuerdos(prev => prev.filter(r => r.id !== id))
    setEditando(null)
    setScreen('memories')
  }

  const completarGesto = async (gesto) => {
    const nuevo = await guardarGesto({ ...gesto, autor: quien })
    if (nuevo) setGestosHechos(prev => [nuevo, ...prev])
  }

  const actualizarFotoPlan = (planId, url) => {
    setPlanFotos(prev => ({ ...prev, [planId]: url }))
  }

  const finishOnboarding = async (cfg) => {
    await guardarConfig(cfg)
    setPareja(prev => ({ ...prev, ...cfg, onboarding_completo: true }))
    setScreen(quien ? 'home' : 'login')
  }

  return (
    <div className="phone">
      <div className="notch" />
      {screen === 'splash' && <Splash />}
      {screen === 'onboarding' && <Onboarding onFinish={finishOnboarding} />}
      {screen === 'login' && <Login pareja={pareja} onElegir={elegirQuien} />}
      {screen === 'home' && <Home go={go} stats={stats} pareja={pareja} quien={quien} />}
      {screen === 'explore' && <Explore planes={planes} go={go} openPlan={openPlan} planFotos={planFotos} />}
      {screen === 'reveal' && <Reveal plan={plan} onOpen={() => setScreen('plan')} />}
      {screen === 'plan' && <PlanDetail plan={plan} go={go} onReroll={reroll} onDone={complete}
        fotoPlan={planFotos[plan?.id]} onFotoPlan={actualizarFotoPlan} />}
      {screen === 'completed' && <Completed chapter={done} go={go} onSave={saveDetails} />}
      {screen === 'memories' && <Memories go={go} recuerdos={recuerdos} onEditar={abrirEdicion} />}
      {screen === 'profile' && <Profile go={go} doneCount={done} pareja={pareja} recuerdos={recuerdos}
        streak={streak} gestosTotal={gestosHechos.length} quien={quien} />}
      {screen === 'capsule' && <Capsule go={go} />}
      {screen === 'editar' && editando && (
        <EditarRecuerdo recuerdo={editando} onGuardar={guardarEdicion}
          onBorrar={eliminarRecuerdo} onVolver={() => { setEditando(null); setScreen('memories') }} />
      )}
      {screen === 'gestos' && <Gestos go={go} gestosHechos={gestosHechos} hechoHoy={hechoHoy} onCompletar={completarGesto} />}
    </div>
  )
}
