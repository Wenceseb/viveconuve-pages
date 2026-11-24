# Mantener ViveConUve

## Revisión del propietario antes de publicar

Desde el 24/11/2026, preparar las nuevas piezas y las tandas de cambios editoriales en local y mostrar a Uve el texto final y una vista previa antes de publicar. La petición de empezar una tanda permite implementarla y comprobarla; la aprobación de publicación se solicita sobre el resultado concreto. Las pruebas técnicas no sustituyen esa revisión. No enviar a `main` ni activar GitHub Pages hasta recibirla.

Antes de presentar la revisión:

1. Buscar coincidencias por evento, fecha, slug y borradores; conservar las URL existentes.
2. Releer el texto completo: tildes, puntuación, nombres, voz del autor y posibles afirmaciones sin fuente. «Guion» se escribe sin tilde. Distinguir un criterio de estilo de una falta ortográfica.
3. Contrastar fecha del evento y publicación, resultado, categoría, imágenes y enlaces. No inventar sesiones, recuperación, cargas, tiempos ni testimonios.
4. Revisar portada, archivo, diario, entrada desde Instagram, información personal y competición. Mantener el contexto de los relatos históricos; actualizar los bloques que describen el estado actual.
5. Revisar título SEO, descripción, H1, canonical, imagen social, texto alternativo y sitemap/RSS. No prometer indexación ni posiciones.
6. Ejecutar las comprobaciones del proyecto, revisar móvil y escritorio y adjuntar capturas. En pruebas de newsletter interceptar los envíos; cualquier alta real requiere un correo de prueba autorizado y su consentimiento.
7. Presentar archivos y textos cambiados, comprobaciones, límites y vista previa. Tras la aprobación, publicar y verificar HTTPS, enlaces y contenido en producción.

Fuengirola ya tiene crónica: `/athlonx-fuengirola-2026-cronica.html`, publicada el 24/11/2026 sobre el evento del 21/11. Resultado: **1.º Open GGEE +55 masculino**. No crear otra URL de ese relato. No añadir tiempos ni número de participantes de su grupo. HYROX Málaga conserva la fecha del 17/04/2027.

## Publicar una actualización del diario

1. Edita `content/pages/camino-a-hyrox.html`. Añade un bloque `article.journal-entry` antes del anterior; conserva las entradas anteriores con sus fechas.
2. Cuenta una decisión o sesión realmente vivida: fecha, objetivo, qué hiciste, mediciones con unidades, sensaciones, contexto, aprendizaje y siguiente paso. Omite los datos que no conoces; no los conviertas en cero.
3. Actualiza la fecha visible y `updated` del diario solo cuando cambie su contenido.
4. Ejecuta `npm run check` y `npm run check:browser` antes de publicar.

No hay automatización ni una frecuencia prometida. Una actualización útil vale más que rellenar una semana.

## Añadir un artículo

Copia la estructura de un artículo en `content/articles/`: metadatos JSON entre líneas `---`, un solo h1, autoría, fecha real y texto final. Usa `editorialStatus: "active"`. Añade su slug sin `.html` a la categoría correspondiente de `content/editorial.json`: esa selección genera automáticamente el archivo y los listados de las secciones. No hay que editar cada tarjeta por separado.

Una pieza nueva necesita experiencia propia, utilidad específica o un aprendizaje documentado. No publiques distintas introducciones para la misma pregunta.

## Añadir una competición

Prepara la ficha con nombre, sede, fecha, modalidad, categoría, resultado conocido y fuente autorizada. Añade aciertos, dificultades y una decisión concreta. Guarda los hechos principales en `content/competitions.json`; una inscripción confirmada y un objetivo son estados distintos. Actualiza el diario y, cuando haya una crónica, enlázala desde `content/pages/competiciones.html`. Si cambia el próximo objetivo destacado en portada, revisa también ese bloque.

La confirmación del 24/10/2026 permite publicar Fuengirola como inscrito y la estructura semanal habitual. No aporta ritmos, cargas, distribución por días, parciales ni adaptaciones demostradas. Uve pidió no enlazar externamente la carrera o los resultados de Córdoba.

## Plantillas internas, pendientes de material real

### Registro de sesión

- Fecha y tipo de sesión:
- Objetivo:
- Qué se hizo (distancias, duración, cargas y unidades):
- Datos medidos y fuente:
- Estimaciones, separadas de las mediciones:
- Sensaciones y recuperación:
- Aprendizaje:
- Siguiente decisión:
- Fotografías autorizadas, sin rutas de domicilio ni identificadores privados:

### Próximos textos

| Tema | Material mínimo antes de escribir en primera persona |
| --- | --- |
| Qué cambié tras Córdoba | Una decisión concreta, qué cambió realmente y cómo se comprobó. |
| Una semana completa | Siete días con fechas, sesiones, descanso y ajustes; la estructura tipo ya está publicada. |
| Correr después de una estación | Registro de una sesión, estación realizada y sensaciones o parciales reales. |
| Trineo y superficies | Material, carga recordada o medida, superficie y límites de la comparación. |
| Revisar una competición | Objetivo previo, resultado conocido, errores y siguiente decisión. |

No copiar datos sensibles de otras cuentas ni inventar escenas para completar estas plantillas.

## Retirada y recuperación

Las seis piezas antiguas se conservan con `editorialStatus: "archived"`, fuera de selección y feeds. No tienen `noindex` añadido: pueden seguir apareciendo en buscadores. Decidir su retirada definitiva requiere datos de tráfico/enlaces, no disponibles en esta ejecución.

Las tres fusiones tienen `editorialStatus: "merged"`, enlace al destino y canonical. GitHub Pages las sirve con HTTP 200: no son redirecciones 301. No se ha cambiado de alojamiento ni DNS para simular esa capacidad. El mapa detallado está en `migracion-2026-10-24.json`.

El commit anterior a esta limpieza es `e09727a87f6b4821a189f491814e991ee2319f4c`; permite recuperar todos los textos. Hay además una copia ZIP local anterior a los cambios en `.maintenance/antes-limpieza-2026-10-24.zip`, fuera del directorio publicado. Los documentos locales ajenos a esta entrega se han conservado.
