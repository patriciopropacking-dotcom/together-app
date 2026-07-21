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
  }).select().single()
  if (error) { console.error('guardarRecuerdo', error); return null }
  return data
}

// ---------- RACHA ----------
// Cuenta días consecutivos con al menos una experiencia, terminando hoy o ayer.
export function calcularRacha(recuerdos) {
  if (!recuerdos.length) return 0
  const dias = new Set(recuerdos.map(r => new Date(r.completado_en).toDateString()))
  let racha = 0
  const hoy = new Date()
  // permitir que la racha siga viva si la última fue ayer
  let cursor = new Date(hoy)
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
