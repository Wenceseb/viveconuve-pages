# ViveConUve: auditoría y plan de crecimiento

## Estado operativo vigente y criterios de cierre

Actualización del 17/11/2026 después de las tres tandas publicadas. Los apartados siguientes conservan el diagnóstico y los estados históricos de preparación; esta tabla es la referencia actual para ejecutar el plan.

**Publicado:** conexiones Instagram/Facebook; fechas e inscripción de Málaga; recorrido central e interconexión de portada, crónicas, guía y archivo; entrada de Instagram; cuatro tarjetas sociales; newsletter en Camino; eventos con consentimiento y validación pública. Último commit de producción: `61d2e52`. 50 pruebas correctas en ese despliegue. No se han publicado piezas sociales ni crónicas nuevas.

**Siguiente implementación local:** etiqueta oficial de Search Console en el head estático de portada. Token leído directamente del método «Etiqueta HTML» de Google para la propiedad `https://viveconuve.com/` y la cuenta conectada. Sin DNS, servicios nuevos ni dependencia de cookies. Pendiente de aprobación para desplegar y completar la verificación; no implica indexación automática ni garantiza recuperar informes históricos.

| Orden | Pendiente | Qué permite darlo por cerrado | Dependencia |
|---|---|---|---|
| 1 | Recuperar Search Console | Propiedad verificada, acceso efectivo y lectura de rendimiento, indexación y sitemap | Desplegar etiqueta oficial y completar verificación de la cuenta |
| 2 | Operativizar medición y panel | Eventos visibles en informes GA4, dimensiones de destino/ubicación configuradas si se necesitan, altas confirmadas Brevo y 14 días válidos para línea base | Acceso a GA4/Brevo; procesamiento de proveedores; excluir pruebas técnicas |
| 3 | Activar distribución externa | Bio/enlaces medibles revisados y primer ciclo real de Instagram/Facebook con revisión editorial | Aprobación específica de cambios y publicaciones; material autorizado |
| 4 | Ejecutar SEO con evidencia | Elegir y mejorar páginas existentes según consultas y medir el siguiente periodo comparable | Search Console, demanda observada y muestra suficiente |
| 5 | Cobertura AthlonX | Crónica, material multimedia y análisis independiente aprobados, enlazados y difundidos | Competición del 21/11, resultados, relato y permisos reales |
| 6 | Consolidación 30/60/90 días | Revisiones documentadas, decisiones sobre formatos/páginas y primer dossier comercial con datos verificables | Tiempo de observación y ejecución sostenida |
| 7 | Continuidad Málaga | Hitos útiles de preparación, experiencia del 17/04/2027 y análisis posterior con datos | Entrenamiento, competición, material real y aprobación editorial |

La infraestructura inicial puede cerrarse antes que el plan de crecimiento. El plan de 90 días requiere ejecutarlo y medirlo durante ese periodo; su continuidad narrativa termina después del debut de abril, cuando pueda hacerse el análisis real. No hay una cifra honesta de porcentaje global completado que mezcle código, acceso a cuentas, publicaciones y resultados de audiencia.

### Entregables del brief

| Entregable | Estado actual |
|---|---|
| A. Auditoría | Entregada; pendientes datos actuales de Search Console y CWV de campo. Pruebas técnicas no equivalen a métricas de campo |
| B. Plan priorizado | Entregado; esta tabla actualiza orden y dependencias |
| C. Implementación técnica | Tres tandas publicadas y verificadas; recuperación de Search Console preparada en local |
| D. Distribución | Copys, enlaces UTM, destinos y tarjetas listos; ejecución externa pendiente |
| E. AthlonX | Estructuras privadas listas; competición, resultados y cobertura definitiva pendientes |
| F. Camino a Málaga | Página y captación publicadas; continuidad con experiencias reales pendiente |
| G. Panel | Definiciones y registro semanal listos; informes, línea base y revisión periódica aún por validar |
| H. Hoja de ruta | Diseñada y en ejecución; evaluaciones 30/60/90 días y continuidad hasta abril pendientes |

**Decisión inmediata:** desbloquear datos y activar distribución. No añadir más herramientas públicas para sustituir el trabajo de atraer lectores. Después del primer ciclo, priorizar lo que traiga lectores pertinentes, conversación o altas confirmadas con esfuerzo sostenible. La monetización de 500–1.000 €/mes continúa como aspiración por validar, no como resultado alcanzado.

