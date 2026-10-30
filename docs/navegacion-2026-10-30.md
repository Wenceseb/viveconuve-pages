# Navegación adaptable · 30/10/2026

Hallazgos reproducidos: el menú móvil permanecía abierto al tocar el contenido y conservaba el estado abierto tras pasar por escritorio. Al ocultarse un enlace enfocado por cambio de tamaño, el navegador podía devolver el foco al body.

Correcciones:
- Etiqueta visible «Menú», conservando aria-expanded y nombre accesible Abrir/Cerrar menú.
- Cierre al tocar o llevar el foco fuera del menú, sin atrapar el teclado.
- Estado cerrado al cruzar 768 px; foco en el botón móvil o primer enlace de escritorio cuando el control anterior deja de ser visible.
- Escape y navegación por enlaces conservados. Sin JavaScript, enlaces visibles.
- Portada, identidad, relatos, herramientas y consentimiento intactos. Sin dependencias nuevas.

Verificación específica en Edge: toque exterior, Enter/Tab/Escape, salida del último enlace, cambio repetido de tamaño, foco visible y ausencia de desbordamiento en 320/390/768/769/1440 px. Comprobación sin JavaScript a 320 px. Regresión incorporada a scripts/browser-check.mjs y scripts/lib/navigation-browser-checks.mjs.

42 pruebas existentes y validación de 47 páginas superadas. Captura del menú a 320 px revisada. No equivale a prueba humana con lector de pantalla o iPhone físico.

Criterios de revisión: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md (consultados 30/10/2026). Se aplica el patrón de navegación desplegable, no un diálogo modal.

Publicación: 1e354968ae895ca1dbd0d929d60077c85d27f1a8, ejecución 41022793892. Todas las comprobaciones de build superadas. Verificación real en viveconuve.com completada: cierre exterior, Enter/Tab/Escape, foco entre tamaños, ausencia de desbordamiento 320–1440 px y navegación sin JavaScript correctos.
