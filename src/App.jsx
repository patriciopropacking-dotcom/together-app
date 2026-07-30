import React, { useState, useEffect } from 'react'
import { planes } from './data/planes'
import {
  getPareja, guardarConfig, getRecuerdos, guardarRecuerdo,
  getGestos, guardarGesto, gestoHechoHoy, calcularRacha, rachaConexion,
  getPlanFotos, actualizarRecuerdo, borrarRecuerdo, supabase,
  getPublicaciones, crearPublicacion, borrarPublicacion, toggleReaccion, getConteoComentarios, actualizarPublicacion,
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
import SorprendeModos from './screens/SorprendeModos'
import QuePintaHoy from './screens/QuePintaHoy'
import ElegiPorNosotros from './screens/ElegiPorNosotros'
import Composer from './screens/Composer'
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
  const [publicaciones, setPublicaciones] = useState([])
  const [conteosComentarios, setConteosComentarios] = useState({})
  const [preguntaActiva, setPreguntaActiva] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [ultimoRecuerdo, setUltimoRecuerdo] = useState(null)
  const [editando, setEditando] = useState(null)
  const [quien, setQuien] = useState(() => {
    try { return localStorage.getItem(QUIEN) } catch (e) { return null }
  })

  // Cargar todo al arrancar
  useEffect(() => {
    (async () => {
      const [p, r, g, f, pubs, cc] = await Promise.all([getPareja(), getRecuerdos(), getGestos(), getPlanFotos(), getPublicaciones(), getConteoComentarios()])
      setPareja(p); setRecuerdos(r); setGestosHechos(g); setPlanFotos(f); setPublicaciones(pubs); setConteosComentarios(cc)
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
  const conexion = rachaConexion(recuerdos, gestosHechos)
  const streak = conexion.racha
  const streakGestos = calcularRacha(gestosHechos)
  const hechoHoy = gestoHechoHoy(gestosHechos)
  const stats = { done, streak, streakGestos, hechoHoy, gestosTotal: gestosHechos.length,
    comodinUsado: conexion.comodinUsado, activaHoy: conexion.activaHoy }

  const go = (s) => {
    if (s === 'surprise') { setScreen('sorprende'); return }
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

  const elegirModo = (modo) => {
    if (modo === 'pinta') setScreen('pinta')
    else setScreen('azar')
  }
  const planDesdeModo = (p) => { setPlan(p); setScreen('completed') }
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

  // Igual que complete pero recibe el plan directo (viene de los modos de Sorpréndenos)
  const complete2 = async (p) => {
    const nuevo = await guardarRecuerdo({
      plan_id: p.id, titulo: p.titulo, categoria: p.categoria,
      emoji: p.emoji, autor: quien,
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

  const publicarNuevo = async (pub) => {
    const nuevo = await crearPublicacion(pub)
    if (nuevo) setPublicaciones(prev => [nuevo, ...prev])
    setScreen('memories')
  }
  const reaccionarPub = async (pub, tipo) => {
    const nuevas = await toggleReaccion(pub, quien, tipo)
    setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, reacciones: nuevas } : x))
  }
  const borrarPub = async (pub) => {
    await borrarPublicacion(pub.id)
    setPublicaciones(prev => prev.filter(x => x.id !== pub.id))
  }
  // "Hagámoslo": marca que este usuario acepta el plan
  const hagamoslo = async (pub) => {
    const aceptado = pub.extra?.aceptado_por || []
    if (aceptado.includes(quien)) return
    const nuevoExtra = { ...pub.extra, aceptado_por: [...aceptado, quien] }
    await actualizarPublicacion(pub.id, { extra: nuevoExtra })
    setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, extra: nuevoExtra } : x))
    if (navigator.vibrate) navigator.vibrate([10, 40, 10])
  }
  // Convertir un plan aceptado por ambos en una experiencia completada/pendiente
  const convertirPlan = async (pub) => {
    const pl = pub.extra?.plan || {}
    const nuevo = await guardarRecuerdo({
      plan_id: 9000 + Math.floor(Math.random() * 1000),
      titulo: pl.titulo || 'Plan juntos', categoria: 'Para hacer',
      emoji: '✨', autor: quien,
    })
    if (nuevo) {
      setRecuerdos(prev => [nuevo, ...prev])
      // marcar el plan como convertido
      const nuevoExtra = { ...pub.extra, convertido: true }
      await actualizarPublicacion(pub.id, { extra: nuevoExtra })
      setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, extra: nuevoExtra } : x))
      setUltimoRecuerdo(nuevo)
      setScreen('completed')
    }
  }
  // Responder una pregunta
  const favoritoPub = async (pub) => {
    const fav = pub.favorito_de || []
    const nuevo = fav.includes(quien) ? fav.filter(n => n !== quien) : [...fav, quien]
    await actualizarPublicacion(pub.id, { favorito_de: nuevo })
    setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, favorito_de: nuevo } : x))
  }
  const fijarPub = async (pub) => {
    const fij = pub.fijado_de || []
    const nuevo = fij.includes(quien) ? fij.filter(n => n !== quien) : [...fij, quien]
    await actualizarPublicacion(pub.id, { fijado_de: nuevo })
    setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, fijado_de: nuevo } : x))
  }
  const responderPregunta = async (pub) => {
    const texto = window.prompt ? null : null // no usamos prompt; se maneja abajo
    setPreguntaActiva(pub)
  }
  const guardarRespuesta = async (pub, texto) => {
    const respuestas = pub.extra?.respuestas || []
    const nuevoExtra = { ...pub.extra, respuestas: [...respuestas, { autor: quien, texto, en: new Date().toISOString() }] }
    await actualizarPublicacion(pub.id, { extra: nuevoExtra })
    setPublicaciones(prev => prev.map(x => x.id === pub.id ? { ...x, extra: nuevoExtra } : x))
    setPreguntaActiva(null)
  }

  const finishOnboarding = async (cfg) => {
    await guardarConfig(cfg)
    setPareja(prev => ({ ...prev, ...cfg, onboarding_completo: true }))
    setScreen(quien ? 'home' : 'login')
  }

  const actualizarAniversario = async (nuevaFecha) => {
    const cfg = { ...pareja, aniversario: nuevaFecha }
    await guardarConfig(cfg)
    setPareja(prev => ({ ...prev, aniversario: nuevaFecha }))
  }

  return (
    <div className="phone">
      <div className="notch" />
      {screen === 'splash' && <Splash />}
      {screen === 'onboarding' && <Onboarding onFinish={finishOnboarding} />}
      {screen === 'login' && <Login pareja={pareja} onElegir={elegirQuien} />}
      {screen === 'home' && <Home go={go} stats={stats} pareja={pareja} quien={quien} recuerdos={recuerdos} gestos={gestosHechos} />}
      {screen === 'explore' && <Explore planes={planes} go={go} openPlan={openPlan} planFotos={planFotos} />}
      {screen === 'reveal' && <Reveal plan={plan} onOpen={() => setScreen('plan')} />}
      {screen === 'plan' && <PlanDetail plan={plan} go={go} onReroll={reroll} onDone={complete}
        fotoPlan={planFotos[plan?.id]} onFotoPlan={actualizarFotoPlan} />}
      {screen === 'completed' && <Completed chapter={done} go={go} onSave={saveDetails} />}
      {screen === 'memories' && <Memories go={go} recuerdos={recuerdos} onEditar={abrirEdicion}
        publicaciones={publicaciones} quien={quien} pareja={pareja}
        onReaccionar={reaccionarPub} onBorrarPub={borrarPub} onNuevaPub={() => setScreen('composer')} conteosComentarios={conteosComentarios}
        onHagamoslo={hagamoslo} onConvertirPlan={convertirPlan} onResponderPregunta={responderPregunta}
        onFavorito={favoritoPub} onFijar={fijarPub} />}
      {screen === 'profile' && <Profile go={go} doneCount={done} pareja={pareja} recuerdos={recuerdos}
        streak={streak} gestosTotal={gestosHechos.length} gestosLista={gestosHechos} quien={quien} onAniversario={actualizarAniversario} />}
      {screen === 'capsule' && <Capsule go={go} />}
      {screen === 'editar' && editando && (
        <EditarRecuerdo recuerdo={editando} onGuardar={guardarEdicion}
          onBorrar={eliminarRecuerdo} onVolver={() => { setEditando(null); setScreen('memories') }} />
      )}
      {screen === 'sorprende' && <SorprendeModos go={go} onModo={elegirModo} />}
      {screen === 'pinta' && <QuePintaHoy planes={planes} recuerdos={recuerdos} go={go} planFotos={planFotos}
        onDone={(p) => { setPlan(p); complete2(p) }} />}
      {screen === 'azar' && <ElegiPorNosotros planes={planes} recuerdos={recuerdos} go={go} planFotos={planFotos}
        onDone={(p) => { setPlan(p); complete2(p) }} />}
      {screen === 'composer' && <Composer quien={quien} pareja={pareja} onPublicar={publicarNuevo} onCancelar={() => setScreen('memories')} />}
      {preguntaActiva && (
        <ModalRespuesta pregunta={preguntaActiva} onGuardar={guardarRespuesta} onCerrar={() => setPreguntaActiva(null)} />
      )}
      {screen === 'gestos' && <Gestos go={go} gestosHechos={gestosHechos} hechoHoy={hechoHoy} onCompletar={completarGesto} />}
    </div>
  )
}

function ModalRespuesta({ pregunta, onGuardar, onCerrar }) {
  const [texto, setTexto] = React.useState('')
  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'fixed', inset: 0, zIndex: 200 }}>
      <button onClick={onCerrar} aria-label="Cerrar" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 0 }} />
      <div className="sheet-up" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-1)', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '14px 22px calc(30px + env(safe-area-inset-bottom,0px))' }}>
        <div style={{ width: 42, height: 5, borderRadius: 3, background: 'var(--line)', margin: '0 auto 18px' }} />
        <div className="sub" style={{ fontSize: 13, marginBottom: 6 }}>Respondé a</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 700, marginBottom: 16 }}>{pregunta.texto}</div>
        <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={4} autoFocus placeholder="Tu respuesta…"
          style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 14, font: 'inherit', fontSize: 15, outline: 'none', resize: 'none', color: 'var(--ink)', background: 'var(--white)' }} />
        <button className="btn btn-coral mt16" disabled={!texto.trim()} style={{ opacity: texto.trim() ? 1 : .5 }}
          onClick={() => onGuardar(pregunta, texto.trim())}>Responder ❤️</button>
      </div>
    </div>
  )
}