---

Fecha: 17/11/2026. Entrega local para revisión. No se ha desplegado, publicado contenido nuevo ni programado redes. Complementa la documentación anterior; no sustituye sus registros históricos.

**Actualización de ejecución:** se implementan también los enlaces contextuales de portada y crónicas hacia el recorrido y Facebook. Una prueba pública consentida confirma respuesta 200 del registro de Metricool y 204 de GA4, sin solicitudes anteriores al consentimiento. Sustituye el estado inicial de «no se ha ejecutado una visita sintética» descrito más abajo. Falta comprobar su aparición en los informes y fijar una línea base; no se considera resuelto el vacío histórico. Evidencia en `validacion-crecimiento-2026-11-17.md`.

## Decisión principal

Dedicar el esfuerzo a distribuir las historias y recursos existentes. Reutilizar `/camino-a-hyrox.html` para el seguimiento hasta Málaga y `/desde-instagram.html` como entrada desde la bio. No crear otro diario, calculadora, newsletter ni páginas vacías para resultados futuros.

## A. Diagnóstico y evidencias

**Comprobado en el proyecto:** sitio estático, Node 22, compilador propio, contenido HTML con cabecera JSON, plantillas comunes, imágenes adaptables WebP, JS/CSS versionados y despliegue de `dist/` en GitHub Pages. GitHub Actions despliega al actualizar `main`: no hacer push a esa rama sin aprobación. Hay un repositorio Git independiente dentro de `public-site`; el directorio padre no es la referencia de cambios del sitio.

Se revisaron configuración, compilador y bibliotecas, plantillas, scripts de consentimiento y herramientas, estilos, inventario completo de páginas/artículos y pruebas. No se ha realizado una nueva comprobación científica de cada afirmación de los artículos ni una auditoría de seguridad exhaustiva de todas las dependencias.

Ya existen 47 páginas, ocho fichas de estaciones, guía HYROX, agenda, planificador, cuaderno privado, laboratorio, crónicas de Córdoba y Santa Fe, historia de Valhalla, newsletter Brevo, RSS, sitemap, canonical y controles de duplicados. La documentación del 28/10 registra contaminación histórica con visitas locales y la corrección del dominio de Metricool. No usar ese histórico como línea base limpia.

**Comprobado en producción por HTTPS:** portada, robots y sitemap responden 200. Robots permite rastreo y declara sitemap. La portada carga `site.75f95ed01213.js`; ese script contiene el hash de Metricool que coincide con la cuenta conectada, control de consentimiento y exclusión de orígenes de desarrollo. Esto verifica instalación estática, no recepción de visitas en el servidor de Metricool.

**Comprobado en Metricool, lectura del 17/11:** marca `viveconuve.com`, Instagram `viveconuve71`, Facebook ID `1471635009356505`. Consulta del 08–16/11, Europe/Madrid: datos web nulos del 08 al 15 y ceros el 16; seguidores del 16: Instagram 195, Facebook 28. Nulo y cero se conservan como estados diferentes. El conector define visitantes con agregación SUM: no sumar visitantes diarios para anunciar usuarios únicos semanales. Las cifras del brief de octubre/noviembre son históricas y no se han reinterpretado como línea base fiable.

**Problemas demostrados antes de los cambios:** Málaga figuraba sin inscripción; Facebook no tenía enlaces en los componentes comunes ni evento saliente específico; la agenda de Málaga usaba una fecha de inicio distinta de la ficha actual. No se había conectado claramente la entrada social con el recorrido hasta abril.

**Hipótesis pendientes:** la ausencia de datos web puede deberse a falta de visitas consentidas, bloqueadores, configuración/recepción del tracker o problemas de disponibilidad del proveedor. No hay evidencia para elegir una causa. Falta comprobar recepción de una visita pública consentida y revisar GA4/Metricool con acceso a sus paneles. No modificar trackers a ciegas.

**SEO:** las pruebas locales verifican enlaces y anclas, metadatos, canonical, sitemap de URLs primarias, JSON-LD de artículos y exclusión de duplicados. Rastreo permitido no demuestra indexación: falta una lectura actual de Search Console. No se conocen consultas, posiciones, CTR ni volúmenes de búsqueda actuales. El resultado `site:` tampoco sería una auditoría completa de indexación.

