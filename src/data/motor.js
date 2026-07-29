// ============================================================
// TOGETHER v2 — Motor de recomendación (local, determinista)
// No usa IA externa. Puntúa cada plan según los filtros.
// ============================================================

// Puntúa un plan contra los filtros elegidos
function puntuar(plan, filtros, descartadosSesion, recuerdos) {
  let score = 0

  // Tiempo: +4 si compatible (no lo ignoramos nunca)
  if (filtros.tiempo && plan.tiempo === filtros.tiempo) score += 4
  else if (filtros.tiempo) score -= 2 // penalización leve, no descartar del todo

  // Presupuesto: +4
  if (filtros.presupuesto) {
    if (plan.presupuesto === filtros.presupuesto || filtros.presupuesto === 'open') score += 4
  }

  // Lugar: +4
  if (filtros.lugar && filtros.lugar !== 'any') {
    if (plan.lugar === filtros.lugar) score += 4
  } else if (filtros.lugar === 'any') score += 1

  // Mood: +5 (el que más pesa)
  if (filtros.mood) {
    if ((plan.moods || []).includes(filtros.mood)) score += 5
  }

  // Movilidad: +3
  if (filtros.movilidad && filtros.movilidad !== 'any') {
    if ((plan.movilidad || []).includes(filtros.movilidad)) score += 3
  } else if (filtros.movilidad === 'any') score += 1

  // No realizada antes: +2
  const hechos = new Set((recuerdos || []).map(r => r.plan_id))
  if (!hechos.has(plan.id)) score += 2

  // Realizada recientemente: -4
  const reciente = (recuerdos || []).slice(0, 5).map(r => r.plan_id)
  if (reciente.includes(plan.id)) score -= 4

  // Descartada en esta sesión: -3
  if (descartadosSesion && descartadosSesion.includes(plan.id)) score -= 3

  return score
}

// Devuelve la mejor recomendación (con algo de variedad entre las top)
export function recomendar(planes, filtros, descartadosSesion = [], recuerdos = []) {
  const puntuados = planes
    .map(p => ({ plan: p, score: puntuar(p, filtros, descartadosSesion, recuerdos) }))
    .sort((a, b) => b.score - a.score)

  if (!puntuados.length) return { plan: null, exacto: false }

  const mejorScore = puntuados[0].score
  // Considerar "buenos" los que están cerca del mejor
  const top = puntuados.filter(x => x.score >= mejorScore - 2 && x.score > 0)
  const pool = top.length ? top : [puntuados[0]]

  // Elegir uno al azar entre los mejores (evita repetir siempre el mismo)
  const elegido = pool[Math.floor(Math.random() * pool.length)]

  // ¿Es coincidencia "exacta"? (mood + al menos 3 criterios más)
  const exacto = elegido.score >= 16

  return { plan: elegido.plan, exacto, score: elegido.score }
}

// Genera la frase de por qué se recomendó, desde los filtros
export function explicar(filtros, LABEL) {
  const partes = []
  if (filtros.tiempo) partes.push(`tienen ${LABEL[filtros.tiempo]}`)
  if (filtros.lugar && filtros.lugar !== 'any') partes.push(`quieren ${LABEL[filtros.lugar]}`)
  if (filtros.mood) partes.push(`buscan ${LABEL[filtros.mood]}`)
  if (filtros.movilidad && filtros.movilidad !== 'any') partes.push(`están ${LABEL[filtros.movilidad]}`)

  if (!partes.length) return 'Les recomendamos este plan para hoy.'
  if (partes.length === 1) return `Les recomendamos este plan porque ${partes[0]}.`
  const ultimo = partes.pop()
  return `Les recomendamos este plan porque ${partes.join(', ')} y ${ultimo}.`
}
