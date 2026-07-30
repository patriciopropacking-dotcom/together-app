// ============================================================
// TOGETHER — "Su año juntos" (Wrapped)
// Calcula los números del año con datos REALES de la pareja.
// ============================================================
import { planes } from './planes'
import { calcularLogros } from './logros'

const planPorId = {}
planes.forEach(p => { planPorId[p.id] = p })

// Mejor racha histórica: el tramo más largo de días consecutivos con actividad
function mejorRacha(fechas) {
  if (!fechas.length) return 0
  const dias = [...new Set(fechas.map(f => new Date(f).toDateString()))]
    .map(d => new Date(d)).sort((a, b) => a - b)
  let mejor = 1, actual = 1
  for (let i = 1; i < dias.length; i++) {
    const difDias = Math.round((dias[i] - dias[i - 1]) / 86400000)
    if (difDias === 1) { actual++; mejor = Math.max(mejor, actual) }
    else if (difDias > 1) { actual = 1 }
  }
  return mejor
}

export function calcularWrapped({ recuerdos = [], gestos = [], publicaciones = [], anio }) {
  const year = anio || new Date().getFullYear()
  const delAnio = (arr, campo = 'completado_en') => arr.filter(x => x[campo] && new Date(x[campo]).getFullYear() === year)

  const recDelAnio = delAnio(recuerdos)
  const gesDelAnio = delAnio(gestos)
  const pubDelAnio = delAnio(publicaciones, 'creado_en')

  // Categoría favorita
  const cats = {}
  recDelAnio.forEach(r => {
    const c = (planPorId[r.plan_id] || {}).categoria || r.categoria
    if (c) cats[c] = (cats[c] || 0) + 1
  })
  const catFavorita = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]

  // Lugar/tipo favorito
  const lugares = {}
  recDelAnio.forEach(r => {
    const l = (planPorId[r.plan_id] || {}).lugar
    if (l) lugares[l] = (lugares[l] || 0) + 1
  })
  const lugarLabel = { home: 'En casa', going_out: 'Saliendo', nature: 'En la naturaleza' }
  const lugarFav = Object.entries(lugares).sort((a, b) => b[1] - a[1])[0]

  // Canción más compartida (de Entre nosotros)
  const canciones = pubDelAnio.filter(p => p.tipo === 'song')
  const cancionDestacada = canciones[0]?.extra?.cancion || null

  // Mes más activo
  const meses = {}
  recDelAnio.forEach(r => {
    const m = new Date(r.completado_en).getMonth()
    meses[m] = (meses[m] || 0) + 1
  })
  const mesTop = Object.entries(meses).sort((a, b) => b[1] - a[1])[0]
  const nombreMes = mesTop ? new Date(2000, mesTop[0], 1).toLocaleDateString('es-AR', { month: 'long' }) : null

  // Logros desbloqueados
  const logros = calcularLogros({ recuerdos, gestos, racha: 0 }).filter(l => l.hecho)

  // Foto destacada (el recuerdo con foto más reciente)
  const conFoto = recDelAnio.filter(r => r.foto_url)
  const fotoDestacada = conFoto[0] || null

  return {
    year,
    experiencias: recDelAnio.length,
    gestos: gesDelAnio.length,
    publicaciones: pubDelAnio.length,
    categorias: Object.keys(cats).length,
    catFavorita: catFavorita ? { nombre: catFavorita[0], veces: catFavorita[1] } : null,
    lugarFavorito: lugarFav ? { nombre: lugarLabel[lugarFav[0]] || lugarFav[0], veces: lugarFav[1] } : null,
    mejorRacha: mejorRacha([...recDelAnio.map(r => r.completado_en), ...gesDelAnio.map(g => g.completado_en)]),
    cancionDestacada,
    mesTop: nombreMes ? { nombre: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1), veces: parseInt(mesTop[1]) } : null,
    logros: logros.length,
    fotoDestacada,
    vacio: recDelAnio.length === 0 && gesDelAnio.length === 0 && pubDelAnio.length === 0,
  }
}
