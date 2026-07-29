// ============================================================
// TOGETHER v2 — Sistema de logros calculados
// Cada logro se calcula desde los datos reales de la pareja.
// ============================================================
import { planes } from './planes'

// Mapa rápido de plan_id -> plan (para saber categoría, lugar, tags de cada recuerdo)
const planPorId = {}
planes.forEach(p => { planPorId[p.id] = p })

// Definición de todos los logros. Cada uno tiene un "check" que devuelve
// { hecho: bool, progreso: 0..1, actual: n, meta: n }
export const LOGROS = [
  {
    id: 'primera',
    icon: '💞',
    grad: 'g-coral',
    titulo: 'El comienzo',
    desc: 'Completaron su primera experiencia juntos.',
    check: ({ recuerdos }) => {
      const n = recuerdos.length
      return { hecho: n >= 1, actual: Math.min(n, 1), meta: 1 }
    },
  },
  {
    id: 'diez',
    icon: '⭐',
    grad: 'g-coral',
    titulo: 'En racha',
    desc: 'Vivieron 10 experiencias juntos.',
    check: ({ recuerdos }) => {
      const n = recuerdos.length
      return { hecho: n >= 10, actual: Math.min(n, 10), meta: 10 }
    },
  },
  {
    id: 'exploradores',
    icon: '🧭',
    grad: 'g-sage',
    titulo: 'Exploradores',
    desc: 'Llegaron a 50 experiencias.',
    check: ({ recuerdos }) => {
      const n = recuerdos.length
      return { hecho: n >= 50, actual: Math.min(n, 50), meta: 50 }
    },
  },
  {
    id: 'variados',
    icon: '🎨',
    grad: 'g-lav',
    titulo: 'De todo un poco',
    desc: 'Probaron 5 categorías distintas de experiencias.',
    check: ({ recuerdos }) => {
      const cats = new Set(recuerdos.map(r => (planPorId[r.plan_id] || {}).categoria).filter(Boolean))
      return { hecho: cats.size >= 5, actual: Math.min(cats.size, 5), meta: 5 }
    },
  },
  {
    id: 'aventureros',
    icon: '🏔️',
    grad: 'g-sage',
    titulo: 'Aventureros',
    desc: 'Vivieron 5 experiencias en la naturaleza.',
    check: ({ recuerdos }) => {
      const n = recuerdos.filter(r => (planPorId[r.plan_id] || {}).lugar === 'nature').length
      return { hecho: n >= 5, actual: Math.min(n, 5), meta: 5 }
    },
  },
  {
    id: 'chefs',
    icon: '👩‍🍳',
    grad: 'g-coral',
    titulo: 'Cocina para dos',
    desc: 'Hicieron 3 experiencias de cocina.',
    check: ({ recuerdos }) => {
      const n = recuerdos.filter(r => {
        const p = planPorId[r.plan_id] || {}
        return (p.categoria || '').toLowerCase().includes('cocina') || (p.tags || []).includes('cocina')
      }).length
      return { hecho: n >= 3, actual: Math.min(n, 3), meta: 3 }
    },
  },
  {
    id: 'detallistas',
    icon: '💝',
    grad: 'g-lav',
    titulo: 'Detallistas',
    desc: 'Completaron 10 pequeños gestos.',
    check: ({ gestos }) => {
      const n = gestos.length
      return { hecho: n >= 10, actual: Math.min(n, 10), meta: 10 }
    },
  },
  {
    id: 'constantes',
    icon: '🔥',
    grad: 'g-coral',
    titulo: 'Inseparables',
    desc: 'Alcanzaron una racha de 7 días.',
    check: ({ racha }) => {
      return { hecho: racha >= 7, actual: Math.min(racha, 7), meta: 7 }
    },
  },
  {
    id: 'localistas',
    icon: '📍',
    grad: 'g-sage',
    titulo: 'De acá',
    desc: 'Vivieron 5 experiencias en Tucumán.',
    check: ({ recuerdos }) => {
      const n = recuerdos.filter(r => (planPorId[r.plan_id] || {}).es_local).length
      return { hecho: n >= 5, actual: Math.min(n, 5), meta: 5 }
    },
  },
  {
    id: 'fotografos',
    icon: '📸',
    grad: 'g-lav',
    titulo: 'Fotógrafos',
    desc: 'Guardaron 10 recuerdos con foto.',
    check: ({ recuerdos }) => {
      const n = recuerdos.filter(r => r.foto_url).length
      return { hecho: n >= 10, actual: Math.min(n, 10), meta: 10 }
    },
  },
]

// Calcula el estado de todos los logros
export function calcularLogros(datos) {
  return LOGROS.map(l => {
    const r = l.check(datos)
    return { ...l, ...r, progreso: r.meta ? r.actual / r.meta : 0 }
  })
}

// El "próximo logro inteligente": el más cercano a completarse (sin estar hecho)
export function proximoLogro(datos) {
  const todos = calcularLogros(datos)
  const pendientes = todos.filter(l => !l.hecho)
  if (!pendientes.length) return null
  // El de mayor progreso (más cerca de lograrse)
  return pendientes.sort((a, b) => b.progreso - a.progreso)[0]
}
