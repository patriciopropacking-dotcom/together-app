import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Muestra cualquier error en pantalla en vez de dejar todo en blanco.
function mostrarError(msg) {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML =
      '<div style="padding:60px 24px;font-family:-apple-system,sans-serif;color:#2B2420">' +
      '<div style="font-size:40px">⚠️</div>' +
      '<h2 style="margin:12px 0">Algo falló al cargar</h2>' +
      '<pre style="white-space:pre-wrap;font-size:12px;background:#fff;padding:14px;border-radius:12px;color:#c0392b;overflow:auto">' +
      String(msg) + '</pre></div>'
  }
}

window.addEventListener('error', (e) => mostrarError(e.message + '\n' + (e.filename || '')))
window.addEventListener('unhandledrejection', (e) => mostrarError('Promesa: ' + (e.reason?.message || e.reason)))

try {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />)
} catch (e) {
  mostrarError(e.message + '\n' + (e.stack || ''))
}
