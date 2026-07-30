import { createClient } from '@supabase/supabase-js'

// Conexión a tu proyecto de Supabase
const URL = 'https://bvvpezjevwvwlunraacb.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dnBlempldnd2d2x1bnJhYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NjU3MDksImV4cCI6MjEwMDI0MTcwOX0.R8VqqTP6qIlU3B9GfKyCYvItox-lX3USiACgeV19GZY'

export const supabase = createClient(URL, KEY)

// ---------- PAREJA (configuración) ----------
export async function getPareja() {
  const { data, error } = await supabase.from('pareja').select('*').eq('id', 1).single()
  if (error) { console.error('getPareja', error); return null }
  return data
}

export async function guardarConfig(cfg) {
  const { error } = await supabase.from('pareja').update({
    aniversario: cfg.aniversario,
    presupuesto: cfg.presupuesto,
    ciudad: cfg.ciudad,
    gustos: cfg.gustos,
    onboarding_completo: true,
  }).eq('id', 1)
  if (error) { console.error('guardarConfig', error); return false }
  return true
}

// ---------- RECUERDOS (experiencias completadas) ----------
export async function getRecuerdos() {
  const { data, error } = await supabase
    .from('recuerdos').select('*').order('completado_en', { ascending: false })
  if (error) { console.error('getRecuerdos', error); return [] }
  return data || []
}

export async function guardarRecuerdo(r) {
  const { data, error } = await supabase.from('recuerdos').insert({
    plan_id: r.plan_id, titulo: r.titulo, categoria: r.categoria, emoji: r.emoji,
    nota: r.nota || null, cancion: r.cancion || null, mood: r.mood || null,
    autor: r.autor || null,
  }).select().single()
  if (error) { console.error('guardarRecuerdo', error); return null }
  return data
}

export async function actualizarRecuerdo(id, cambios) {
  const { error } = await supabase.from('recuerdos').update(cambios).eq('id', id)
  if (error) { console.error('actualizarRecuerdo', error); return false }
  return true
}

export async function borrarRecuerdo(id) {
  const { error } = await supabase.from('recuerdos').delete().eq('id', id)
  if (error) { console.error('borrarRecuerdo', error); return false }
  return true
}

// ---------- FOTOS (Storage) ----------
// Sube una foto al bucket "fotos" y devuelve su URL pública.
export async function subirFoto(file, carpeta = 'recuerdos') {
  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const nombre = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('fotos').upload(nombre, file, {
      cacheControl: '3600', upsert: false,
    })
    if (error) { console.error('subirFoto', error); return null }
    const { data } = supabase.storage.from('fotos').getPublicUrl(nombre)
    return data?.publicUrl || null
  } catch (e) {
    console.error('subirFoto', e)
    return null
  }
}

// ---------- FOTOS DE PLANES ----------
export async function getPlanFotos() {
  const { data, error } = await supabase.from('plan_fotos').select('*')
  if (error) { console.error('getPlanFotos', error); return {} }
  const mapa = {}
  ;(data || []).forEach(f => { mapa[f.plan_id] = f.foto_url })
  return mapa
}

export async function guardarFotoPlan(planId, url) {
  const { error } = await supabase.from('plan_fotos')
    .upsert({ plan_id: planId, foto_url: url }, { onConflict: 'plan_id' })
  if (error) { console.error('guardarFotoPlan', error); return false }
  return true
}

// ---------- PEQUEÑOS GESTOS ----------
export async function getGestos() {
  const { data, error } = await supabase
    .from('gestos').select('*').order('completado_en', { ascending: false })
  if (error) { console.error('getGestos', error); return [] }
  return data || []
}

export async function guardarGesto(g) {
  const { data, error } = await supabase.from('gestos').insert({
    gesto_id: g.id, texto: g.texto, emoji: g.emoji, autor: g.autor || null,
  }).select().single()
  if (error) { console.error('guardarGesto', error); return null }
  return data
}

// ¿Ya se hizo el gesto de hoy?
export function gestoHechoHoy(gestosCompletados) {
  const hoy = new Date().toDateString()
  return gestosCompletados.some(g => new Date(g.completado_en).toDateString() === hoy)
}

