# Editar contenido

1. Buscar el artículo en `content/articles/` o la página en `content/pages/`.
2. Editar su HTML y metadatos JSON. Mantener `permalink` para no romper enlaces existentes.
3. Añadir imágenes fuente a `assets/images/` con nombres en minúsculas. Referenciarlas como `/assets/images/nombre.jpg`; la compilación crea WebP y tamaños automáticamente.
4. Actualizar enlaces en el archivo de artículos y, si procede, RSS y sitemap en `public/`.
5. Ejecutar `npm run check` y `npm run format:check`, revisar `npm run dev` y crear un commit que describa el cambio.

Para añadir páginas se utiliza el mismo bloque de metadatos que en una página existente, con un título, descripción y permalink únicos. El número de páginas del test de conservación es una base de regresión: al añadir contenido, ampliar la base y ajustar el total esperado tras comprobar que no se eliminó ninguna URL.

No editar `dist/`: se regenera en cada compilación. Tampoco copiar cabeceras, scripts ni el formulario a cada artículo: los componentes viven en `src/templates/partials/`.
