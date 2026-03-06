# Contrato de autenticación y roles para el SPA

Este documento define cómo debe integrarse el frontend Angular con los endpoints de autenticación y autorización del backend (Node/Express + Prisma). Sirve como referencia única para desarrolladores y QA cuando implementen flujos de login, refresh y control de permisos.

## Endpoints involucrados

| Método | Ruta | Autenticación previa | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | No | Valida credenciales y devuelve usuario + tokens JWT |
| POST | `/api/auth/refresh` | No (requiere refresh token válido) | Emite nuevos tokens a partir de un refresh token |
| GET | `/api/auth/me` | Sí (access token) | Devuelve el perfil del usuario autenticado |
| Cualquier ruta protegida | `Authorization: Bearer <accessToken>` | Sí | Define qué rol requiere cada router (ver tabla de permisos) |

## Login (`POST /api/auth/login`)
- **Body esperado**
  ```json
  {
    "email": "admin@dulce.com",
    "password": "admin123"
  }
  ```
- **Respuesta (200)**
  ```json
  {
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@dulce.com",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-01-07T15:00:00.000Z"
    },
    "tokens": {
      "accessToken": "<jwt 15m>",
      "refreshToken": "<jwt 7d>"
    }
  }
  ```
- **Notas de implementación**
  - El `accessToken` expira en ~15 minutos (`JWT_EXPIRES_IN`). Conservarlo solo en memoria o almacenamiento seguro del SPA.
  - El `refreshToken` expira en 7 días. Guardarlo en cookie httpOnly o almacenamiento protegido; nunca exponerlo en el DOM.
  - Si el backend responde 401 con mensaje "Credenciales inválidas", mostrar feedback al usuario sin reintentar automáticamente.

## Header estándar
- Toda petición protegida debe incluir: `Authorization: Bearer <accessToken>`.
- Configurar un interceptor HTTP que lea el token desde el estado global y lo adjunte automáticamente.

## Refresh (`POST /api/auth/refresh`)
- **Body**
  ```json
  { "refreshToken": "<jwt 7d>" }
  ```
- **Respuesta**: igual que en login (nuevo objeto `user` + `tokens`).
- **Flujo recomendado**
  1. El interceptor detecta un 401 cuyo mensaje sea "Token inválido o expirado".
  2. Si existe refresh token y todavía no se intentó renovar en esta petición, llamar a `/api/auth/refresh`.
  3. Al recibir los nuevos tokens, actualizar el estado y reintentar la solicitud original.
  4. Si el refresh falla (401), cerrar sesión y redirigir a `/login`.

## Perfil (`GET /api/auth/me`)
- Se invoca al iniciar la app si existe un accessToken aparentemente válido.
- Respuesta: `{ "user": { ... } }` con los mismos campos del login.
- Útil para "hidratar" el store global tras un refresh silencioso.

## Roles y permisos
Actualmente existen dos roles (`prisma/schema.prisma` → enum `Role`):

| Rol | Descripción | Endpoints clave |
| --- | --- | --- |
| `ADMIN` | Administradores/propietarios. Acceso total a catálogos, RRHH, reportes. | `/api/users`, `/api/products`, `/api/suppliers`, `/api/purchases`, `/api/sales`, `/api/shifts`, `/api/payroll`, `/api/fixed-expenses`, `/api/sales-goals`, `/api/reports/*` |
| `CASHIER` | Cajeras. Acceso de lectura al catálogo y creación de ventas, turnos propios. | `/api/products` (GET), `/api/sales` (GET/POST), `/api/shifts` (GET limitado al usuario), `/api/auth/me` |

En el frontend se recomienda modelar los permisos así:
```ts
export const ROLE_PERMISSIONS = {
  ADMIN: [
    'users:read', 'users:create',
    'products:read', 'products:create',
    'suppliers:*', 'purchases:*',
    'sales:*', 'shifts:*', 'payroll:*',
    'fixed-expenses:*', 'sales-goals:*', 'reports:*'
  ],
  CASHIER: [
    'products:read',
    'sales:read', 'sales:create',
    'shifts:read-own'
  ]
};
```
Cada ruta/pantalla debe verificar si el rol actual incluye el permiso requerido. Por ejemplo, el módulo de usuarios solo se muestra si `role === 'ADMIN'`.

## Manejo de sesión en el SPA
1. **Bootstrap**: al cargar la app, revisa si hay tokens persistidos. Si existe refresh token, llama a `/api/auth/refresh` para validar; si falla, fuerza logout.
2. **Estado global**: guardar `user`, `accessToken` y `refreshToken` (o identificador de cookie) en un contexto/servicio de Auth.
3. **Logout**: borrar tokens, limpiar el estado y llevar al usuario a `/login`. Opcionalmente revocar tokens en backend si se implementa endpoint futuro.

## Errores y códigos esperados
| Código | Caso | Manejo en SPA |
| --- | --- | --- |
| 400 | Datos inválidos (por ejemplo, body incompleto) | Mostrar mensaje del backend al usuario |
| 401 | Falta token, token vencido o refresh inválido | Intentar refresh una sola vez; si falla, logout |
| 403 | Usuario sin rol adecuado | Mostrar pantalla "No autorizado" o redirigir al dashboard principal |
| 5xx | Error inesperado | Mostrar mensaje genérico y registrar en sistema de monitoreo |

Mantener esta tabla sincronizada con futuros cambios en el backend. Cualquier ajuste en expiraciones, roles o rutas debe replicarse aquí para que el SPA siga comportándose correctamente.
