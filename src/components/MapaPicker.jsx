import React, { useEffect, useRef } from 'react'

// Mini-mapa para elegir dónde pasó un recuerdo. Tocás y pone el pin.
// Centrado en Tucumán por defecto.
export default function MapaPicker({ valor, onElegir, alto = 200 }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const L = window.L
    if (!L || !ref.current || mapRef.current) return

    const centro = valor?.lat ? [valor.lat, valor.lng] : [-26.8083, -65.2176] // Tucumán
    const map = L.map(ref.current, { zoomControl: true, attributionControl: false }).setView(centro, 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
    mapRef.current = map

    if (valor?.lat) {
      markerRef.current = L.marker([valor.lat, valor.lng]).addTo(map)
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      if (markerRef.current) markerRef.current.setLatLng([lat, lng])
      else markerRef.current = L.marker([lat, lng]).addTo(map)
      onElegir?.({ lat, lng })
    })

    // Fix de tamaño (Leaflet a veces necesita recalcular)
    setTimeout(() => map.invalidateSize(), 200)

    return () => { map.remove(); mapRef.current = null; markerRef.current = null }
  }, [])

  return (
    <div>
      <div ref={ref} style={{ width: '100%', height: alto, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }} />
      <div className="sub" style={{ fontSize: 11.5, marginTop: 6 }}>
        {valor?.lat ? '📍 Ubicación marcada' : 'Tocá el mapa para marcar dónde fue'}
      </div>
    </div>
  )
}
