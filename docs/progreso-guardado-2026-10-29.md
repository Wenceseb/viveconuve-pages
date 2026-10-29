# Cuaderno: guardar y encontrar una referencia

29 de octubre de 2026. Corrección sobre la versión publicada, sin cambios en el formato de los datos guardados.

- Un registro nuevo o editado deja de quedar oculto por los filtros activos: se retiran únicamente cuando lo excluirían. Los filtros compatibles permanecen.
- El foco pasa al registro afectado; la confirmación anuncia el estado de almacenamiento y explica la retirada de filtros.
- Si no se puede persistir, se mantiene el aviso de datos disponibles solo durante la sesión y la posibilidad de descargar copia. No se comunica un guardado permanente falso.
- La exportación PDF conserva su comportamiento, separada en un módulo propio versionado para mantener el presupuesto de cada archivo y facilitar su mantenimiento.

Validación local: 39 pruebas unitarias, 47 páginas y 223 archivos; formato correcto. Pruebas reales de navegador a 390, 768 y 1440 px: creación, edición, filtros compatibles e incompatibles, foco, comparación, persistencia, PDF, importación y accesibilidad automatizada sin incidencias detectadas. Casos de almacenamiento bloqueado, lleno y corrupto conservan la advertencia y la recuperación. También pasan los ocho recorridos desde las estaciones y las doce categorías del planificador. No sustituye una evaluación manual completa de accesibilidad.

Captura revisada: `.cache/progress-save-390.png`, con datos ficticios en un contexto aislado, nunca en el cuaderno del propietario. Sin servicios, costes o dependencias nuevos. Publicación: pendiente de comprobar el despliegue de esta revisión.
