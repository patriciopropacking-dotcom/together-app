import React, { useState } from 'react'
import { calcularWrapped } from '../data/wrapped'

// Cada slide del Wrapped, con su fondo y su dato grande
export default function Wrapped({ recuerdos, gestos, publicaciones, pareja, go }) {
  const datos = calcularWrapped({ recuerdos, gestos, publicaciones })
  const n1 = pareja?.nombre_1 || 'Luna'
  const n2 = pareja?.nombre_2 || 'Pato'

  // Armar los slides según los datos que existan
  const slides = []

  slides.push({
    bg: 'linear-gradient(160deg,#3A2A22,#2C2636)',
    contenido: (
      <>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.15em', color: 'var(--coral)' }}>{datos.year}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 700, color: '#fff', marginTop: 14, lineHeight: 1.15 }}>
          Su año<br />juntos ❤️
        </div>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 20, maxWidth: 280 }}>
          {n1} y {n2}, esto es lo que vivieron este año.
        </p>
      </>
    ),
  })

  if (datos.experiencias > 0) {
    slides.push({
      bg: 'linear-gradient(160deg,#5A3A2E,#3A2A22)',
      contenido: (
        <>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>Vivieron juntos</div>
          <div className="wrap-num" style={{ fontFamily: 'var(--serif)', fontSize: 96, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{datos.experiencias}</div>
          <div style={{ fontSize: 20, color: '#fff', fontWeight: 700 }}>experiencias</div>
          {datos.mesTop && <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 24 }}>Su mes más activo fue <b>{datos.mesTop.nombre}</b> ✨</p>}
        </>
      ),
    })
  }

  if (datos.gestos > 0) {
    slides.push({
      bg: 'linear-gradient(160deg,#3E5245,#26302A)',
      contenido: (
        <>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>Se dedicaron</div>
          <div className="wrap-num" style={{ fontFamily: 'var(--serif)', fontSize: 96, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{datos.gestos}</div>
          <div style={{ fontSize: 20, color: '#fff', fontWeight: 700 }}>pequeños gestos 💛</div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 24 }}>Los detalles que hacen la diferencia.</p>
        </>
      ),
    })
  }

  if (datos.catFavorita) {
    slides.push({
      bg: 'linear-gradient(160deg,#4A3A5E,#2C2636)',
      contenido: (
        <>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>Lo que más disfrutaron</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 700, color: '#fff', marginTop: 16, lineHeight: 1.1 }}>{datos.catFavorita.nombre}</div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 20 }}>{datos.catFavorita.veces} {datos.catFavorita.veces === 1 ? 'vez' : 'veces'} este año</p>
          {datos.lugarFavorito && <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 8 }}>Su lugar preferido: {datos.lugarFavorito.nombre}</p>}
        </>
      ),
    })
  }

  if (datos.mejorRacha >= 2) {
    slides.push({
      bg: 'linear-gradient(160deg,#5A3A2E,#EE6A54)',
      contenido: (
        <>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.9)' }}>Su mejor racha</div>
          <div className="wrap-num" style={{ fontFamily: 'var(--serif)', fontSize: 96, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{datos.mejorRacha}</div>
          <div style={{ fontSize: 20, color: '#fff', fontWeight: 700 }}>días seguidos 🔥</div>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 15, marginTop: 24 }}>Conectando todos los días.</p>
        </>
      ),
    })
  }

  if (datos.cancionDestacada) {
    slides.push({
      bg: 'linear-gradient(160deg,#2C2636,#4A3A5E)',
      contenido: (
        <>
          <div style={{ fontSize: 40 }}>🎵</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', marginTop: 12 }}>Su canción del año</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, color: '#fff', marginTop: 12, lineHeight: 1.2 }}>{datos.cancionDestacada.titulo}</div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 8 }}>{datos.cancionDestacada.artista}</p>
        </>
      ),
    })
  }

  if (datos.logros > 0) {
    slides.push({
      bg: 'linear-gradient(160deg,#3A2A22,#5A3A2E)',
      contenido: (
        <>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div className="wrap-num" style={{ fontFamily: 'var(--serif)', fontSize: 90, fontWeight: 700, color: '#fff', lineHeight: 1, marginTop: 8 }}>{datos.logros}</div>
          <div style={{ fontSize: 20, color: '#fff', fontWeight: 700 }}>logros desbloqueados</div>
        </>
      ),
    })
  }

  // Slide final
  slides.push({
    bg: 'linear-gradient(160deg,#EE6A54,#3A2A22)',
    contenido: (
      <>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
          No estamos guardando fotos.<br />Estamos guardando<br />nuestra vida juntos. ❤️
        </div>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, marginTop: 24 }}>Gracias por otro año, {n1} y {n2}.</p>
      </>
    ),
  })

  const [i, setI] = useState(0)
  const total = slides.length
  const avanzar = () => { if (i < total - 1) setI(i + 1); else go('home') }
  const retroceder = () => { if (i > 0) setI(i - 1) }

  if (datos.vacio) {
    return (
      <div className="screen" style={{ background: 'linear-gradient(160deg,#3A2A22,#2C2636)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <div style={{ fontSize: 50 }}>📖</div>
        <h2 style={{ color: '#fff', marginTop: 16 }}>Su historia recién empieza</h2>
        <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 10, maxWidth: 300 }}>Cuando vivan experiencias y compartan momentos, van a poder ver el resumen de su año acá.</p>
        <button className="btn btn-coral mt24" style={{ maxWidth: 240 }} onClick={() => go('home')}>Empezar a crear recuerdos</button>
      </div>
    )
  }

  const slide = slides[i]
  return (
    <div className="screen" style={{ background: slide.bg, position: 'relative', overflow: 'hidden', transition: 'background .5s ease' }}>
      {/* Barras de progreso arriba */}
      <div style={{ position: 'absolute', top: 'calc(16px + env(safe-area-inset-top,0px))', left: 16, right: 16, display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, idx) => (
          <div key={idx} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#fff', width: idx < i ? '100%' : idx === i ? '100%' : '0%', transition: 'width .4s' }} />
          </div>
        ))}
      </div>

      {/* Cerrar */}
      <button onClick={() => go('home')} style={{ position: 'absolute', top: 'calc(30px + env(safe-area-inset-top,0px))', right: 20, color: '#fff', fontSize: 26, zIndex: 10 }}>✕</button>

      {/* Zonas tocables: izquierda retrocede, derecha avanza */}
      <button onClick={retroceder} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', zIndex: 5, background: 'transparent' }} aria-label="Anterior" />
      <button onClick={avanzar} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', zIndex: 5, background: 'transparent' }} aria-label="Siguiente" />

      {/* Contenido del slide */}
      <div key={i} className="wrap-slide" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px' }}>
        {slide.contenido}
      </div>

      {/* Indicación */}
      {i === 0 && (
        <div style={{ position: 'absolute', bottom: 'calc(40px + env(safe-area-inset-bottom,0px))', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 13, zIndex: 6 }}>
          Tocá para avanzar →
        </div>
      )}
    </div>
  )
}
