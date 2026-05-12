# Core layer

`core/` contiene piezas singleton y de alcance global:

- Configuración de app e inyección de ambiente.
- Infraestructura HTTP (`ApiClient`).
- Servicios que viven una sola vez en toda la app.

Regla: `core` no depende de `features`.
