# Biblioteca: ficha de competición por modalidad · 30/10/2026

## Problema y resultado

Para reunir las cargas y distancias de una inscripción había que consultar ocho páginas y distinguir tablas individuales, dobles y relevos. La biblioteca existente incorpora ahora una selección de modalidad con las ocho estaciones en orden, enlaces al detalle y salida de impresión/PDF.

No se crea otra calculadora ni una ruta paralela. Se reutilizan las 12 categorías del modelo del planificador, las tablas individuales de las fichas y los datos de dobles/relevos existentes. El generador falla si falta una referencia esperada. No hay una nueva base de cargas independiente que mantener.

## Comportamiento

- Selección inicial vacía: el visitante elige su inscripción, sin presumir género o categoría.
- 12 modalidades: cuatro individuales, cinco dobles y tres relevos. No se inventan dobles mixto Pro ni relevos Pro.
- Relevos mixtos: las cinco estaciones con carga se marcan pendientes de confirmación con la organización. No se extrapolan cargas de otra categoría.
- URL con modalidad seleccionada; recarga y enlaces compartidos conservan la elección. Valores desconocidos muestran el estado inicial sin inyectar contenido.
- PDF mediante impresión nativa, conservando solo la modalidad seleccionada, fuentes y limitaciones. Sin librerías externas, cuentas, almacenamiento ni recogida de datos personales.
- Sin JavaScript, las modalidades se consultan mediante desplegables HTML nativos.
- La biblioteca conserva fichas, índice de estaciones y conexiones al planificador y cuaderno.

## Fuentes y alcance

Reglamentos oficiales HYROX Singles, Doubles y Relay 2026/27, consultados el 30/10/2026:
- https://maintain.hyrox.com/rulebooks/HYROX_RulebookSingles_EN.pdf
- https://maintain.hyrox.com/rulebooks/HYROX_RulebookDoubles_EN.pdf
- https://maintain.hyrox.com/rulebooks/HYROX_RulebookRelay_EN.pdf

Resumen de consulta, no sustituto del reglamento. La ficha no predice ritmos ni prescribe entrenamiento. Las fuentes por estación siguen en sus páginas respectivas.

## Verificación

44 pruebas automatizadas; 47 páginas y 226 archivos validados. Nuevas regresiones para correspondencia de categorías, cargas y límites de relevos mixtos. Prueba permanente de navegador incluida en check:browser: las 12 selecciones, URL, recarga, impresión e entrada inválida.

Pruebas específicas a 320/390/768/1440 px: sin desbordamiento, sin errores JS, axe sin infracciones detectadas, selección y enlaces correctos. Fallback sin JavaScript probado. Captura móvil revisada.

PDF de Individual femenino Open, Dobles masculino Pro y Equipo mixto: una página A4 cada uno. Extraídos con pypdf; render de relevo mixto revisado visualmente. Se corrigió la emulación de impresión del test y una página en blanco por min-height del body. El formato puede variar con papel y márgenes elegidos por el visitante. No se certifica accesibilidad PDF/UA.

## Diseño

Se conserva verde bosque, papel, Barlow/Manrope. La ficha usa una tabla de tres columnas con orden de estación, trabajo y carga; sin gráficos decorativos. Selector con etiqueta, aviso de actualización para tecnologías de apoyo, controles de impresión fuera del PDF. CSS y JS específicos versionados; el JS se carga solo en el índice de la biblioteca.
