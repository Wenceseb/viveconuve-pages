# Medición: verificación y separación de vistas previas

Se accedió a la sesión existente de Metricool. Instagram `viveconuve71` figura conectado como cuenta profesional y presenta datos. No se modificaron permisos, conexiones sociales ni planes de pago.

La conexión web identificaba el dominio como `127.0.0.1`; el panel mostraba visitas y fuentes de tráfico que incluían pruebas locales. Se corrigió mediante el editor de conexión a `https://viveconuve.com` y se verificó el nombre resultante. No se borró el histórico: no debe emplearse como línea base limpia ni atribuirse a crecimiento orgánico. Cambiar el nombre no demuestra que se hayan filtrado retroactivamente los datos.

Corrección de código: los servicios opcionales (GA, Metricool y anuncios) solo pueden activarse en los dos orígenes HTTPS públicos de ViveConUve. Se mantiene el consentimiento y la exclusión de herramientas privadas. En localhost, IP local, dominio de vista previa, HTTP y puerto alternativo no se carga analítica, aunque exista consentimiento previo. No se añade ninguna dependencia.

Verificación: 38 pruebas correctas y 47 páginas/222 archivos validados. Prueba real en navegador aislado: aceptar cookies y recargar la vista previa no solicita analítica ni anuncios. Los casos de producción con/sin consentimiento y herramientas privadas siguen cubiertos por pruebas. El cambio de código está en vista previa y requiere el próximo despliegue; la corrección del dominio en Metricool ya está aplicada.

La evidencia de cuenta se conserva localmente en `.cache/metricool-conexiones-20261028.png`, fuera de la publicación del sitio. Pendiente: revisar Search Console y establecer un periodo nuevo de medición pública. Los clics hacia Instagram no equivalen a nuevos seguidores; no se atribuyen conversiones que no puedan observarse.
