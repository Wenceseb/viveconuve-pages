# ViveConUve · hoja de ruta única

Fecha de revisión: 26 de octubre de 2026. Integra el plan del 24/10, el trabajo publicado y el brief definitivo del 25/10. Este documento es la referencia de ejecución; los anteriores quedan como investigación y antecedentes.

## Decisiones de integración

- Continuar el generador estático, HTML, CSS y JavaScript existentes. Sin framework, backend, cuentas ni nuevas dependencias.
- Mantener navegación principal y portada aprobada: fotografía, logo, colores, composición, siguiente dorsal y «Entreno. Aprendo. Lo cuento.».
- Recursos sigue siendo el punto de entrada. Calculadora rápida → planificador detallado; revisión personal → ficha de progreso. No se migran ni borran las claves existentes de checklist y revisión.
- Rutas propuestas: `/planificador-hyrox.html`, `/mi-progreso.html`, biblioteca con fichas independientes, `/laboratorio.html`. La agenda ampliará `/competiciones.html`, sin crear un calendario paralelo.
- Modelo: escenarios y registros locales versionados, en segundos y unidades explícitas. Importación validada y aditiva; exportación abierta. No se envían datos ni analítica desde las herramientas.
- Publicación por fases. El artículo y los dos enlaces sociales tienen autorización directa; la plataforma se presenta en vista previa antes de publicar.

## Sistema visual de la primera fase

Conservar verde bosque #193b32, papel #f6f7f2, superficie #e3ebe4, gris #5d6861 y el acento teja existente. Barlow Condensed para titulares; Manrope para texto y controles. Alineación izquierda. El planificador se organiza como una hoja de estrategia: ocho bloques consecutivos y un resumen legible. Progreso se organiza como cuaderno de referencias: formulario breve, historial y evolución de una misma prueba. Evitar tarjetas idénticas y cifras decorativas.

Escritorio: encabezado editorial → formulario / resumen lateral → comparación → archivo local.
Móvil: encabezado → formulario por bloques → resultado → comparación vertical → archivo local.
Los gráficos representan únicamente datos introducidos. Las tablas conservan la información sin depender del color.

## Inventario y orden

| Trabajo | Estado al inicio | Integración y aceptación |
|---|---|---|
| Portada V2, fuentes locales, originales, imágenes adaptativas | Ya implementado | Preservar la composición elegida |
| SEO técnico, enlaces, sitemap/RSS, consentimiento | Ya implementado | Mantener validadores; ampliar a nuevas rutas |
| Página desde Instagram, enlaces sociales e índices de lectura | Ya implementado | Conectar las nuevas crónicas sin duplicar destinos |
| Brevo: aviso a Gmail y bienvenida sin regalo | Ya implementado | Aviso recibido por Uve; no tocar integración |
| Metricool | Implementado parcialmente | Plan Free verificado; conexión Instagram sin completar |
| 10K Santa Fe y enlaces Valhalla/AthlonX | Pendiente al inicio | Publicar primero, texto íntegro, fotos originales, revisión de producción |
| Calculadora rápida | Ya implementado | Mantener URL y ancla; acceso al detalle HYROX |
| Planificador HYROX | Implementado parcialmente | Ampliar cálculo a 8 bloques, objetivo, A/B, archivo, impresión y recuperación |
| Checklist editable | Ya implementado | Conservar; no ofrecerla como regalo de newsletter |
| Revisión posterior local | Ya implementado | Conservar su escritura libre; enlazar al registro estructurado |
| Ficha de progreso | Pendiente | CRUD, comparación compatible, gráfico, CSV/JSON, almacenamiento fallido probado |
| Biblioteca HYROX | Pendiente | Aprovechar guía introductoria; ocho fichas contrastadas, sin vídeos pendientes |
| Laboratorio | Pendiente | Primer experimento propuesto, datos Santa Fe, sin atribuir resultados ni inicio no confirmado |
| Agenda y comparación de formatos | Implementado parcialmente | Ampliar competiciones existentes; datos oficiales y fechas de revisión |
| Segunda calculadora, segunda checklist, segundo calendario | Descartado por duplicidad | Quedan cubiertos por los componentes existentes y sus ampliaciones |
| Nuevo diseño de hero y lema «Queda mucho por competir» | Descartado | Incompatible con preferencia directa más reciente de Uve |
| Guías con profundidad y evidencia | Implementado parcialmente | Investigación Doctordeporte: metodología, límites, fuentes y gráficos útiles; no copiar contenidos |
| Línea base Search Console / GA4 / Instagram | Pendiente | No inventar visitas, seguidores, conversiones ni atribución |
| Validación humana con lectores de pantalla y móviles físicos | Pendiente | Las pruebas automáticas no sustituyen esta evaluación |
| Distribución editorial y experimentos de captación | Pendiente | Dependen de contenido real y datos suficientes; sin promesas de crecimiento |