// ---------- RACHA ----------
// Cuenta días consecutivos con al menos un registro, terminando hoy o ayer.
// Sirve tanto para recuerdos (experiencias) como para gestos.
export function calcularRacha(items) {
  if (!items || !items.length) return 0
  const dias = new Set(items.map(r => new Date(r.completado_en).toDateString()))
  let racha = 0
  const hoy = new Date()
  let cursor = new Date(hoy)
  // la racha sigue viva si el último fue hoy o ayer
  if (!dias.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(cursor.toDateString())) return 0
  }
  while (dias.has(cursor.toDateString())) {
    racha++
    cursor.setDate(cursor.getDate() - 1)
  }
  return racha
}

// ---------- RACHA DE CONEXIÓN (con comodín mensual) ----------
// Un día "cuenta" si hubo CUALQUIER actividad: una experiencia o un gesto.
// Comodín: una vez por mes, un hueco de 1 día no corta la racha.
export function rachaConexion(recuerdos = [], gestos = []) {
  // Juntar todos los días con actividad
  const dias = new Set()
  ;[...recuerdos, ...gestos].forEach(x => {
    if (x.completado_en) dias.add(new Date(x.completado_en).toDateString())
  })
  if (!dias.size) return { racha: 0, comodinUsado: false, activaHoy: false }

  const hoy = new Date()
  const activaHoy = dias.has(hoy.toDateString())

  let racha = 0
  let comodinUsado = false
  let cursor = new Date(hoy)

  // Empezar desde hoy o ayer
  if (!dias.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(cursor.toDateString())) {
      // Ni hoy ni ayer: la racha está rota
      return { racha: 0, comodinUsado: false, activaHoy: false }
    }
  }

  const mesActual = `${hoy.getFullYear()}-${hoy.getMonth()}`

  while (true) {
    if (dias.has(cursor.toDateString())) {
      racha++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      // Hueco. ¿Podemos usar el comodín? (solo 1 vez, y solo por hueco de 1 día en el mes actual)
      const cursorMes = `${cursor.getFullYear()}-${cursor.getMonth()}`
      const anterior = new Date(cursor)
      anterior.setDate(anterior.getDate() - 1)
      if (!comodinUsado && cursorMes === mesActual && dias.has(anterior.toDateString())) {
        // Perdonar este día y seguir
        comodinUsado = true
        cursor = anterior
      } else {
        break
      }
    }
  }

  return { racha, comodinUsado, activaHoy }
}


// ---------- ENTRE NOSOTROS (publicaciones) ----------
export async function getPublicaciones() {
  const { data, error } = await supabase.from('publicaciones')
    .select('*').eq('borrado', false).order('creado_en', { ascending: false })
  if (error) { console.error('getPublicaciones', error); return [] }
  return data || []
}

export async function crearPublicacion(pub) {
  const { data, error } = await supabase.from('publicaciones').insert({
    tipo: pub.tipo, autor: pub.autor || null, texto: pub.texto || null,
    titulo: pub.titulo || null, foto_url: pub.foto_url || null, color: pub.color || null,
    extra: pub.extra || {},
  }).select().single()
  if (error) { console.error('crearPublicacion', error); return null }
  return data
}

export async function actualizarPublicacion(id, cambios) {
  const { error } = await supabase.from('publicaciones')
    .update({ ...cambios, editado_en: new Date().toISOString() }).eq('id', id)
  if (error) { console.error('actualizarPublicacion', error); return false }
  return true
}

export async function borrarPublicacion(id) {
  const { error } = await supabase.from('publicaciones').update({ borrado: true }).eq('id', id)
  if (error) { console.error('borrarPublicacion', error); return false }
  return true
}

// Reaccionar: agrega/quita la reacción del autor a una publicación
export async function toggleReaccion(pub, autor, tipo) {
  const actuales = Array.isArray(pub.reacciones) ? pub.reacciones : []
  const yaReacciono = actuales.find(r => r.autor === autor && r.tipo === tipo)
  let nuevas
  if (yaReacciono) {
    nuevas = actuales.filter(r => !(r.autor === autor && r.tipo === tipo))
  } else {
    // Una sola reacción por autor: reemplaza la anterior de ese autor
    nuevas = actuales.filter(r => r.autor !== autor)
    nuevas.push({ autor, tipo, en: new Date().toISOString() })
  }
  const { error } = await supabase.from('publicaciones').update({ reacciones: nuevas }).eq('id', pub.id)
  if (error) { console.error('toggleReaccion', error); return actuales }
  return nuevas
}
