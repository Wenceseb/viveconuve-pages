# Entrega incremental · 26 de octubre de 2026

## Producción comprobada

- Santa Fe: https://viveconuve.com/10k-santa-fe-2026.html. Commit `4632dae`, despliegue `40291452358` correcto. Texto editorial comprobado íntegramente contra el Markdown suministrado. Fotos originales, no el retoque generativo. Integrado en selección de historias, sitemap, RSS y acceso a última crónica.
- Instagram Valhalla publicado en su primera mención natural.
- Instagram AthlonX corregido a `https://www.instagram.com/athlonx.hybrid/` (con h), destino del enlace Instagram de https://athlonx.es/. Commit `e3ce2a3`, despliegue `40329146223` correcto. HTML público comprobado sin el usuario erróneo anterior. Instagram restringe la lectura automatizada del perfil; la identidad del destino se ha contrastado con el organizador.

## Vista previa, pendiente de revisión y publicación

Servidor local: `http://127.0.0.1:8097`.

### Planificador · `/planificador-hyrox.html`

Ocho bloques con carrera, entrada, estación y salida; total de 32 segmentos, objetivo, diferencia y acumulados. La última salida llega hasta meta. Esta convención está explicada y evita sumar Roxzone dos veces. Categoría identifica el escenario, sin prescribir cargas ni tiempos. Ritmo uniforme y ajustes individuales. Ejemplo inventado claramente identificado, sin Córdoba.

Guardar, listar, renombrar, duplicar, abrir y borrar; A/B con diferencias por segmento y composición; JSON aditivo y hoja imprimible. Máximo 30 escenarios. CSS de herramientas solo cargado en sus rutas; scripts modulares sin dependencias adicionales.

### Progreso · `/mi-progreso.html`

Registro adaptable para carrera, ergómetros, estaciones y competición. Edición, copia con nueva fecha y borrado confirmado. Filtros y búsqueda, comparación con actividad/cantidad/carga/contexto/condiciones coincidentes, gráfico cronológico y tabla con notas. Menor tiempo solo entre referencias marcadas como comprobadas por la persona usuaria. No se presenta como récord oficial ni evidencia causal.

JSON para recuperar y CSV para hojas de cálculo. Importación validada y aditiva, máximo 500 registros; texto tratado como texto, no HTML. CSV protege celdas que empiezan con fórmulas. Copia JSON de hasta 8 MB, suficiente para exportaciones válidas del límite del cuaderno, incluso con notas largas.

### Laboratorio · `/laboratorio.html`

Primer cuaderno «¿Entrenar menos para correr mejor?», con imagen original, referencia Santa Fe, pregunta, cambio propuesto, protocolo de observación, incertidumbre y siguientes pasos. Estado propuesto: no se atribuye a Uve un inicio ni resultados no confirmados. La crónica enlaza al laboratorio fuera del cuerpo editorial original. Estos enlaces y la página del laboratorio no están publicados todavía.

### Lo preservado

Portada, logo, lema, fotografía y siguiente dorsal intactos. Calculadora rápida, checklist y revisión siguen en Recursos y conservan sus claves locales `vcv_checklist_v1` y `vcv_race_review_v1`. Nuevas claves: `vcv_plans_v1` y `vcv_records_v1`. Sin cuentas, sincronización, pagos o nuevas integraciones. El laboratorio no recoge registros de visitantes.

## Verificación realizada

- `npm run check`: 33 pruebas superadas; 38 páginas y 210 archivos, sin enlaces internos, metadatos, imágenes o presupuestos inválidos.
- `npm run check:browser`: revisión general en 390/1440 px; recorridos existentes, teclado, consentimiento, imágenes, formularios interceptados. Capturas representativas también a 375/768 px.
- `npm run check:hybrid`: pruebas reales a 390/768/1440 px, cálculo, A/B, edición, renombrado, importación, exportación, persistencia tras recarga, impresión, comparación compatible, texto no ejecutable y ausencia de peticiones externas en las herramientas.
- Simulaciones de acceso al almacenamiento bloqueado, cuota llena y archivo corrupto: ambos módulos conservan trabajo en memoria, muestran aviso y exportan; el archivo corrupto original no se sobrescribe.
- Axe WCAG 2 A/AA, 2.1 AA y 2.2 AA en las pantallas y estados probados, sin infracciones detectadas. No equivale a certificación de accesibilidad.
- Capturas de herramientas en `.cache/hybrid-2026-10-26/`; crónica en `../entregas-2026-10-26/capturas/`.

## Límites y siguiente trabajo

- Pendientes las ocho fichas completas de estaciones y la ampliación verificada de agenda/comparador. No hay enlaces vacíos para aparentar que existen.
- Laboratorio pendiente de fecha de inicio, sesiones reales y observaciones del autor; la estructura editorial está preparada.
- Falta validación manual con lector de pantalla y dispositivos físicos, especialmente Safari/iPhone. Pruebas actuales: Edge/Chromium automatizado.
- No hay medición real de Core Web Vitals ni línea base de captación para atribuir tráfico o seguidores. No se promete una puntuación ni crecimiento.
- Los datos locales pueden perderse; no hay cifrado de cuaderno ni aislamiento frente a otras personas con acceso al mismo perfil del navegador. Se explica el borrado en equipos compartidos.
- Revisión visual del propietario antes de publicar esta ampliación. No se ha enviado la rama de herramientas a producción.

## Mantenimiento

`public/assets/tools/model.js`: lógica y validación compartidas; `local.js`: persistencia, importación y exportación; `planner.js` y `progress.js`: interfaz; `workshop.css`: estilos exclusivos. Pruebas en `tests/hybrid-tools.test.mjs` y `scripts/hybrid-browser-check.mjs`, integradas en CI. El validador mantiene el presupuesto por archivo y comprueba que el CSS adicional no se cargue fuera de las dos herramientas.

Para un nuevo cuaderno del laboratorio, conservar los apartados de pregunta, referencia, cambio, fechas, observaciones, límites y siguiente paso. Cambiar a «en curso» únicamente con inicio confirmado y a «finalizado» con cierre y observaciones reales. No convertir propuestas editoriales en declaraciones del autor.

## Comprobación final de esta iteración

- 37 pruebas unitarias/de integración superadas; 47 páginas y 221 archivos validados (enlaces, metadatos, imágenes, scripts y presupuestos).
- Revisión general de las 47 páginas en 390 y 1440 px superada: imágenes, desbordamientos, accesibilidad automatizada, consola y recorridos existentes. Portadas representativas también a 375/768 px.
- Herramientas y agenda: pruebas en 390/768/1440 px; categorías, archivo, copias recuperables, impresión/PDF, persistencia, filtros y fecha de revisión. Estados de almacenamiento bloqueado, lleno y corrupto conservan trabajo y exportación.
- Detectado y corregido un conflicto de contraste en los accesos secundarios de portada. Revisión repetida correctamente.
- Esta ampliación está preparada para revisión en http://127.0.0.1:8097/ y continúa sin publicarse en producción. No implica que se hayan medido Core Web Vitals de usuarios reales ni certificado accesibilidad.