## Fases

1. Publicación autorizada de Santa Fe y enlaces sociales.
2. Planificador y progreso: implementación completa, pruebas y demostración. Mantener en revisión.
3. Biblioteca y Laboratorio: fuentes primarias, diagramas propios y experiencias reales.
4. Agenda: formatos, filtros, archivo y guía de mantenimiento.
5. Integración de accesos bajo el hero, SEO y QA general; revisión antes del despliegue importante.

No se marcará como terminada una función por tener solo una pantalla o un enlace. Los estados se actualizarán con pruebas y limitaciones reales al cerrar cada entrega.

## Actualización tras la implementación

- **Ya implementado y publicado:** crónica Santa Fe; enlaces sociales Valhalla y AthlonX, este último corregido contra el enlace del organizador.
- **Ya implementado en vista previa:** planificador HYROX y ficha de progreso, con persistencia, exportación/importación y pruebas de extremo a extremo. Pendiente revisión del propietario y publicación.
- **Implementado parcialmente:** Laboratorio, primer cuaderno completo como propuesta, pendiente de observaciones y fechas reales. Agenda sigue limitada a la estructura personal anterior.
- **Pendiente:** ocho fichas de estaciones, agenda/comparador verificados, integración final de accesos bajo el hero, evaluación manual con tecnologías de apoyo y métricas reales de captación/rendimiento.
- **Descartado por duplicidad:** nuevas versiones paralelas de calculadora rápida, checklist, revisión libre y calendario.

Evidencias y límites: [entrega de esta fase](entrega-plataforma-2026-10-26.md).

## Metricool: publicación autorizada del 26 de octubre

- Tracker web publicado en main, commit `40299c3`, despliegue `40332801005` finalizado correctamente.
- Hash proporcionado por el propietario. Activación tras consentimiento, inicialización única y exclusión de herramientas privadas.
- Verificación real en https://viveconuve.com/: script `be.js` HTTP 200 y petición de visita `c3po.jpg` con el hash correcto HTTP 200. No hubo peticiones Metricool antes de aceptar.
- Políticas informativas actualizadas. Prueba local de navegador con tracker interceptado y pruebas unitarias de consentimiento superadas. Tras integrar en la rama de plataforma: 36 pruebas superadas.
- Esto confirma la instalación y recepción técnica de la visita; no confirma la visualización de estadísticas en el panel ni completa la conexión de Instagram.
- Integración conservada en la rama de plataforma; vista previa reconstruida. Las funcionalidades mayores siguen sin publicarse.

## Revisión de uso y agenda — 26 de octubre de 2026

