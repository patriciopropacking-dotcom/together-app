import React, { useState, useEffect } from 'react'

// PEGÁ ACÁ TU API KEY DE GIPHY (de developers.giphy.com)
const GIPHY_API_KEY = 'D0iBWkGjz3iRuS8feYX4JxL0HHDua9ZR'

export default function GifPicker({ onElegir, onCerrar }) {
  const [busqueda, setBusqueda] = useState('')
  const [gifs, setGifs] = useState([])
  const [cargando, setCargando] = useState(false)
  const sinClave = GIPHY_API_KEY === 'TU_API_KEY_ACA'

  // Cargar GIFs (trending si no hay búsqueda, o resultados de búsqueda)
  const cargar = async (q) => {
    if (sinClave) return
    setCargando(true)
    try {
      const base = 'https://api.giphy.com/v1/gifs'
      const url = q
        ? `${base}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13&lang=es`
        : `${base}/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=pg-13`
      const res = await fetch(url)
      const data = await res.json()
      setGifs((data.data || []).map(g => ({
        id: g.id,
        preview: g.images.fixed_width_small?.url || g.images.fixed_width.url,
        full: g.images.fixed_width?.url || g.images.original.url,
      })))
    } catch (e) {
      console.error('Giphy error', e)
    }
    setCargando(false)
  }

  // Cargar trending al abrir
  useEffect(() => { cargar('') }, [])

  // Buscar con debounce (espera a que dejes de escribir)
  useEffect(() => {
    const t = setTimeout(() => cargar(busqueda.trim()), 400)
    return () => clearTimeout(t)
  }, [busqueda])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <button onClick={onCerrar} aria-label="Cerrar" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 0 }} />
      <div className="sheet-up" style={{ position: 'relative', zIndex: 1, background: 'var(--bg-1)',
        borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '14px 16px calc(24px + env(safe-area-inset-bottom,0px))',
        maxHeight: '72vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ width: 42, height: 5, borderRadius: 3, background: 'var(--line)', margin: '0 auto 16px' }} />

        {sinClave ? (
          <div className="center" style={{ padding: '30px 20px' }}>
            <div style={{ fontSize: 40 }}>🎬</div>
            <h3 className="mt16">Falta conectar Giphy</h3>
            <p className="sub mt8">Para buscar GIFs hay que poner la clave de Giphy en la app. Ya casi está.</p>
          </div>
        ) : (
          <>
            <div className="card row" style={{ padding: 12, background: 'var(--white)', gap: 10, marginBottom: 14 }}>
              <span style={{ opacity: .4 }}>🔍</span>
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar GIFs…" autoFocus
                style={{ border: 'none', outline: 'none', font: 'inherit', fontSize: 15, background: 'transparent', flex: 1, color: 'var(--ink)' }} />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {cargando ? (
                <div className="center sub" style={{ padding: 30 }}>Buscando…</div>
              ) : (
                <div style={{ columns: 2, columnGap: 8 }}>
                  {gifs.map(g => (
                    <button key={g.id} onClick={() => onElegir(g.full)}
                      style={{ width: '100%', marginBottom: 8, borderRadius: 12, overflow: 'hidden', display: 'block', breakInside: 'avoid', padding: 0 }}>
                      <img src={g.preview} alt="" style={{ width: '100%', display: 'block' }} />
                    </button>
                  ))}
                  {!gifs.length && <div className="center sub" style={{ padding: 30, columnSpan: 'all' }}>No encontramos GIFs. Probá otra búsqueda.</div>}
                </div>
              )}
            </div>

            <div className="sub center" style={{ fontSize: 11, marginTop: 8, opacity: .6 }}>GIFs por Giphy</div>
          </>
        )}
      </div>
    </div>
  )
}
