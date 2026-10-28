# ViveConUve · hoja de ruta única

Fecha de revisión: 28 de octubre de 2026. Integra el plan del 24/10, el trabajo publicado y el brief definitivo del 25/10. Este documento es la referencia de ejecución; los anteriores quedan como investigación y antecedentes.

## Estado vigente — 28 de octubre

**Actualización de publicación:** plataforma publicada desde `b0308ca`, ejecución `40564501056` finalizada correctamente. La guía HYROX ampliada está publicada desde `86c9bc8`, ejecución `40648977993` correcta. Verificación pública: página y recursos HTTP 200, fotografía y móvil correctos, enlace al planificador y cálculo de 72 a 74 minutos comprobados. La reorganización de Recursos del 28/10 permanece en vista previa.

Alcance publicado y reversión: [documento de versión](version-lista-para-revision-2026-10-27.md). Auditoría npm sin vulnerabilidades conocidas. Verificación posterior: 14 rutas y archivos JS/CSS HTTP 200; planificador con 12 divisiones, cálculo y persistencia tras recarga; cuaderno contextual; filtro de Fuengirola; accesos de portada y ausencia de rastreadores en herramientas privadas. Pruebas en un contexto aislado, sin enviar formularios ni tocar registros del usuario. Evidencia local: `.cache/live-platform-20261027.json`.

Esta tabla sustituye los estados históricos de las actualizaciones fechadas más abajo. «Vista previa» significa desarrollado localmente, todavía sin desplegar.

| Bloque | Estado | Qué falta |
|---|---|---|
| Santa Fe, enlaces sociales y tracker web Metricool | Ya implementado y publicado | Comprobar estadísticas en el panel de Metricool; la conexión Instagram no está acreditada |
| Portada elegida, Brevo y herramientas anteriores | Ya implementado | Conservar identidad, avisos a Gmail y bienvenida sin regalos |
| Planificador HYROX | Ya implementado y publicado | 12 divisiones oficiales, 32 segmentos, comparación A/B, archivo local y PDF |
| Mi progreso híbrido | Ya implementado y publicado | registros, comparación compatible, evolución, PDF de registros filtrados y copias recuperables |
| Biblioteca HYROX | Ya implementado y publicado | índice y ocho fichas con fuentes, diagramas y navegación; cargas de individuales explícitamente delimitadas |
| Agenda y comparador | Ya implementado y publicado | Mantener comprobación de los nueve eventos con sus organizadores |
| Laboratorio | Implementado parcialmente | Estructura y primera propuesta listas; faltan inicio y observaciones reales del autor |
| Integración visual y SEO de nuevas rutas | Ya implementado y publicado | Accesos en portada/Recursos, metadatos y navegación estructurada; continuar mejora editorial y visual |
| Actualizaciones de archivos de herramientas | Ya implementado y publicado | Nombres versionados de scripts, dependencias y estilos; no sustituye recargar una pestaña ya abierta |
| Captación y medición de resultados | Pendiente | Línea base real de tráfico, seguidores y conversiones; cerrar comprobaciones de cuentas antes de atribuir resultados |
| Validación manual de accesibilidad y dispositivos físicos | Pendiente | Lector de pantalla, Safari/iPhone y uso real; las pruebas automatizadas no certifican accesibilidad |
| Segundo calendario/calculadora/checklist | Descartado por duplicidad | Se amplían las funciones y rutas existentes |

Orden actual: completar la guía editorial y probar el recorrido hacia herramientas → revisar su presentación → incorporar la iteración → medir uso real. Sin dependencias nuevas ni servicios de pago.

### Próximos hitos y dependencias

1. Recursos: nueva entrada por necesidades (entender, planificar, revisar), accesos rápidos conservados y explicación del almacenamiento local. Revisar su vista previa. La guía HYROX con ejemplo de 72 minutos ya está publicada.
2. Verificar Metricool e Instagram y acceso a Search Console para obtener una línea base de tráfico y conversiones. No atribuir crecimiento sin datos.
3. Profundizar contenidos conectados a herramientas e Instagram, preservando la portada aprobada. No publicar en redes sin encargo explícito.
4. Completar el Laboratorio con inicio, sesiones y observaciones reales del autor.
5. Validación manual con lector de pantalla y dispositivos físicos; la revisión automática no certifica accesibilidad.

### Protección del trabajo sin guardar — 27 de octubre

