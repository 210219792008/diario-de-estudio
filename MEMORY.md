# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: se actualiza al terminar cada
tarea, resumiendo lo que importa y borrando lo que ya no aporte.

## Estado actual
- Web v1 + "Mi progreso" funcionando: registrar sesiones (fecha, tema, minutos),
  racha 🔥 actual, estadísticas (minutos totales, mejor racha histórica) y lista
  de sesiones. Todo en tres archivos; datos en localStorage.
- Repositorio en GitHub: `210219792008/diario-de-estudio` (rama `master`).
  El historial incluye una portada subida a mano desde la web de GitHub, fusionada
  sin dañar nada (commit `3b66e15`).
- Reglas del proyecto en `AGENTS.md`; agente `tutor` en `.opencode/agents/tutor.md`.
- Sincronización probada en ambos sentidos desde este equipo (Windows): `git pull`
  y `git push` funcionan sin conflictos (nov 2026).

## Decisiones (y por qué)
- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic (`file://`).
- Fecha editable en el formulario: permite registrar días pasados.
- La documentación se adaptó al código real (clave y campos de datos): cambiar la
  clave del localStorage borraría las sesiones guardadas del usuario.
- El botón de borrar sesiones se retiró de la v1 por la regla "nada fuera del
  mensaje"; es recuperable del historial si el usuario lo pide.
- El agente `tutor` concentra los cuatro oficios (profesor, revisor, planificador,
  programador a petición) y pide confirmación para `git push`.

## Aprendizajes y errores a evitar
- Nunca calcular fechas con UTC (`toISOString`): desplaza el día según la zona
  horaria; usar `aFormatoFecha`. Es la trampa clásica de este proyecto.
- La autenticación de GitHub (GCM) puede quedar esperando el login: si el push se
  cancela, reintentalo; la credencial queda guardada tras la primera vez.
- Los modelos gratuitos con cuota (Gemini free) pueden fallar por límite del día:
  no es fallo del proyecto; se reintenta otro día o se cambia de modelo.
- Guardar versión (commit) tras cada avance evita rehacer trabajo. Ciclo fijo:
  cambio → diff → "guarda versión" → push.

## Próximos pasos
- Estadísticas: minutos por tema (continúa "Mi progreso").
- Calendario visual de días estudiados (opción ya vista por el usuario).
- Objetivo diario con barra de progreso (preguntar antes los minutos objetivo).
- Probar `git clone` en el otro equipo para completar la sincronización.
