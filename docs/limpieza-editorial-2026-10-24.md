# Limpieza editorial · 24 de octubre de 2026

## Resultado

Diez artículos activos: Valhalla, Córdoba, HYROX, fuerza, regreso a la carrera, pasos, transformación, proteína, descanso y semana tipo. La selección compartida está en `content/editorial.json`.

Seis piezas históricas fuera de portada, secciones, relacionados, RSS y sitemap: rutina genérica en casa, ayuno, hinchazón, salud mental, terapias complementarias y método UVE. Se conservan accesibles por su URL y marcadas como archivo histórico. Eso no equivale a desindexación.

Tres fusiones: introducción híbrida → guía HYROX; pérdida de 18 kg → transformación; sleepmaxxing → descanso. Las fuentes muestran un enlace al destino y canonical. Limitación: GitHub Pages no configura redirecciones de servidor por ruta; responden 200, no 301. No se usa JavaScript ni meta-refresh como sustituto.

Las dos URL duplicadas heredadas (pasos y rutina) mantienen su canonical y quedan fuera de promoción. Legales conservados y privacidad ampliada para las herramientas locales.

## Confirmaciones del autor

Uve confirmó en esta sesión su inscripción a AthlonX Fuengirola y una semana habitual con dos clases de HYROX, carrera en zona 2, carrera fuerte y fuerza uno o dos días. Se publican como estructura habitual, sin fabricar un calendario, duración ni cargas. No se enlaza externamente la carrera o clasificación de Córdoba, a petición expresa del autor. HYROX Málaga 2027 sigue siendo una intención, sin inscripción confirmada.

## Comprobaciones

- 27 pruebas Node: contenido, URLs, esquema, metadatos, consentimiento, selección, fusiones y ausencia de promoción del archivo histórico.
- Compilación y validador: 33 páginas, 181 archivos; enlaces, anclas, imágenes y presupuestos de CSS/JS correctos.
- Chrome: las 33 páginas a 390 y 1440 px, comprobaciones axe WCAG A/AA, teclado, menú móvil, imágenes, desbordamiento y consentimiento. Sin peticiones externas antes de aceptar o enviar el formulario.
- WebKit 27.2 con emulación de iPhone 13: seis páginas representativas sin desbordamiento ni incidencias axe A/AA; pasan los cálculos, entradas inválidas, persistencia, exportación, impresión y borrado. Es emulación del motor de Safari, no una prueba en un iPhone físico.
- Herramientas: 8 × 1 km a 5:30 = 44:00; 10 × 400 m a 5:00 = 20:00; suma manual, números inválidos, persistencia al recargar, exportación, texto sin interpretar HTML, cancelación y borrado.
- Almacenamiento bloqueado: aviso visible, funcionamiento de sesión y advertencia al salir con notas sin guardar.
- Portada, crónica, diario y herramientas comprobados a 375, 390, 768 y 1440 px. Capturas de móvil y escritorio en `.cache/review-2026-10-24/`, fuera de publicación.
- Impresión: revisión legible desde texto preparado, formularios y menús ocultos. Estilos para imprimir una sola herramienta.
- `npm audit --audit-level=low`: 0 vulnerabilidades conocidas en la consulta de esta ejecución.

## Límites de verificación

No hay conector de Search Console, Analytics o Brevo disponible en esta sesión. No se han supuesto tráfico ni enlaces externos; la retirada técnica es conservadora. Las notas personales de Recursos no se transmiten y esa página no carga analítica ni anuncios, incluso con consentimiento previo.

Se conserva el formulario Brevo y se comprueba el POST mediante interceptación local, sin suscribir una dirección ni enviar campañas. No se ha verificado entrega real ni el flujo remoto completo de doble confirmación; los mensajes y la configuración del proveedor siguen dependiendo de Brevo. No se promete regalo ni cadencia quincenal.

Las comprobaciones son de laboratorio; no miden Core Web Vitals reales ni certifican accesibilidad. No se ha usado un iPhone físico.

## Fuentes consultadas

- Formato HYROX: https://hyroxapac.zendesk.com/hc/en-us/articles/13979737446927-What-are-the-workouts-done-during-a-HYROX-race
- Índice oficial de reglamentos: https://hyroxapac.zendesk.com/hc/en-us/articles/13997708306831-HYROX-Rulebook
- Organizador AthlonX y Fuengirola: https://athlonx.es/ y https://athlonx.es/athlonx/last-wave/
- Proteína, Morton y colaboradores: https://pubmed.ncbi.nlm.nih.gov/28698222/
- Pasos, revisión de 2025: https://pubmed.ncbi.nlm.nih.gov/40713949/
- Descanso e insomnio: https://www.nhlbi.nih.gov/health/insomnia/treatment

La grafía AthlonX se comprueba con el organizador; no se renombra el slug heredado. El resultado de Córdoba se atribuye al relato del autor.
