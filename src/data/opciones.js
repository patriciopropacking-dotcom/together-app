// ============================================================
// TOGETHER v2 — Constantes de datos (centralizadas, no en JSX)
// ============================================================

// Tiempo disponible
export const TIEMPO_OPCIONES = [
  { valor: 'thirty_minutes', label: '30 minutos', icon: '⏱️' },
  { valor: 'one_to_two_hours', label: '1 a 2 horas', icon: '🕐' },
  { valor: 'half_day', label: 'Medio día', icon: '🌤️' },
  { valor: 'full_day', label: 'Todo el día', icon: '☀️' },
]

// Presupuesto
export const PRESUPUESTO_OPCIONES = [
  { valor: 'free', label: 'Gratis', icon: '💚' },
  { valor: 'low', label: 'Económico', icon: '💵' },
  { valor: 'medium', label: 'Intermedio', icon: '💳' },
  { valor: 'open', label: 'Sin límite', icon: '✨' },
]

// Lugar
export const LUGAR_OPCIONES = [
  { valor: 'home', label: 'En casa', icon: '🏠' },
  { valor: 'going_out', label: 'Salir', icon: '🚶' },
  { valor: 'nature', label: 'Naturaleza', icon: '🌿' },
  { valor: 'any', label: 'Cualquiera', icon: '🌈' },
]

// Estado de ánimo
export const MOOD_OPCIONES = [
  { valor: 'calm', label: 'Tranquilo', icon: '🌙' },
  { valor: 'romantic', label: 'Romántico', icon: '❤️' },
  { valor: 'fun', label: 'Divertido', icon: '😄' },
  { valor: 'adventure', label: 'Aventura', icon: '🏔️' },
]

// Movilidad
export const MOVILIDAD_OPCIONES = [
  { valor: 'with_car', label: 'Con auto', icon: '🚗' },
  { valor: 'without_car', label: 'Sin auto', icon: '🚶' },
  { valor: 'any', label: 'Cualquiera', icon: '🌈' },
]

// Etiquetas legibles para mostrar en el resultado
export const LABEL = {
  thirty_minutes: '30 minutos', one_to_two_hours: '1 a 2 horas', half_day: 'medio día', full_day: 'todo el día',
  free: 'gratis', low: 'económico', medium: 'intermedio', open: 'sin límite',
  home: 'en casa', going_out: 'salir', nature: 'naturaleza', any: 'cualquiera',
  calm: 'algo tranquilo', romantic: 'algo romántico', fun: 'algo divertido', adventure: 'una aventura',
  with_car: 'con auto', without_car: 'sin auto',
}
