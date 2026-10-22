# Revisión del 22 de octubre de 2026

Validación: 23 páginas y 146 archivos; 17 pruebas de Node, formato y auditoría npm correctos. Se conservan URLs, títulos y encabezados principales. No se reportaron vulnerabilidades conocidas por npm en las dependencias del proyecto.

Chrome aislado: portada, archivo, artículo de cambio físico y política de cookies, a 390 y 1440 px. Sin infracciones automáticas WCAG A/AA detectadas por axe-core en esas muestras; sin imágenes rotas ni desbordamientos. Probados enlace para saltar al contenido, cierre del menú con Escape y retorno del foco, persistencia del rechazo y ausencia de solicitudes externas durante la lectura. Envío del formulario interceptado localmente: no se creó una suscripción real. Esto no sustituye una evaluación manual completa de accesibilidad ni confirma la entrega de un correo real.

Lighthouse 13.5.0 contra el servidor local, sin consentimiento opcional, con los perfiles oficiales de móvil y escritorio:

| Categoría | Móvil | Escritorio |
| --- | --- | --- |
| Rendimiento | 94 | 100 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| SEO | 100 | 100 |

Móvil: FCP 1,6 s; LCP 2,9 s; TBT 10 ms; CLS 0. Escritorio: FCP 0,4 s; LCP 0,5 s; TBT 0 ms; CLS 0. Son medidas de laboratorio local, no datos de usuarios ni una garantía de esos valores en producción. Sigue habiendo margen para reducir imágenes y el CSS que bloquea el primer render. La newsletter dejó de cargar los scripts y estilos de Brevo al abrir la página; el formulario conserva el destino POST del proveedor.

HTTPS: GitHub ha aprobado el certificado para viveconuve.com y www.viveconuve.com, con vencimiento informado de 2027-01-20. Ambas direcciones han pasado la validación TLS. Se activó `https_enforced: true`. Los registros públicos consultados apuntan a GitHub Pages y no se detectó una política CAA restrictiva.