**Rendimiento:** build reduce imágenes fallback de 23.015.245 a 6.744.174 bytes y genera variantes. Es una mejora de recursos, no una puntuación CWV. No se dispone de LCP/INP/CLS de campo actuales; deben consultarse PSI/CrUX o Search Console, registrando si no hay muestra suficiente. Las pruebas de navegador y sus límites se documentan en `validacion-crecimiento-2026-11-17.md`.

## B. Prioridades, impacto y coste

Estimaciones de trabajo, no promesas de resultados. Coste de servicios nuevos: 0 € en esta entrega; no incluye tiempo profesional.

| Orden | Decisión | Impacto esperado | Esfuerzo | Estado |
|---|---|---|---|---|
| P0 | Validar recepción de analítica pública y periodo limpio | Alto: permite decidir con datos | 1–2 h + espera de procesamiento | Instalación comprobada; recepción pendiente |
| P0 | Corregir inscripción y fechas de Málaga manteniendo URLs | Alto para coherencia del relato | Bajo | Implementado localmente |
| P1 | Facebook junto a Instagram y eventos con consentimiento | Medio: continuidad entre canales | Bajo | Implementado localmente |
| P1 | Reutilizar Camino y entrada de Instagram | Alto: destino concreto de difusión | Bajo | Implementado localmente |
| P1 | Preparar cobertura de Fuengirola y recoger material | Alto por proximidad del evento | 2–4 h de preparación; edición posterior | Plantillas privadas listas |
| P1 | Search Console: páginas/consultas y errores actuales | Alto para priorizar SEO | 1–2 h | Pendiente acceso actual |
| P2 | Mejorar guía/fichas según consultas reales | Medio/alto condicionado | 2–4 h por pieza | Cola, sin artículos duplicados |
| P2 | Comparativas de material realmente probado | Condicionado a preguntas y pruebas | 3–6 h por pieza | No crear aún |
| P3 | Oferta comercial piloto | Bajo ahora; potencial posterior | 3–5 h | Tras validar audiencia |

## C. Implementación y reversión

Se conservan logo, URLs, newsletter y herramientas. Cambios: enlaces comunes a ambas redes; `facebook_outbound` equivalente al existente `instagram_outbound`, limitado a la página conectada, sin parámetros ni datos de herramientas; ubicación `header` diferenciada. Se mantienen consentimiento, exclusión de herramientas privadas y bloqueo de analítica en previews.

Camino, Competiciones, Mi historia y entrada de Instagram conectan AthlonX con el debut confirmado. La agenda usa 15–18/04 para el evento y el relato 17/04 como fecha personal. Se amplía la lista de fuentes permitidas de agenda con `hyrox.es`. No se inventan categoría, hora, objetivo cronométrico ni resultados.

La documentación de preparación vive en `docs/`, fuera del contenido publicable. Para revertir, revisar `git diff` dentro de `public-site` y restaurar únicamente los archivos de esta entrega desde HEAD; conservar los archivos no versionados previos. `npm run build` reconstruye `dist/`. No revertir indiscriminadamente todo el directorio.

## D. Distribución: una historia, distintas funciones

- Google → guía o estación → crónica/recorrido → perfil o newsletter. Antes de añadir contenido, mejorar títulos, respuesta inicial y enlaces de las páginas que Search Console muestre con consultas pertinentes.
- Instagram → vídeo concreto → enlace de bio/Story → Camino o crónica exacta. El vídeo aporta una escena; la web explica contexto, datos y aprendizaje. No confiar en URLs de texto del pie de foto como recorrido principal.
- Facebook → relato con una pregunta reconocible → enlace directo a crónica → otra historia. Adaptar el texto; no copiar el pie de Reel sin contexto.
- Web → redes: ofrecer vídeos y conversación relacionados con lo leído. En Camino y Mi historia se explica qué aporta seguir la cuenta, además de los enlaces comunes.
- Comunidades: participar en conversaciones de Valhalla, grupos de running y competición híbrida con respuestas útiles. Compartir un enlace solo si resuelve la pregunta y las normas lo permiten. Uve decide qué publicar; no se contacta con nadie desde esta entrega.

