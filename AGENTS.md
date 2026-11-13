# AGENTS.md — Diario de Estudio

Web estática para registrar sesiones de estudio y motivarse viendo la racha de días
seguidos. Proyecto didáctico: el código debe poder entenderlo alguien que empieza a
programar.

## Stack y estructura
- HTML, CSS y JavaScript puros: sin frameworks, librerías, npm, bundler ni build.
- `index.html` (estructura), `styles.css` (estilos), `app.js` (lógica y datos).
- `AGENTS.md` (este archivo): reglas del proyecto para cualquier agente o persona nueva.
- Debe funcionar abriendo `index.html` con doble clic (`file://`): nada de módulos ES
  (`type="module"`), `fetch` a archivos locales ni nada que requiera servidor.

## Comandos
- No hay build, lint ni tests: abrir `index.html` en el navegador es la ejecución.
- Control de versiones: `git add -A && git commit -m "..."` para guardar y
  `git push` para subir a GitHub (remoto: `origin`, rama `master`).

## Convenciones
- Textos de la interfaz en español.
- Código simple, nombres descriptivos y comentarios solo donde aporten.
- Diseño limpio y responsive; cualquier pantalla nueva debe verse bien en el móvil.

## Datos
- localStorage, clave `sesiones-de-diario-de-estudio`: array de
  `{ fecha: "AAAA-MM-DD", tema, minutos }`.
- Si cambias la forma de los datos, mantén compatibilidad con lo ya guardado o el usuario
  perderá sus sesiones.

## Fechas y racha (fácil equivocarse)
- Trabaja siempre con la fecha local del usuario. Nunca uses `toISOString()` ni
  `new Date("AAAA-MM-DD")`: se interpretan en UTC y desplazan el día.
  Formato propio: `aFormatoFecha()` usa `getFullYear/getMonth/getDate`; al interpretar
  una fecha guardada se añade `"T00:00:00"` para leerla en hora local.
- Racha = días consecutivos con al menos 1 sesión que terminan hoy. Si hoy no hay sesión
  pero ayer sí, la racha sigue viva y se cuenta desde ayer.
- Varias sesiones el mismo día cuentan como un solo día.
- Las fechas del futuro no suman todavía: ni minutos ni días de racha. La sesión queda
  en la lista, pero empieza a contar el día que le corresponde.

## Forma de trabajar
- Haz solo lo que se pide: no añadas funcionalidades por tu cuenta.
- Cambios pequeños y enfocados; no reescribas lo que ya funciona.
- Al terminar, resume qué has cambiado y cualquier decisión que deba revisar.

## Límites
- ✅ Siempre: respetar las reglas de fechas y racha, mantener los textos en español
  y actualizar `MEMORY.md` al terminar cada tarea.
- ⚠ Pregunta antes: crear archivos nuevos, cambiar el formato de los datos guardados.
- 🚫 Nunca: añadir dependencias, frameworks o un paso de build.

## Verificación
- No hay tests ni lint. Probar abriendo `index.html` en el navegador.
- Para empezar de cero: DevTools → Application → Local Storage → borrar la clave
  `sesiones-de-diario-de-estudio`

## Memoria (MEMORY.md)
- Al empezar una tarea, lee `MEMORY.md` para conocer el estado del proyecto y las
  decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su
  porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en regla permanente, propón moverlo a `AGENTS.md` en lugar de
  dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales).
