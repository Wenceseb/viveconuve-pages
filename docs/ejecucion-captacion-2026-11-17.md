# Ejecución del plan: retención y medición

Estado: tercera tanda implementada en local, sin despliegue. Las dos tandas anteriores están publicadas en los commits `bcb682b` y `95514a5`. No se ha autorizado publicar contenido en redes.

## Objetivo y cambios

Convertir una lectura útil en continuación del recorrido o suscripción, aprovechando componentes existentes.

1. Camino a HYROX incorpora el mismo formulario nativo Brevo que ya existe en portada. No se crea otra lista, proveedor, formulario de terceros ni promesa de una frecuencia fija. Se evita el salto a la portada para suscribirse. El identificador de formulario sigue siendo único en cada documento.
2. La guía actualiza la inscripción y fecha personal de Málaga, enlaza a Camino y permite llegar directamente a su bloque de suscripción.
3. Artículos incorpora un enlace contextual al recorrido y a la suscripción. Su cierre incluye Facebook junto a Instagram.
4. `journey_click` mide clics hacia los cuatro destinos editoriales prioritarios y la newsletter. Solo envía un identificador fijo de destino, la ruta de origen y ubicación del enlace. No envía consultas, fragmentos libres, textos de enlaces, correos, notas ni datos de herramientas privadas.
5. `newsletter_submit` mide intentos de envío del formulario nativo. No equivale a alta confirmada; las altas y bajas se consultan en Brevo. No impide ni sustituye el envío nativo.

Se conservan consentimiento y exclusión de analítica de localhost/previews y herramientas privadas. Los eventos nuevos requieren además un identificador GA4 activo. El logo y las URLs no cambian.

## Hallazgo que bloquea el SEO basado en consultas

La sesión de Chrome disponible muestra la propiedad exacta `https://viveconuve.com/` como **sin verificar**. El selector solo mostraba esa propiedad sin verificar y la página indicaba que la cuenta conectada no podía acceder. La documentación del 28/10 registraba acceso; eso es evidencia histórica, no acceso vigente. No se concluye que se haya perdido la indexación ni que Google haya dejado de rastrear.

Se consultó el asistente de métodos de verificación. Ofrecía un archivo HTML oficial; su descarga mediante el control del navegador quedó bloqueada y no se obtuvo un artefacto utilizable. No se fabrica el contenido de ese archivo a partir de su nombre. No se ha añadido un token, cambiado DNS ni confirmado una nueva propiedad. Un intento posterior de recuperar la pestaña indicó que el navegador ya no estaba conectado para control.

Acción pendiente: recuperar la sesión de propietario o aportar el archivo/meta oficial que Google muestre para esa cuenta. Preparar y revisar el cambio de prueba de propiedad antes de desplegarlo; verificar después en Google. Hasta entonces, las prioridades por consultas, CTR, posiciones e indexación continúan sin datos actuales. No crear artículos de variantes de palabras clave para llenar ese vacío.

## Metricool: estado observado

Consulta 08–17/11/2026: el conector devuelve valores web nulos del 08 al 16 y ceros el 17; las cifras sociales del 16 siguen en 195 Instagram y 28 Facebook. El día 17 está incompleto. La respuesta del proveedor ha cambiado respecto de la primera consulta (que devolvía ceros el 16), por lo que debe conservarse fecha de extracción y no tratar estas respuestas como una línea base cerrada.

Las verificaciones públicas anteriores sí observaron solicitudes de Metricool 200 y GA4 204. Eso acredita transporte HTTP, no que el informe agregado esté completo. No se altera el tracker a ciegas ni se contabilizan como audiencia las visitas técnicas realizadas hoy.

## Panel: cómo usar las nuevas señales

En GA4, consultar eventos por `page_path`; `destination` y `placement` deben registrarse como dimensiones personalizadas de evento si se necesitan en informes agregados. Esa configuración de cuenta no se ha realizado. Mantener separados:

- `journey_click`: continuaciones editoriales y clics hacia el bloque de suscripción; una persona puede hacer varios.
- `newsletter_submit`: intento de formulario; no sumar el evento automático `form_submit` como otra alta.
- Altas confirmadas Brevo: fuente de suscripciones reales; no atribuir una alta al clic concreto sin evidencia.
- `instagram_outbound` / `facebook_outbound`: salidas a perfiles, no seguidores.

Tras recuperar recepción e informes: observar 14 días completos, revisar semanalmente y fijar metas a partir de una base válida. No se establecen aún objetivos ficticios de usuarios o ingresos.

## Pruebas

49 pruebas automatizadas correctas sobre el build; 47 páginas y 230 archivos validados. Nuevas regresiones de consentimiento, aislamiento de herramientas privadas y ausencia de datos personales en los eventos.

`check:distribution` pasa a 390 y 1440 px: llegada desde campaña, canonical limpio, primer destino, navegación Artículos → Camino, un único formulario, validación de correo vacío, accesibilidad automatizada y envío POST interceptado localmente. No se envía ninguna suscripción real. Capturas de Camino con newsletter en `.cache/distribution-review/camino-newsletter-*.png`; versión móvil revisada visualmente.

Formato y diff correctos. La revisión actual no afirma éxito en Search Console ni suscripciones nuevas. Las herramientas deportivas permanecen sin cambios.

`check:guide` también pasa a 320, 390, 768 y 1440 px: diseño, accesibilidad, navegación al ejemplo, cancelación y cálculo. Las capturas de Camino con newsletter se han revisado en móvil y escritorio.

## Cola de ejecución vigente

| Prioridad | Trabajo | Estado |
|---|---|---|
| P0 | Recuperar verificación/acceso Search Console | Bloqueo identificado; pendiente prueba oficial o sesión de propietario |
| P0 | Confirmar informes de analítica tras latencia | Transporte comprobado; informe web aún sin línea base |
| P1 | Retención Camino/guía/Artículos y eventos | Implementado y probado en local |
| P1 | Previa Fuengirola con enlaces medibles | Copys y destinos listos; no publicados en redes |
| P1 | Recoger resultados/material después del 21/11 | Pendiente de competir; no redactar resultados anticipados |
| P2 | Mejorar página existente según consultas GSC | Pendiente acceso; no sustituir evidencia por conjeturas |
| P3 | Monetización | Diferida hasta validar audiencia y calidad de datos |

Reversión de esta tanda: retirar bloques añadidos y eventos nuevos, conservar las URLs y reconstruir. No restaurar en bloque archivos no versionados del propietario.
