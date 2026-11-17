# Segunda tanda: previsualizaciones y distribución

Estado: implementación local, pendiente de revisión y despliegue. Textos sociales en borrador; no se programa ni publica nada en cuentas.

## Qué cambia y por qué

Cuatro páginas reciben tarjetas sociales JPEG de 1200 × 630: Camino, Córdoba, Santa Fe y guía HYROX. Se componen con fotografías existentes, títulos y tipografía propia; no se inventan imágenes del futuro ni se modifica el logo. La tarjeta de Camino usa un retrato, sin sugerir que procede de Málaga. Los archivos llevan hash para renovar su URL cuando cambie la imagen. Las redes pueden conservar caché del HTML y decidir otro recorte: la comprobación local no garantiza su representación exacta en cada aplicación.

El compilador genera las tarjetas y añade dimensiones y texto alternativo para imágenes sociales de todas las páginas. No añade solicitudes durante la lectura, dependencias nuevas ni botones. La entrada `/desde-instagram.html` muestra Camino antes de las herramientas. Mantiene su URL, contenido y canonical.

Referencias técnicas: [Open Graph](https://ogp.me/) para dimensiones y descripción de imagen. Los 1200 × 630 son una decisión de formato de esta entrega, no un requisito del protocolo ni una garantía de alcance.

## Paquete de difusión: publicar solo tras revisión

La difusión de Córdoba, Santa Fe y guía puede empezar con páginas que ya existen. Las tarjetas nuevas requieren el despliegue de esta tanda. Los cuatro destinos funcionan sin ellas. No usar UTMs en enlaces internos. No se afirma que añadir UTMs mida visitas sin consentimiento: atribuyen las sesiones que la analítica consiga observar.

### 1. Córdoba: experiencia real que abre la conversación

**Reel Instagram:** reutilizar el vídeo propio de Córdoba, sin cambiar la fecha ni presentarlo como Fuengirola. Primer texto: «Seis minutos de penalización. Las vueltas también cuentan». Cierre: «La historia completa está en ViveConUve». Subtítulos revisados y audio con derechos.

**Pie propuesto:** «De Córdoba me traje una medalla y seis minutos de penalización. Las vueltas que no conté acabaron contando. En la crónica explico el trineo, el error y la sorpresa al mirar la clasificación. ¿Qué detalle de una carrera te ha enseñado más que el resultado? Crónica y vídeo en el enlace de la bio».

**Story con enlace:** «El podio tiene una historia. Y unas vueltas de menos». Destino:

https://viveconuve.com/atlhonx-cordoba-caliphate-2026.html?utm_source=instagram&utm_medium=social&utm_campaign=historias_hibridas_2026&utm_content=story_cordoba

**Facebook:** «La foto de Córdoba enseña el podio. La carrera también tuvo un trineo difícil, dos vueltas omitidas y seis minutos de penalización. He contado la experiencia completa, incluidos los errores que quiero revisar para la siguiente competición. ¿Qué despiste de una carrera recuerdas todavía?». Añadir este enlace directo:

https://viveconuve.com/atlhonx-cordoba-caliphate-2026.html?utm_source=facebook&utm_medium=social&utm_campaign=historias_hibridas_2026&utm_content=relato_cordoba

### 2. Fuengirola → Málaga: continuidad antes de competir

**Story previa al 21/11:** «Este sábado toca Fuengirola. El trineo, volver a correr y llevar bien la cuenta: tres preguntas que me llevo de Córdoba. En abril llegará Málaga». No convertir esta previa en crónica ni prometer una marca.

https://viveconuve.com/camino-a-hyrox.html?utm_source=instagram&utm_medium=social&utm_campaign=camino_malaga_2027&utm_content=story_previa_fuengirola

**Facebook:** «El 21 de noviembre vuelvo a ponerme un dorsal en AthlonX Fuengirola. Después llegará mi debut oficial en HYROX Málaga, el 17 de abril. Quiero conectar ambas experiencias: qué aprendo, qué necesito revisar y qué cambia en la preparación. He reunido el punto de partida y las historias anteriores aquí».

https://viveconuve.com/camino-a-hyrox.html?utm_source=facebook&utm_medium=social&utm_campaign=camino_malaga_2027&utm_content=relato_previa_fuengirola

**Bio Instagram sugerida**, revisar y cambiar manualmente cuando se apruebe: «Entreno. Aprendo. Lo cuento. / Fuerza, carrera y experiencias reales. / Crónicas y recursos ↓». Enlace:

https://viveconuve.com/desde-instagram.html?utm_source=instagram&utm_medium=social&utm_campaign=camino_malaga_2027&utm_content=bio

Después del 21/11, retirar la previa de la cola; publicar resultados solo con material confirmado y texto aprobado. No dejar este copy programado para una fecha posterior.

### 3. Santa Fe: una historia con preguntas

**Instagram, foto propia:** «50:24 y un trofeo. En Santa Fe también aparecieron preguntas sobre cómo estaba llegando a correr. La crónica reúne lo que pasó y lo que todavía necesito entender. ¿Te ha pasado que el resultado y tus sensaciones cuentan historias distintas?». Story con enlace a la crónica, sin atribuir causas médicas.

https://viveconuve.com/10k-santa-fe-2026.html?utm_source=instagram&utm_medium=social&utm_campaign=historias_running_2026&utm_content=story_santa_fe

**Facebook:** «En el 10K de Santa Fe acabé en 50:24 y primero Máster E local. También terminé con preguntas sobre fatiga y recuperación. He contado la carrera sin dar por demostrado lo que todavía quiero observar. Aquí está la historia completa».

https://viveconuve.com/10k-santa-fe-2026.html?utm_source=facebook&utm_medium=social&utm_campaign=historias_running_2026&utm_content=relato_santa_fe

### 4. Guía HYROX: entrada útil y duradera

**Carrusel Instagram, 4 láminas:** 1) «Antes de apuntarte: entiende la prueba». 2) Ocho carreras de 1 km alternadas con ocho estaciones. 3) La modalidad cambia las referencias: consultar categoría y reglamento. 4) Guía, fichas y herramientas existentes en ViveConUve. Revisar reglamento vigente antes de editar; no presentar consejos de entrenamiento profesional.

