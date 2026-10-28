# Comparaciones y búsquedas sin resultados

**Actualización:** publicado y verificado en producción en `853cf78`, ejecución `40756219129` (28/10/2026). Las menciones a vista previa o publicación pendiente que siguen describen el estado durante el desarrollo.

Estado: implementado en vista previa; producción permanece en `86c9bc8`.

Al cambiar la selección del comparador, el resultado anterior permanecía visible. Ahora se oculta en el planificador y en el cuaderno, se limpia el error anterior y una indicación pide volver a comparar. El planificador muestra sus errores junto al comparador, en lugar de enviarlos al formulario de estrategia. También se retira cualquier resultado anterior antes de intentar una comparación nueva.

Una búsqueda sin coincidencias ahora se distingue de un cuaderno vacío. Se indica que los registros siguen guardados y se ofrece «Mostrar todos mis registros», que limpia ambos filtros y devuelve el foco al encabezado del historial. No cambia ni elimina datos.

Verificación: regresiones añadidas a `scripts/hybrid-browser-check.mjs`. Correctas a 390/768/1440 px, junto con cálculo, comparación, edición, recuperación, persistencia, PDF, accesibilidad automática y privacidad. También pasan almacenamiento bloqueado/lleno/corrupto y protección de borradores. No se añaden dependencias; se mantiene el presupuesto de JavaScript. La revisión automática no certifica accesibilidad ni sustituye pruebas con dispositivos físicos.