- Planificador: PDF como acción principal en la hoja de carrera y en el archivo de estrategias. Se explica el destino «Guardar como PDF» de la ventana de impresión. La copia recuperable permanece bajo «Copia de seguridad y cambio de dispositivo», conservando compatibilidad con los archivos anteriores.
- 12 categorías oficiales: 4 individuales, 5 dobles y 3 relevos, con etiquetas en español y explicación contextual. No se inventan dobles mixtos Pro ni relevos Pro; los reglamentos oficiales 2026/27 no incluyen esas divisiones. Los tiempos corresponden al conjunto de la pareja/equipo, sin duplicar la carrera ni dividir las estaciones automáticamente.
- Agenda y comparador implementados en la URL existente `/competiciones.html`: 9 eventos contrastados (7 próximos y 2 pasados a fecha de revisión), filtros por formato/mes/ciudad y archivo temporal. Aviso al superar 30 días desde la comprobación. Plazas sin confirmar, sin precios ni disponibilidad inventados. Todos son españoles, por lo que no se añade un filtro de país sin alternativas.
- Fuente central de mantenimiento: `content/agenda.json`. Verificar con el organizador las fechas antes de cambiar `verified`; no actualizar esa fecha automáticamente al compilar. El renderizador produce HTML accesible sin JavaScript; el navegador añade filtros y mueve los pasados al archivo según la fecha de Madrid.
- Comparador: HYROX, AthlonX, DEKA FIT/MILE/STRONG con fuentes oficiales. Conserva el recorrido personal y distingue la fecha anunciada de Málaga de una inscripción de Uve.
- Estado: implementado en vista previa. La biblioteca de ocho estaciones y la integración final de accesos siguen pendientes; no se consideran terminadas por disponer de investigación.
- Pruebas específicas: filtros, acentos, estados sin resultados, archivo y envejecimiento de fechas en 390/768/1440 px; contraste/accesibilidad automatizada sin infracciones en las pantallas probadas. Planificador: 12 categorías, compatibilidad de guardado y PDF con 32 segmentos; copia de seguridad existente conservada.

## Biblioteca e integración — actualización de esta fase

- **Implementado en vista previa:** índice `/estaciones-hyrox.html` y ocho fichas autónomas: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges y Wall Balls. Cada ficha tiene distancia/repeticiones, cargas cuando corresponden, criterio reglamentario, error que observar, propuesta general de familiarización, esquema SVG original, fuentes y navegación anterior/siguiente.
- Alcance editorial explícito: las tablas son de individuales 2026/27. Se enlazan reglamentos separados para dobles y relevos; no se pretende ofrecer una reproducción exhaustiva de todas las reglas ni una prescripción individual. Explicaciones técnicas adicionales de Concept2 en remo y SkiErg. Sin testimonios atribuidos a Uve que no existan, sin imágenes sintéticas de personas, sin vídeos pendientes.
- **Integración implementada en vista previa:** los dos accesos principales de la sección de herramientas de portada son planificador y progreso; los tres secundarios llevan a estaciones, laboratorio y agenda. Recursos conserva calculadora, checklist y revisión. La guía introductoria HYROX enlaza la biblioteca y esta conecta las herramientas.
- Comparación textual automática con producción: hero y bloque del siguiente dorsal idénticos. No se ha modificado la fotografía, logo ni lema.
- Estilos de biblioteca independientes (`public/assets/library/library.css`), cargados solo en sus nueve páginas. CSS compartido: 49.052 bytes, por debajo del presupuesto de 50 kB.
- **Pendiente de información real:** fechas/observaciones del experimento del Laboratorio, métricas reales de tráfico y seguimiento, verificación de estadísticas en Metricool y cierre de vinculación Instagram.
- **Pendiente de revisión/publicación:** esta ampliación sigue en la rama `codex/plataforma-hibrida`, sin desplegar a producción. Falta revisión del propietario y validación manual con tecnologías de apoyo/dispositivos físicos. No se declara certificación WCAG ni resultados de Core Web Vitals no medidos.
- **Descartado por duplicidad:** segundo calendario, segunda calculadora, segunda checklist; se mantienen las rutas y funciones anteriores.
