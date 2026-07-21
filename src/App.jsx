import React, { useState, useEffect } from 'react'
import { planes } from './data/planes'
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
  const [done, setDone] = useState(43)     // experiencias completadas

  const stats = { done, streak: 18 }

  // Splash → Onboarding automático
  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('onboarding'), 2400)
      return () => clearTimeout(t)
    }
  }, [screen])

  const go = (s) => {
    if (s === 'surprise') { setPlan(randomPlan()); setScreen('plan'); return }
    setScreen(s)
  }
  const openPlan = (p) => { setPlan(p); setScreen('plan') }
  const reroll = () => setPlan(randomPlan())
  const complete = () => { setDone(d => d + 1); setScreen('completed') }

  return (
    <div className="phone">
      <div className="notch" />
      {screen === 'splash' && <Splash />}
      {screen === 'onboarding' && <Onboarding onFinish={() => setScreen('home')} />}
      {screen === 'home' && <Home go={go} stats={stats} />}
      {screen === 'explore' && <Explore planes={planes} go={go} openPlan={openPlan} />}
      {screen === 'plan' && <PlanDetail plan={plan} go={go} onReroll={reroll} onDone={complete} />}
      {screen === 'completed' && <Completed chapter={done} go={go} />}
      {screen === 'memories' && <Memories go={go} />}
      {screen === 'profile' && <Profile go={go} doneCount={done} />}
      {screen === 'capsule' && <Capsule go={go} />}
    </div>
  )
}