Cadencia inicial propuesta: una pieza principal semanal y una segunda adaptación solo si existe material; dos o tres ventanas de Stories cuando ocurra algo relevante; una historia semanal de Facebook. Reserva orientativa: 3 h semanales entre edición y conversación. Si solo hay un entrenamiento ordinario, no hay obligación de publicar. Revisar carga al cabo de dos semanas.

### SEO: mapa para mejorar lo existente

| Familia de intención | URL principal | Aportación diferenciadora | Evidencia de demanda |
|---|---|---|---|
| HYROX después de los 50 / máster / primer HYROX | `/hyrox-despues-de-los-50.html` | Experiencia propia y referencias separadas | Hipótesis; validar en GSC |
| Preparación / entrenamiento híbrido | `/entrenamiento-hibrido-despues-de-los-50.html` y semana tipo | Organización real con límites claros | Hipótesis; evitar competir entre páginas |
| HYROX Málaga 2027 / debut | `/camino-a-hyrox.html` | Evolución propia y enlaces a experiencias | Evento oficial confirmado; volumen desconocido |
| Estaciones y estrategia | `/estaciones-hyrox.html` y ocho fichas | Formato, condiciones y herramienta existente | Hipótesis; priorizar ficha con impresiones reales |
| AthlonX Fuengirola / experiencia | Crónica futura y análisis independiente | Datos de participante y evaluación documentada | Evento confirmado; demanda desconocida |
| Zapatillas/material híbrido | Futuro, solo si hay prueba propia | Comparación con condiciones de uso | Intención comercial hipotética |

La búsqueda pública confirma resultados sobre Málaga y el calendario oficial, pero no demuestra volumen ni dificultad. Ninguna consulta de este informe se etiqueta como demanda cuantificada. Obtener exportación GSC de 28 días: consultas y páginas, país/dispositivo, impresiones, clics, CTR y posición; comparar con los 28 previos y señalar muestras pequeñas. Priorizar páginas con consultas pertinentes y oportunidades reales, sin umbrales arbitrarios de ranking para todo el sitio.

## E–F. AthlonX y continuidad hasta Málaga

Ver `preparacion-editorial-2026-11-17.md`: estructuras separadas de crónica, análisis y material multimedia. Una galería se integra en la crónica hasta que exista material suficiente para justificar una URL propia. No reservar páginas públicas vacías.

Recorrido: Córdoba → Fuengirola → aprendizaje documentado → preparación específica → referencias comparables → Málaga → análisis. En Camino se enlazan solo capítulos que ya existen. Cada capítulo futuro debe responder una pregunta útil y enlazar al anterior y al índice central.

## G. Panel semanal operativo

Usar `seguimiento-semanal-2026-11-17.csv` como registro local, sin añadir un dashboard público ni otro proveedor. Revisión cada martes, semana completa lunes–domingo, Europe/Madrid. Registrar también fecha de extracción y retraso del proveedor.

| Indicador | Fuente y definición | Límite de interpretación |
|---|---|---|
| Usuarios únicos del periodo | GA4 usuarios, exportación del periodo completo | Solo observados/consentidos; no sumar días ni mezclar Metricool |
| Visitas y páginas vistas | Metricool WTEV02 / WTEV01, por separado | Nulo no equivale a cero; visitas no son personas |
| Orgánico | GA4 sesiones organic search; GSC clics aparte | Clics GSC no equivalen a sesiones |
| Social por campaña | GA4 sesiones con source/medium/campaign | Tráfico sin UTM puede quedar sin atribuir |
| Artículos clave | Vistas de Camino, Córdoba y futura crónica | Una persona puede generar varias vistas |
| Salidas a perfiles | GA4 instagram_outbound / facebook_outbound, por página/placement | Clic no demuestra seguimiento |
| Newsletter | Brevo altas confirmadas y bajas | No contar envío de formulario como alta |
| Comunidad | Seguidores al cierre y diferencia neta, por red | No atribuir todos los nuevos seguidores a la web |
| Participación | Alcance e interacciones por pieza y formato | No sumar alcances como audiencia única; registrar fórmula |
| Retorno | Usuarios recurrentes GA4, si está disponible | Dependiente de consentimiento e identificación |

Protocolo antes de fijar metas: visita pública consentida y rechazada desde navegador limpio; comprobar solicitudes y recepción en GA4/Metricool tras su latencia; probar clic a cada perfil; confirmar que herramientas y localhost no envían medición. No se ha ejecutado una visita sintética consentida a producción para no contaminar estadísticas. Anotar cualquier prueba pública y no presentarla como crecimiento. Si persisten nulos, revisar proveedor y configuración; no añadir un segundo píxel.

