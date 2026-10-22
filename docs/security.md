# Mantenimiento de seguridad

Revisión del 22 de octubre de 2026. Se requiere Node 22.23.4 o una revisión posterior de la misma rama 22. `.node-version` fija la referencia exacta de desarrollo y CI. La compilación verifica el runtime antes de ejecutarse.

Parche oficial: https://nodejs.org/en/blog/release/v22.23.4/. Corrige vulnerabilidades publicadas de TLS, DNS, Brotli, HTTP, crypto y permisos. Una versión corregida no garantiza ausencia de problemas futuros.

Las dependencias se fijan en `package-lock.json`, se instalan con `npm ci --ignore-scripts` y se auditan con `npm audit --audit-level=low`. npm audit no revisa Node ni la infraestructura de GitHub. Las acciones oficiales están fijadas a commits concretos de versiones estables; Dependabot propone actualizaciones sin fusionarlas automáticamente.

La web pública es estática y no ejecuta Node; este se utiliza solo para compilar y verificar.

Para actualizar: revisar avisos oficiales, ajustar `.node-version` y `engines` si cambia el mínimo, actualizar lockfile y dependencias cuando corresponda, ejecutar las pruebas y comprobar el despliegue de Actions. Los cambios de versión principal requieren una revisión de compatibilidad.