**Pie:** «Antes de calcular un tiempo, conviene saber qué estás calculando. He reunido el formato de HYROX, las modalidades y los recursos que uso para entender la prueba. La guía diferencia las referencias del reglamento de mi experiencia. Puedes abrirla desde la bio».

https://viveconuve.com/hyrox-despues-de-los-50.html?utm_source=instagram&utm_medium=social&utm_campaign=guia_hyrox&utm_content=story_formato

**Facebook:** «Si estás mirando HYROX y aún mezclas modalidad, estaciones y grupos de edad, he reunido una guía para empezar por el formato. Incluye enlaces al reglamento, fichas de las ocho estaciones y herramientas de ViveConUve. ¿Qué parte te genera más dudas?».

https://viveconuve.com/hyrox-despues-de-los-50.html?utm_source=facebook&utm_medium=social&utm_campaign=guia_hyrox&utm_content=guia_formato

## Orden sostenible y criterio de evaluación

- 17–20/11: elegir la previa de Fuengirola como pieza principal; una Story y una adaptación Facebook. Córdoba queda como contexto y reserva, no como segunda campaña obligatoria.
- 21/11: capturar material, sin obligación de editar durante la prueba.
- 22–29/11: crónica real cuando haya datos y aprobación; si no están, usar una pieza existente, sin simular resultados.
- Semana siguiente: elegir Santa Fe o guía según preguntas recibidas; no publicar las cuatro piezas de golpe.

Revisar a los 7 días y a los 28: alcance e interacciones por formato, sesiones atribuidas a cada campaña, páginas de destino y clics posteriores a perfiles. Usar el registro semanal existente. Separar la visita técnica de validación del tráfico de audiencia. No interpretar impresiones como visitas ni clics a perfiles como seguidores ganados. Sin volumen suficiente, conservar hipótesis y observar otro ciclo.

Este paquete reduce el trabajo de publicar y da un destino a cada pieza. La audiencia no crecerá por las tarjetas solas: requiere difundir, conversar y evaluar. No se han modificado bios, cuentas ni publicaciones externas.

## Validación y límites

- `npm run check`: 46 pruebas, 47 páginas y 230 archivos correctos. Nueva prueba de archivos sociales reales, dimensiones, formatos, peso y canonical sin parámetros.
- `npm run check:distribution`: correcto a 390 y 1440 px. Comprueba llegada con UTM, primer destino a Camino, canonical limpio, accesibilidad automatizada, apertura de la tarjeta y ausencia de solicitudes externas en preview.
- Las cuatro tarjetas y la entrada móvil se han revisado visualmente. Tarjetas de 56–117 KB. Se usa Sharp ya instalado y las fuentes locales; no se añaden dependencias.
- Nueva comprobación incluida en GitHub Actions antes de publicar. El resto de suites existentes se conserva; no se ha repetido en esta tanda toda la prueba del planificador, que no cambia.
- Fontconfig emite avisos de caché no escribible en el sandbox Windows; la generación y lectura de imágenes completan correctamente y las fuentes aportadas se renderizan. No se alteran directorios ni configuraciones del usuario para silenciarlos.
- No se afirma que se hayan comprobado previsualizaciones reales en Facebook/WhatsApp ni distribución externa. Eso requiere desplegar y compartir los enlaces. La tarjeta puede tardar en actualizarse por caché de la plataforma.
- Reversión: retirar los campos `socialCard`, el generador, los metadatos nuevos y el cambio de orden de la entrada; reconstruir. Las URLs editoriales no cambian.
