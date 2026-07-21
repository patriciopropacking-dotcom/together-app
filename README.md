# Together

Prototipo de app para parejas — React + Vite. 150 experiencias con contexto de Tucumán.

## Verlo en tu compu (2 minutos)

Necesitás Node.js instalado. Después, en la carpeta del proyecto:

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Vas a ver el teléfono con el flujo completo:
Splash → Onboarding → Home → Sorpréndenos → Plan → Lo hicimos → Recuerdos, y las tabs de Explorar y Nosotros.

## Subirlo a Vercel (tu flujo de siempre)

1. Creá un repo nuevo en GitHub y subí todos estos archivos (copiando el contenido en el editor del navegador, como hacés siempre).
2. Entrá a Vercel → **Add New → Project** → elegí el repo.
3. Vercel detecta Vite solo. Dejá todo por defecto:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**. Listo, queda online.

## Los 150 planes

Están en `src/data/planes.js`. Ahora vienen embebidos, así funciona sin backend.

### Cuando quieras conectar Supabase
Ya tenés `supabase_schema.sql` y `planes.csv` de antes. Después de crear la tabla e importar el CSV:

1. `npm install @supabase/supabase-js`
2. Reemplazá el import de `planes.js` por una query a la tabla `planes`.

## Qué falta (para cuando sigas)
- Ilustraciones de la pareja (ahora hay avatares con gradiente).
- Persistencia real (login de pareja, guardar recuerdos, fotos).
- Notificaciones de la Cápsula del Tiempo.