Tras 14 días completos con recepción validada, fijar metas a partir de valores reales. Comparar periodos equivalentes, anotando día de competición. No extrapolar una subida de una o dos personas a tasas de crecimiento sostenidas.

## H. Hoja de ruta y decisiones

| Periodo | Entrega y acción | Criterio de salida |
|---|---|---|
| 17–23 nov | Revisar cambios locales, comprobar medición; capturar material de Fuengirola el 21 | Pruebas técnicas y visuales; material identificado; sin resultados anticipados |
| 24 nov–7 dic | Crónica revisada con datos reales; adaptar Reel y relato Facebook; enlazar Camino | Aprobación de texto/material, enlaces y UTMs comprobados |
| 8–16 dic | Análisis AthlonX solo con documentación; mejorar una guía existente | Diferencia clara con crónica y fuentes trazables |
| 17 dic–15 ene | Dos ciclos de distribución sobre guías y experiencias; primer balance de 30–60 días | Medición fiable y utilidad observable; reducir formatos sin respuesta |
| 16 ene–14 feb | Consolidación y dossier de muestra; evaluación de 60–90 días | Audiencia y costes documentados, no proyecciones ficticias |
| 15 feb–14 mar | Referencias/simulacros si existen datos comparables | Mismas condiciones descritas; sin obligación de mejorar marcas |
| 15 mar–16 abr | Ajustes finales y logística de participante contrastada | Información vigente y experiencia propia claramente separadas |
| 17 abr y después | Competición; crónica, análisis y vídeo una vez recibidos datos | Confirmación de resultados, derechos y aprobación editorial |

Reglas de inversión: impresiones pertinentes sin clics → revisar intención/título antes de producir más; visitas sin continuación → revisar enlace contextual; clics a perfil sin crecimiento → evaluar propuesta y perfil, sin afirmar causalidad; poca muestra → ampliar observación. Tras dos ciclos de una pieza, mantenerla si aporta visitas pertinentes, conversación útil o suscripciones confirmadas con esfuerzo sostenible. No descartar una guía evergreen por una semana floja.

## Monetización: condiciones de validación

Empezar con material probado personalmente y un dossier de ejemplos; afiliación solo si responde a preguntas reales. Ofrecer a un centro/organizador una colaboración piloto con entregables delimitados, independencia y etiquetado visible. No se envían propuestas ni se instalan anuncios nuevos.

No existe un mínimo universal de seguidores para colaborar. Umbral interno propuesto antes de presentar propuestas: 8 semanas de datos válidos, al menos 3 piezas representativas con alcance/interacciones y clics documentados, procedencia geográfica disponible y coste real de producción. Son criterios de preparación comercial, no cifras que las marcas exijan. Si falta una muestra suficiente, presentar calidad editorial y limitaciones, sin vender alcance garantizado.

El objetivo de 500–1.000 €/mes permanece por validar. Modelo de viabilidad: ingresos afiliados = clics cualificados × conversión real del comercio × comisión neta; colaboración = precio pactado menos costes/tiempo. No hay datos para asignar valores a esos factores. Posponer productos digitales hasta observar preguntas repetidas y disposición real a pagar. Consultar condiciones vigentes de cada programa antes de contratarlo.

## Fuentes y discrepancias

- [Ficha oficial HYROX Málaga](https://hyrox.es/eventos/hyrox-malaga-26-27/): 15–18/04/2027; distinta del soporte, que aún enumera 14–18/04. Fecha personal 17/04 e inscripción: confirmadas por el autor en el brief.
- [AthlonX Last Wave](https://athlonx.es/last-wave/): 21/11/2026. Su enlace de Instagram apunta a `https://www.instagram.com/athlonx.hybrid/`, mientras el brief indica `@atlonx.hybrid`. El acceso directo a este último no permitió verificar la cuenta. Discrepancia abierta: no reemplazar enlaces por conjetura.
- Metricool, conector de marca y métricas de evolución consultados el 17/11/2026. No se modifican conexiones ni permisos.
- Documentación previa local de medición, captación, Search Console y arquitectura: evidencia histórica, no verificación actual de sus paneles.
