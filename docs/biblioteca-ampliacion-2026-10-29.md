# Biblioteca y cierre de fase

Diseño previo: paleta aprobada bosque #193b32, papel #f6f7f2, blanco #ffffff, verde suave #e3ebe4 y divisor #bbc9c0. Barlow Condensed y Manrope existentes. Mantener cabeceras y navegación. Añadir material/recorrido identificable, tablas por modalidad y un bloque de preguntas de práctica con registro concreto. Una columna en móvil; reglas y lectura claramente separadas. No representar biomecánica ni experiencias inventadas.

Fuentes consultadas el 29/10/2026: reglamentos oficiales HYROX Doubles y Team Relay 2026/27 (maintain.hyrox.com/rulebooks); Concept2 SkiErg Technique. Dobles: tablas de estaciones en páginas 27–37; relevos: páginas 8 y 15–24. Los valores se mantienen en content/station-details.json, separado de los resúmenes existentes de individuales. La ampliación no cambia los cálculos del planificador.

Laboratorio: el propietario confirma que todavía no ha iniciado el seguimiento. Se conserva «propuesto». No se fabrican observaciones para cerrar una casilla.


## Implementación y comprobaciones

Ocho fichas ampliadas con ilustraciones vectoriales originales del material/recorrido, tablas de dobles y relevos separadas de individuales, preguntas para registrar la práctica y fuentes oficiales por modalidad. No se da por resuelta la asignación de cargas de relevos mixtos donde el documento no la explicita. Nuevos datos centralizados en `content/station-details.json` y componentes de generación en `scripts/lib/station-details.mjs` y `station-visuals.mjs`; no se añade JavaScript al navegador.

Entrenar, Recuperar y vivir y Mi historia incorporan fotografía existente y composición editorial. Se retira la aparición residual del lema rechazado en Mi historia. La portada inicial y las crónicas originales no se alteran.

42 pruebas automatizadas y validación de 47 páginas/223 archivos. Biblioteca y tres secciones comprobadas a 320/768/1440 px: sin desbordamiento, errores de JavaScript ni incidencias Axe detectadas. Revisión visual de capturas en .cache. Pruebas globales de navegador a 390/1440 px, con muestras adicionales a 375/768; teclado, imágenes, consentimiento y formularios interceptados. Herramientas y ocho recorridos desde estaciones: pruebas completas aprobadas, incluyendo almacenamiento bloqueado/lleno/corrupto y PDF.

La primera ejecución del comprobador general no encontró Chromium local; se repitió con Edge ya instalado y pasó. No se instaló otro navegador.

Rendimiento de laboratorio: Edge, 390×844, CPU a 4×, 1,6 Mbit/s y 150 ms de latencia, caché desactivada, servidor local. LCP: portada 1688 ms; SkiErg 1380 ms; Mi historia 1360 ms; Artículos 1532 ms. CLS respectivo: 0,00184; 0,05809; 0,00095; 0,03465. Una ejecución por página, sin distribución estadística. No mide INP de campo ni sustituye Safari/iPhone o lector de pantalla físico. Evidencia `.cache/performance-phase-20261029.json`.

Vídeo de Córdoba: archivo aportado, 37,9 s, 720×1280, H.264/AAC. Copia optimizada temporal de 28.268.870 a 7.219.368 bytes, audio conservado. Vista previa independiente sin descarga del vídeo antes de reproducir; reproducción comprobada. No incorporado ni publicado en la crónica; falta revisión del audio y decisión sobre la inserción. Utilidad gratuita imageio-ffmpeg 0.6.0 aislada en .cache, sin cambiar dependencias del sitio.

Captación: plan ejecutable de mantenimiento y difusión en `captacion-ejecucion-2026-10-29.md`. No se enviaron correos ni publicaciones sociales. Search Console pendiente por bloqueo de cuota de revisión automática. Laboratorio pendiente de datos reales, confirmado por el usuario.

Publicación de este lote: pendiente de comprobar el despliegue.
