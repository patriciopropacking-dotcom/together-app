// ============================================================
// TOGETHER v2 — Colecciones temáticas (curadas)
// Cada colección es una lista con onda editorial que agrupa planes.
// ============================================================

export const COLECCIONES = [
  {
    id: 'lluvia',
    titulo: 'Para una tarde de lluvia',
    subtitulo: 'Planes de puertas adentro, sin apuro.',
    emoji: '🌧️',
    grad: 'g-lav',
    filtro: (p) => p.lugar === 'home',
  },
  {
    id: 'tucuman',
    titulo: 'Aventuras en Tucumán',
    subtitulo: 'Lo mejor de acá cerca.',
    emoji: '⛰️',
    grad: 'g-sage',
    filtro: (p) => p.es_local === true,
  },
  {
    id: 'gratis',
    titulo: 'Sin gastar un peso',
    subtitulo: 'El amor no cuesta nada.',
    emoji: '💚',
    grad: 'g-coral',
    filtro: (p) => p.costo === 0,
  },
  {
    id: 'romantico',
    titulo: 'Noche romántica',
    subtitulo: 'Para reconectar de a dos.',
    emoji: '❤️',
    grad: 'g-coral',
    filtro: (p) => (p.moods || []).includes('romantic'),
  },
  {
    id: 'rapido',
    titulo: 'Tenemos poco tiempo',
    subtitulo: 'Momentos de 30 minutos o menos.',
    emoji: '⏱️',
    grad: 'g-lav',
    filtro: (p) => p.tiempo === 'thirty_minutes' || p.tiempo === 'one_to_two_hours',
  },
  {
    id: 'aventura',
    titulo: 'Para los que buscan más',
    subtitulo: 'Adrenalina y aire libre.',
    emoji: '🏔️',
    grad: 'g-sage',
    filtro: (p) => (p.moods || []).includes('adventure') || p.lugar === 'nature',
  },
  {
    id: 'detox',
    titulo: 'Sin pantallas',
    subtitulo: 'Presentes, el uno con el otro.',
    emoji: '📵',
    grad: 'g-lav',
    filtro: (p) => (p.tags || []).includes('digital_detox'),
  },
]

// Devuelve las colecciones con sus planes ya filtrados (solo las que tienen ≥ 3)
export function coleccionesConPlanes(planes) {
  return COLECCIONES
    .map(c => ({ ...c, planes: planes.filter(c.filtro) }))
    .filter(c => c.planes.length >= 3)
}
