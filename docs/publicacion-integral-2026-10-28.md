# Lote publicado el 28 de octubre de 2026

Producción: `853cf78348459f96e125dc58401dabba4d0ad59b`. Versión anterior: `86c9bc889df7246f0a57eca8c8b8f8efdda2ed0c`. GitHub Actions: https://github.com/Wenceseb/viveconuve-pages/actions/runs/40756219129 — completado correctamente.

## Alcance

- Recursos ordenados por necesidades, conservando las utilidades existentes y su acceso rápido.
- Historias con las imágenes existentes de Santa Fe, Córdoba y Valhalla, índice de lectura y enlaces hacia la guía y herramientas.
- Comparaciones retiradas al cambiar la selección, errores junto al comparador y recuperación de búsquedas sin coincidencias.
- Analítica y publicidad limitadas a los orígenes HTTPS públicos de ViveConUve, con consentimiento y exclusión de herramientas privadas.
- Referencias de imágenes y URL principal reparadas en datos estructurados antiguos.

Portada, cabecera y relatos originales conservados. Sin nuevas dependencias ni costes. No se enviaron newsletters ni publicaciones sociales.

## Evidencia

CI: auditoría de dependencias, 39 pruebas, validación de 47 páginas/222 archivos, formato y pruebas de navegador, herramientas, agenda y guía aprobadas. Manifiesto de archivos y comprobación de relatos intactos: `.cache/release-manifest-20261028.json`.

Verificación posterior en la web pública a 390 y 1440 px: imágenes y navegación, calculadora, escenarios guardados y comparación, ocultación de resultados antiguos, filtro vacío y recuperación del cuaderno. Portada con lema aprobado. Analítica activada únicamente tras consentimiento y excluida en herramientas privadas; scripts de terceros interceptados para evitar visitas artificiales. Datos de prueba en contextos de navegador aislados, sin tocar datos del propietario. Metadatos reparados e imágenes referenciadas comprobados por HTTP. Resultado `.cache/live-release-20261028.json`; capturas `.cache/live-stories-*-20261028.png`.

## Límites y continuación

No se declara crecimiento de tráfico, certificación de accesibilidad ni superación de Core Web Vitals. Continúan pendientes medición posterior, prueba con usuarios/dispositivos físicos y observaciones reales para el Laboratorio. Search Console tiene en curso la validación del 404; la solicitud de actualización de la guía falló por conexión con reCAPTCHA, aunque la guía está indexada.

Para revertir, generar un nuevo commit que revierta los cambios de producto del intervalo `86c9bc8..853cf78`, revisar y ejecutar las mismas comprobaciones antes de desplegar. No forzar el historial remoto ni borrar datos guardados del visitante.
