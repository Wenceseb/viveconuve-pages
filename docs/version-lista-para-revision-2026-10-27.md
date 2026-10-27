# Versión de plataforma preparada para revisión

Fecha: 27 de octubre de 2026. Código de la versión: `0cd107df639d51bc6ce896ac9f18fff300735ff9`. Base de producción comprobada con `git fetch origin`: `40299c3d53d84729bd020ea5d0fde222f458258c`.

## Qué se publicaría

- [Planificador HYROX](http://127.0.0.1:8097/planificador-hyrox.html): 12 divisiones oficiales, parciales, comparación, archivo y PDF.
- [Mi progreso](http://127.0.0.1:8097/mi-progreso.html): registros privados locales, comparación equivalente, PDF filtrado, copias de seguridad y protección del borrador.
- [Biblioteca](http://127.0.0.1:8097/estaciones-hyrox.html): recorrido visual, ocho fichas con fuentes y conexión al cuaderno.
- [Agenda](http://127.0.0.1:8097/competiciones.html#agenda): selección de eventos, filtros, archivo, fechas de revisión y comparación de formatos.
- [Laboratorio](http://127.0.0.1:8097/laboratorio.html): primera propuesta basada en Santa Fe, explícitamente sin resultados de seguimiento todavía.
- Accesos a las secciones desde portada y Recursos, SEO de nuevas rutas y archivos versionados para evitar caché obsoleta.

## Comprobaciones

- 37 pruebas de lógica/integración; 47 páginas y 222 archivos validados.
- Herramientas comprobadas en 390/768/1440 px; agenda también en 303/320 px. PDF, persistencia, importación, borradores y fallos de almacenamiento probados.
- Revisiones automatizadas de accesibilidad, enlaces, presupuestos e imágenes completadas según la hoja de ruta. No equivale a certificación ni evaluación con lector de pantalla o dispositivos físicos.
- Auditoría del registro npm: cero vulnerabilidades conocidas, 27/10/2026. Sin nuevas dependencias frente a producción.
- Comparación del contenido: hero, bloque del próximo dorsal y cuerpo original de Santa Fe idénticos a la base de producción. El artículo añade únicamente un acceso al Laboratorio fuera de su relato.
- Integraciones de newsletter y script principal de consentimiento/Metricool sin cambios frente a producción.
- Manifiesto local de integridad: `.cache/release-manifest-20261027.json`, con los 222 archivos generados, tamaños y SHA-256. No se publica este documento ni el manifiesto en la web.

## Publicación y comprobación posterior

La ampliación sigue sin desplegar. Tras la revisión del propietario: integrar esta rama en `main`, ejecutar el flujo de validación y publicación de GitHub Pages y comprobar su finalización. Revisar en el dominio público las rutas nuevas, las imágenes, categorías/PDF, protección de borradores y consentimiento. Probar la newsletter interceptando el envío salvo autorización específica para una suscripción real. Comprobar la recepción técnica de Metricool tras consentimiento; los datos del panel son una comprobación distinta.

## Vuelta a la versión anterior

Conservar el SHA de producción indicado y registrar el SHA de la integración. Si hay una regresión importante, revertir la integración mediante un nuevo commit y desplegarlo con el mismo flujo; no reescribir el historial ni forzar la rama. Los datos de visitantes siguen en sus navegadores; no cambiar ni borrar sus claves de almacenamiento durante la reversión. Hasta verificar el nuevo despliegue, no declarar la recuperación completada.

## Pendiente después de esta entrega

Comprobaciones de Metricool/Instagram/Search Console y línea base real; crecimiento editorial y distribución; observaciones del autor para el Laboratorio; evaluación manual de accesibilidad y dispositivos físicos. No se atribuye a esta versión crecimiento de tráfico ni resultados deportivos.
