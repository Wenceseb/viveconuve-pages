# Implementación V2 · 25 de octubre de 2026

Autorización del usuario: implementar el plan e instalar únicamente skills y plugins de coste cero. No se contratan servicios, pruebas temporales ni planes de pago.

## Entrega

- Portada con fotografía propia, historias de Córdoba y Valhalla, semana confirmada, herramientas y presentación de Uve.
- Tipografía local Manrope / Barlow Condensed con sus licencias OFL; ninguna petición a Google Fonts.
- Sistema tipográfico compartido en todas las páginas y cabecera compacta; crónicas con índice nativo desplegable y columna de lectura.
- `/desde-instagram.html`: tres recorridos hacia Córdoba, preparación de Fuengirola y recursos. No se modifica la biografía de Instagram automáticamente.
- Enlace global a Instagram y evento `instagram_outbound` con `page_path` y `placement`, sin parámetros de consulta ni contenido de formularios. Solo con consentimiento y analítica configurada. No sumar este evento al evento genérico `click` de GA4 como si fueran conversiones distintas. Un clic no demuestra un nuevo seguidor.
- `max-image-preview:large` para permitir imágenes grandes, sin prometer aparición en Discover.
- Rutas existentes, contenido editorial, formularios y herramientas conservados.

## Coste y herramientas

Skills instaladas desde `coreyhaines31/marketingskills`, revisión `e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b`: `seo-audit`, `content-strategy`, `social`. Sin licencia de pago ni servicios contratados. Las carpetas seleccionadas contienen instrucciones, referencias y evaluaciones JSON, no programas ejecutables. Disponibles desde el siguiente turno de Codex.

Metricool: instalación/vinculación ofrecida para usar exclusivamente Free mediante MCP OAuth. Aún no confirmada. Su documentación admite MCP en Free; la API tradicional de pago queda excluida. No se programan ni publican mensajes. Figma, Canva y Windsor.ai no se instalan en esta entrega.

Fuentes: https://github.com/coreyhaines31/marketingskills · https://help.metricool.com/mcp-limits-and-plan-requirements-h72jg

## Verificación y límites

28 pruebas de código; validación de 34 páginas, rutas, imágenes, schema, feeds y formularios. Revisión del conjunto con Edge a 390 y 1440 px, axe, teclado, consentimiento, envío interceptado del formulario y herramientas. Revisión adicional de portada, llegada de Instagram y Córdoba a 320, 390 y 1440 px. Capturas inspeccionadas para corregir interferencias del CSS anterior. Los controles automáticos no certifican WCAG ni el alcance legal; queda revisión con lector de pantalla y dispositivos físicos.

El CSS compartido incorpora las plantillas V2: presupuesto revisado de 30 a 50 kB sin compresión (48,5 kB en esta revisión), manteniendo 65 kB por HTML y 12 kB por JS. El incremento es explícito y verificable; no se añade framework ni dependencia npm. Las fuentes se alojan localmente y usan `font-display: swap`.

## Continuación del plan

1. Vincular Metricool Free, si el usuario completa el acceso, y recopilar datos de GA4/Search Console mediante exportaciones gratuitas. No se inventa una línea base.
2. Verificar alta, confirmación, entrega y baja de la newsletter con una dirección de prueba autorizada. Esta entrega solo verifica el formulario sin enviar datos reales.
3. Resolver finalidades de publicidad/analítica y revisar consentimiento y políticas con ese contexto.
4. Incorporar fotos originales nuevas y relatos de sesiones reales; preparar distribución editorial a partir de material confirmado. No fabricar semanas ni resultados.
5. Medir tras el lanzamiento; evaluar mejoras según datos suficientes. No activar automatizaciones ni gasto.

## Recuperación

Versión anterior: `aec8ac85225b5ec074d23c6fc26b0cc03e30e645`. Revertir el commit de esta entrega, validar y publicar mediante el flujo existente; no reescribir historial.
