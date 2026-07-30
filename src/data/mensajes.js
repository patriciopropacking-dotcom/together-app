// ============================================================
// TOGETHER — "IA invisible": mensajes dinámicos del Home
// Analiza el estado de la pareja y elige el mensaje más relevante.
// No es IA real: es lógica que se siente atenta y cálida.
// ============================================================
import { planes } from './planes'

const planPorId = {}
planes.forEach(p => { planPorId[p.id] = p })

function saludoPorHora() {
  const h = new Date().getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 12) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

function diasDesde(iso) {
  if (!iso) return null
  return Math.floor((new Date() - new Date(iso)) / 86400000)
}

// Devuelve el saludo principal (arriba del título)
export function saludo(quien) {
  return `${saludoPorHora()}${quien ? ', ' + quien : ''} ❤️`
}

// Devuelve el "mensaje del día": el más relevante según el estado.
// Cada mensaje tiene prioridad; se elige el de mayor prioridad que aplique.
export function mensajeDelDia({ recuerdos = [], gestos = [], streak = 0, hechoHoy, pareja, proxLogro }) {
  const mensajes = []
  const hoy = new Date()

  // --- Aniversario (máxima prioridad) ---
  if (pareja?.aniversario) {
    const aniv = new Date(pareja.aniversario)
    if (aniv.getDate() === hoy.getDate() && aniv.getMonth() === hoy.getMonth()) {
      const anios = hoy.getFullYear() - aniv.getFullYear()
      mensajes.push({ prioridad: 100, texto: `¡Feliz aniversario! ${anios > 0 ? anios + (anios === 1 ? ' año' : ' años') + ' juntos 🎉' : '🎉'}`, tono: 'celebracion' })
    }
  }

  // --- "Hace un año" de una experiencia ---
  const haceUnAnio = recuerdos.find(r => {
    const d = new Date(r.completado_en)
    const objetivo = new Date(hoy); objetivo.setFullYear(objetivo.getFullYear() - 1)
    return Math.abs((d - objetivo) / 86400000) <= 2
  })
  if (haceUnAnio) {
    mensajes.push({ prioridad: 90, texto: `Hace exactamente un año vivieron "${haceUnAnio.titulo}" ✨`, tono: 'recuerdo' })
  }

  // --- Racha alta (celebrar) ---
  if (streak >= 7) {
    mensajes.push({ prioridad: 70, texto: `Llevan ${streak} días de racha. Qué equipo ❤️`, tono: 'celebracion' })
  }

  // --- Próximo logro cerca ---
  if (proxLogro && proxLogro.progreso >= 0.6 && proxLogro.progreso < 1) {
    const falta = proxLogro.meta - proxLogro.actual
    mensajes.push({ prioridad: 65, texto: `Les falta ${falta} para el logro "${proxLogro.titulo}" 🏆`, tono: 'meta' })
  }

  // --- IA invisible: patrón de dónde vienen haciendo las cosas ---
  if (recuerdos.length >= 3) {
    const ultimas = recuerdos.slice(0, 4)
    const lugares = ultimas.map(r => (planPorId[r.plan_id] || {}).lugar).filter(Boolean)
    const enCasa = lugares.filter(l => l === 'home').length
    const naturaleza = lugares.filter(l => l === 'nature').length
    if (enCasa >= 3) {
      mensajes.push({ prioridad: 55, texto: 'Las últimas experiencias fueron en casa. ¿Salimos un poco? 🌿', tono: 'sugerencia' })
    } else if (naturaleza === 0 && recuerdos.length >= 4) {
      mensajes.push({ prioridad: 50, texto: 'Hace rato que no hacen algo en la naturaleza 🏔️', tono: 'sugerencia' })
    }
  }

  // --- Hace días que no hacen nada (sin culpa) ---
  const ultimaActividad = [...recuerdos, ...gestos]
    .map(x => x.completado_en).filter(Boolean).sort().reverse()[0]
  const dias = diasDesde(ultimaActividad)
  if (dias !== null && dias >= 5) {
    mensajes.push({ prioridad: 60, texto: 'Hace unos días que Together los extraña ❤️', tono: 'calido' })
  } else if (dias !== null && dias >= 3) {
    mensajes.push({ prioridad: 45, texto: 'Hace unos días que no crean un recuerdo. ¿Hoy? 🌅', tono: 'sugerencia' })
  }

  // --- Gesto del día pendiente ---
  if (!hechoHoy) {
    mensajes.push({ prioridad: 40, texto: 'Hoy los espera un pequeño gesto 💛', tono: 'gesto' })
  }

  // --- Base (siempre disponible) ---
  mensajes.push({ prioridad: 10, texto: 'Cada momento juntos, se convierte en historia.', tono: 'base' })

  // Elegir el de mayor prioridad
  mensajes.sort((a, b) => b.prioridad - a.prioridad)
  return mensajes[0]
}
