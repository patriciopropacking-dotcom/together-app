import React, { useEffect, useRef } from 'react'

// Mapa real con los recuerdos ubicados. Pines con foto + línea del recorrido.
export default function MapaRecuerdos({ recuerdos = [] }) {
  const ref = useRef(null)
  const mapRef = useRef(null)

  const conUbicacion = recuerdos.filter(r => r.lat && r.lng)

  useEffect(() => {
    const L = window.L
    if (!L || !ref.current || mapRef.current) return

    const centro = conUbicacion.length ? [conUbicacion[0].lat, conUbicacion[0].lng] : [-26.8083, -65.2176]
    const map = L.map(ref.current, { zoomControl: true, attributionControl: false }).setView(centro, 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
    mapRef.current = map

    // Ordenar por fecha para dibujar el recorrido cronológico
    const ordenados = [...conUbicacion].sort((a, b) =>
      new Date(a.completado_en || 0) - new Date(b.completado_en || 0))

    const puntos = []
    ordenados.forEach(r => {
      puntos.push([r.lat, r.lng])
      // Pin con foto si tiene, o emoji
      const contenido = r.foto_url
        ? `<div style="width:44px;height:44px;border-radius:50%;border:3px solid #F0705A;background:url('${r.foto_url}') center/cover;box-shadow:0 3px 10px rgba(0,0,0,.4)"></div>`
        : `<div style="width:40px;height:40px;border-radius:50%;border:3px solid #F0705A;background:#2E251F;display:flex;align-items:center;justify-content:center;font-size:20px">${r.emoji || '📍'}</div>`
      const icon = L.divIcon({ html: contenido, className: '', iconSize: [44, 44], iconAnchor: [22, 22] })
      L.marker([r.lat, r.lng], { icon }).addTo(map)
        .bindPopup(`<b>${r.titulo}</b>${r.lugar ? '<br>' + r.lugar : ''}`)
    })

    // Línea del recorrido
    if (puntos.length > 1) {
      L.polyline(puntos, { color: '#F0705A', weight: 3, opacity: .7, dashArray: '6 8' }).addTo(map)
    }

    // Ajustar zoom para ver todos los pines
    if (puntos.length > 1) {
      map.fitBounds(puntos, { padding: [40, 40] })
    } else if (puntos.length === 1) {
      map.setView(puntos[0], 13)
    }

    setTimeout(() => map.invalidateSize(), 200)
    return () => { map.remove(); mapRef.current = null }
  }, [])

  if (!conUbicacion.length) {
    return (
      <div className="center" style={{ padding: '40px 20px' }}>
        <div style={{ fontSize: 44 }}>🗺️</div>
        <p className="sub mt16">Todavía no marcaron dónde vivieron sus recuerdos.<br />Al completar una experiencia, elegí el lugar en el mapa.</p>
      </div>
    )
  }

  return (
    <div>
      <div ref={ref} style={{ width: '100%', height: 340, borderRadius: 18, overflow: 'hidden' }} />
      <div className="center sub" style={{ paddingTop: 14 }}>
        {conUbicacion.length} {conUbicacion.length === 1 ? 'lugar en su mapa' : 'lugares en su mapa'}
      </div>
    </div>
  )
}
