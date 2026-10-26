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
