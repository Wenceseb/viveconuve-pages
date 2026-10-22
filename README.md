# ViveConUve

Sitio editorial estático de Wenceslao «Uve». Producción: https://viveconuve.com/.

## Desarrollo

Requiere Node.js 22.23.4 o un parche posterior de Node 22. La referencia está en `.node-version`; la compilación rechaza versiones anteriores y cambios de versión principal sin revisar.

```sh
npm ci --ignore-scripts
npm run check
npm run dev
```

## Estructura

- `content/articles/`: artículos en HTML con metadatos JSON al principio.
- `content/pages/`: portada, archivo, páginas legales y 404.
- `content/site.json`: navegación y configuración compartida.
- `src/templates/`: estructura HTML y componentes compartidos.
- `src/styles/` y `src/scripts/`: código del sitio.
- `assets/images/`: imágenes fuente.
- `public/`: archivos que se copian sin transformación, como robots.txt y descargas. RSS y sitemap se generan desde el contenido.
- `scripts/`: compilación, validación y servidor local.
- `tests/`: comprobaciones de regresión.
- `dist/`: resultado generado, ignorado por Git y único directorio publicado.

Las URL de los artículos no cambian. El código fuente, dependencias y pruebas nunca se publican en GitHub Pages.

## Publicación

GitHub Actions compila el sitio desde `main` y publica `dist/`. Las ramas y pull requests se comprueban sin desplegar en producción.

## Comprobaciones

```sh
npm run check
npm run format:check
npm audit --audit-level=low
npx --no-install playwright install chromium
npm run check:browser
```

Las pruebas cubren la conservación de las 23 páginas iniciales, URLs, metadatos, enlaces, recursos, formularios y consentimiento. La compilación genera imágenes WebP adaptables y bundles con hash. No hay dependencias de ejecución para los visitantes.

Las pruebas de navegador revisan las 23 páginas a 390 y 1440 px con axe-core, comprueban teclado, imágenes, consentimiento y el POST del formulario mediante una interceptación local sin suscripciones reales. Se ejecutan antes de cada publicación.

## Documentación

- [Arquitectura y despliegue](docs/architecture.md)
- [Cómo editar y añadir contenido](docs/editing-content.md)
- [Skills instaladas y revisión de procedencia](docs/design-skills.md)

Las imágenes y textos pertenecen a sus respectivos titulares; la publicación del repositorio no concede una licencia general sobre el contenido editorial.