Separados el borrador del formulario y los registros que solo existen en memoria. Editar/duplicar otra referencia avisa antes de sustituir un borrador; cancelar conserva sus campos. Modificar el archivo guardado no desactiva el aviso de salida del formulario. Guardar o descartar explícitamente limpia su estado, sin ocultar el aviso por almacenamiento bloqueado. El planificador conserva el aviso si se borra la copia guardada de la estrategia que aún está en pantalla. No se introduce guardado automático ni sincronización.

Pruebas completadas: 37 pruebas de lógica/integración y validación de 47 páginas/222 archivos; herramientas a 390/768/1440 px; borrador conservado al cancelar edición y al borrar otra referencia; aviso de salida activo para registros solo en memoria incluso al abrir un formulario limpio, en almacenamiento bloqueado, lleno y corrupto. PDF, categorías y recorridos desde biblioteca también superados. El aviso de salida depende del soporte y las restricciones del navegador; no garantiza recuperación tras cerrar forzosamente la aplicación.

### Revisión visual de biblioteca — 27 de octubre

Índice convertido en recorrido de carrera: ocho bloques con el kilómetro previo, nombre oficial, explicación en español y distancia/repeticiones. Verde bosque #193b32, papel #f6f7f2, texto secundario #5d6861 y divisores #afc4b8; Barlow para jerarquía y Manrope para lectura. Numeración funcional que corresponde al orden de estaciones; dos columnas en escritorio y una en móvil. Sin fotografía genérica ni nueva dependencia. Fichas con accesos a reglas, práctica y registro.

Revisión de las nueve páginas a 390/768/1440 px: enlaces de sección, ausencia de desbordamiento y Axe sin infracciones detectadas. Capturas examinadas y alineación de filas ajustada. No equivale a evaluación con lector de pantalla ni móvil físico. Pendiente revisión del propietario del conjunto antes de publicación.

### Agenda y Laboratorio — revisión posterior del 27 de octubre

- Agenda con columna de fecha de inicio, datos del evento y fuente/revisión. Las fechas completas siguen visibles y accesibles; el recuadro de fecha es una ayuda visual redundante, oculta al lector de pantalla. No se modifican fechas ni se declara disponibilidad de plazas.
- Laboratorio con índice de cuatro apartados. Se mantiene el estado propuesto y la fotografía original. La ficha de progreso se revisa sin modificar sus datos ni funciones.
- Estilos específicos en `public/assets/editorial/sections.css`, versionados y cargados solo en agenda y Laboratorio; presupuesto global conservado. Incluidos en el control de formato.
- Validación: 37 pruebas, 47 páginas y 222 archivos; filtros/archivo/fechas antiguas de agenda superados a 390/768/1440 px. Agenda, Laboratorio y progreso sin infracciones Axe, desbordamiento ni errores de consola en esos tamaños. Enlaces del índice del Laboratorio verificados. Fotografía comprobada tras decodificar la imagen; la primera captura prematura no se considera evidencia de fallo de la web.
- Cambios aún locales, pendientes de revisión del propietario y publicación de la ampliación. No hay datos nuevos de captación ni resultados reales del experimento.
- La inspección en el panel estrecho detectó desbordamiento a 303 px: filtros adaptados al espacio disponible y tabla comparativa con desplazamiento interno. Comprobado sin desbordamiento de página a 303/320/390/768/1440 px; los dos anchos pequeños se añaden a la prueba permanente de agenda.

### Recorrido biblioteca → cuaderno — 27 de octubre

Las ocho fichas enlazan al formulario de progreso con la estación seleccionada. Se mantienen vacíos fecha, cantidad, tiempo y carga, y no se crea ningún registro al abrir el enlace. El selector ofrece un enlace a la ficha correspondiente; cambia también al editar o elegir otra actividad. Solo se aceptan las ocho claves conocidas en el enlace, nunca HTML o datos personales. Carrera y competición mantienen su formulario habitual. No cambia el formato de almacenamiento ni se añaden servicios externos. En vista previa, pendiente de publicación junto con la plataforma.

Verificado: los ocho recorridos conservan exactamente la copia almacenada de los registros de prueba; valores desconocidos ignorados. Pruebas de herramientas a 390/768/1440 px, PDF, categorías y almacenamiento fallido superadas. 37 pruebas de integración/lógica, 47 páginas y 222 archivos validados; formato correcto.

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

## Inventario inicial — histórico, no estado actual

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

## Primera actualización — histórico

- **Ya implementado y publicado:** crónica Santa Fe; enlaces sociales Valhalla y AthlonX, este último corregido contra el enlace del organizador.
- **Ya implementado y publicado:** planificador HYROX y ficha de progreso, con persistencia, exportación/importación y pruebas de extremo a extremo. Pendiente revisión del propietario y publicación.
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
