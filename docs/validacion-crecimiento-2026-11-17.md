# Validación de la entrega local

- `npm run check`: correcto; 45 pruebas, 47 páginas y 226 archivos. Enlaces, anclas, imágenes, metadatos, scripts y presupuestos correctos.
- `npm run format:check` y `git diff --check`: correctos.
- `BROWSER_CHANNEL=msedge npm run check:browser`: correcto. Todas las páginas a 390 y 1440 px con axe; imágenes, teclado, consentimiento y formulario interceptado sin alta real; navegación entre 320 y 1440 px. Comprobaciones adicionales de herramientas y almacenamiento bloqueado correctas.
- `BROWSER_CHANNEL=msedge npm run check:hybrid`: correcto a 390, 768 y 1440 px; almacenamiento limitado, borradores, ocho recorridos de estaciones y PDF con 12 categorías.
- `BROWSER_CHANNEL=msedge npm run check:agenda`: correcto entre 303 y 1440 px; filtros, archivo, fechas, accesibilidad y desbordamiento.
- `BROWSER_CHANNEL=msedge npm run check:guide`: correcto a 320, 390, 768 y 1440 px; recorrido de ejemplo, cálculo, cancelación y accesibilidad.
- Playwright no dispone de su Chromium descargado; se utilizó Microsoft Edge instalado, sin instalar otro navegador.
- Capturas propias de Camino a 390 y 1440 px revisadas visualmente: `.cache/camino-crecimiento-390.png` y `.cache/camino-crecimiento-1440.png`. Logo intacto, lectura sin desbordamiento y enlaces a ambos perfiles presentes.
- Verificación HTTPS pública: portada, robots y sitemap 200; script público con hash de Metricool coincidente, consentimiento y control de origen. No se ha verificado todavía la recepción efectiva de una visita consentida en el proveedor.
- No se ha medido CWV de campo ni comprobado actualmente Search Console. Las pruebas automatizadas no sustituyen iPhone/Safari ni revisión manual con lector de pantalla.
- No se cambian dependencias ni servicios. No se ejecuta una nueva auditoría de vulnerabilidades npm en esta entrega.
- La publicación de nuevos artículos y el despliegue siguen pendientes de revisión del propietario. Las estructuras editoriales permanecen en documentación privada al proceso de publicación.

## Continuación de implementación

Se conecta el bloque de próxima competición de la portada con Fuengirola y Málaga, se incorpora Facebook al bloque personal existente y a las llamadas contextuales de Córdoba y Santa Fe, y se explicita el enlace Córdoba → Camino a Málaga. Se actualiza la fecha de modificación de las páginas afectadas, sin cambiar fechas de publicación de las crónicas.

Se repite `npm run check`: 45 pruebas correctas; 47 páginas y 226 archivos validados.

También se repite `check:browser` con Edge: correcto a 390 y 1440 px, navegación 320–1440 px y capturas de diseños representativos actualizadas. Portada móvil revisada visualmente tras los nuevos enlaces; sin desbordamientos.

Prueba real en producción del 17/11/2026, navegador Edge limpio: ninguna solicitud a Metricool/Google antes del consentimiento; tras aceptar, `tracker.metricool.com/resources/be.js` responde 200, `tracker.metricool.com/c3po.jpg` responde 200 y `region1.google-analytics.com/g/collect` responde 204. APIs de ambos proveedores disponibles. La prueba aporta una visita técnica consentida; debe anotarse al interpretar el periodo. No se envían formularios ni se modifican cuentas. Estos códigos confirman el envío y la respuesta HTTP, no la inclusión definitiva de la visita en los informes ni la integridad histórica de la medición.
