# Arquitectura de publicación

## Decisiones

La web es estática y se mantiene así: HTML semántico, CSS y JavaScript nativo. Node.js solo participa en desarrollo y en GitHub Actions; los visitantes no descargan ningún framework, paquete npm ni generador.

Cada artículo está en `content/articles/` y cada página general en `content/pages/`. El bloque inicial entre `---` contiene JSON estricto: `permalink`, `title`, `description`, `layout`, `type`, `robots`, `newsletter` y `structuredData`. El resto es HTML editorial. Los enlaces públicos se conservan aunque los archivos fuente estén ahora en carpetas.

La plantilla `src/templates/layout.html` reúne metadatos, cabecera, pie y consentimiento. `{{campo}}` escapa texto y atributos; `{{{campo}}}` solo se utiliza para HTML interno confiable. `{{> newsletter}}` inserta el formulario compartido. Este motor no evalúa JavaScript en el contenido.

`content/site.json` contiene navegación e identificadores públicos de los servicios existentes; nunca debe contener credenciales. La newsletter usa un formulario HTML nativo y solo conecta con Brevo al enviar; no carga scripts, estilos ni fuentes del proveedor durante la lectura. No se simulan confirmaciones de envío. La analítica y AdSense se cargan tras aceptar cookies; se puede retirar el consentimiento desde el pie.

## Recursos y rendimiento

Las imágenes fuente se conservan en `assets/images/`. Sharp genera WebP de 96, 400, 640, 800 y 1200 píxeles sin ampliar originales, dimensiones intrínsecas, `srcset`, `sizes` y JPEG/PNG de respaldo para las redes sociales. La imagen principal tiene prioridad alta; el resto se carga de forma diferida. `.cache/` evita recomprimir entradas idénticas.

CSS se separa en tokens, base y componentes. Se publica un solo CSS y un JavaScript general con hashes de contenido en sus nombres. La tipografía de cuerpo usa fuentes del sistema y los títulos Georgia, sin descargar fuentes externas. El resultado es determinista para los mismos archivos y año de publicación; no incluye fechas de compilación.

## Controles

`npm run check` compila, ejecuta pruebas y valida el resultado. Se comprueban URLs originales, títulos, descripciones y encabezados principales; enlaces y anclas; JSON-LD; identificadores duplicados; imágenes con tamaño y texto alternativo; ausencia de rastreadores directos y código fuente publicado; presupuestos de 65 kB por HTML, 30 kB de CSS y 12 kB por JavaScript. Estos presupuestos miden archivos locales sin compresión HTTP y no sustituyen una medición real de Core Web Vitals.

`npm run format:check` controla el formato. `npm audit --audit-level=low` bloquea cualquier vulnerabilidad conocida reportada por npm. Esta auditoría revisa dependencias npm, no el propio Node. `.node-version`, `engines`, `engine-strict` y la comprobación previa a compilar exigen Node 22.23.4 o un parche posterior de la rama 22. Actions utiliza la misma versión y acciones oficiales fijadas a commits concretos. Dependabot propone revisiones mensuales; no las fusiona automáticamente.

## Despliegue y recuperación

GitHub Actions valida los cambios y solo publica `dist/` desde `main`, con permisos de despliegue limitados al job correspondiente. Una pull request se valida sin desplegar. Los fuentes, pruebas, documentación y dependencias no forman parte del artefacto.

Para revertir una publicación: crear un `git revert` del cambio que corresponda, ejecutar los controles y subirlo a `main`. Evitar reescribir el historial. El dominio personalizado y HTTPS se administran en Settings > Pages, fuera del código. La permanencia del DNS y la renovación del dominio son independientes del alojamiento de GitHub.
