# Search Console: revisión y acciones

**Actualización:** publicado y verificado en producción en `853cf78`, ejecución `40756219129` (28/10/2026). Las menciones a vista previa o publicación pendiente que siguen describen el estado durante el desarrollo.

Acceso confirmado a la propiedad `https://viveconuve.com/`. Sitemap `/sitemap.xml` correcto, leído el 28/10, con 34 URLs descubiertas; coincide con el sitemap público. No es necesario enviarlo otra vez. El informe de indexación estaba actualizado al 23/10, por lo que no representa todavía el despliegue más reciente. Core Web Vitals no dispone de datos suficientes en el panel: no se declara que la web supere sus métricas de campo.

## Exclusiones contrastadas

- El antiguo 404 `/rutina-fuerza-en-casa-3-dias-full-body-gente-normal.html` responde HTTP 200 y declara como canonical `/rutina-fuerza-casa-3-dias-full-body.html`. Se inició la validación en Google el 28/10; la validación está en curso, no completada.
- `/index.html` es una alternativa de `/`; no requiere corrección.
- La URL antigua del relato de pérdida de peso declara `/cambio-fisico-a-los-50.html` como canonical. Se conserva esa consolidación.
- El RSS no es un artículo que se deba intentar posicionar.
- Pasos, fuerza y semana tipo responden HTTP 200, son indexables y tienen canonical propio. El informe registra rastreos antiguos; no se atribuye su exclusión a un fallo técnico no demostrado.
- La guía HYROX ya está indexada y Google reconoce su canonical. Su último rastreo visible era del 23/10. Se intentó solicitar actualización, pero Google mostró un error de conexión con reCAPTCHA. No se completó la solicitud; no se eludió el control. La versión actual sigue disponible en el sitemap.

## Correcciones implementadas en vista previa

Cuatro documentos conservaban referencias de imágenes en `/imagenes/` dentro de sus datos estructurados. Se sustituyeron por las imágenes existentes en `/assets/images/`. En las dos variantes de la antigua guía de fuerza se alinearon `mainEntityOfPage` y la última entrada de breadcrumbs con la URL canónica. No se alteraron los relatos ni se reintrodujo la guía archivada en la selección actual.

Nueva prueba sobre el HTML generado: los artículos deben declarar su canonical correcto y sus imágenes estructuradas locales deben existir. Pasan 39 pruebas y la validación de 47 páginas/222 archivos. Pendiente publicar este lote junto con las mejoras ya revisables.

## Prioridades

1. Publicar el lote pendiente y comprobar sus rutas y metadatos en producción.
2. Revisar el resultado de la validación del 404 y reintentar la solicitud de actualización cuando el servicio de Google responda.
3. Valorar la evolución de guías y herramientas con un periodo posterior al despliegue. No promover de nuevo contenido archivado solo porque tenga impresiones.
4. Reforzar enlaces útiles desde las experiencias personales hacia la biblioteca y herramientas; no fabricar volumen editorial para responder a consultas aisladas.

Los datos de rendimiento de la cuenta y las capturas permanecen locales en `.cache/gsc-rendimiento-20261028.txt` y `.cache/gsc-validacion-20261028.png`. No se atribuye crecimiento a cambios recién publicados ni se interpretan los clics como seguidores nuevos.
