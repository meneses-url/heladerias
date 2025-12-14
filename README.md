# Dulce Tentación – Sistema de Administración

Proyecto educativo y profesional para digitalizar la operación de la heladería **Dulce Tentación** usando Angular (frontend), Node.js/Express + Prisma (backend) y MySQL.

## Objetivo
Gestionar ventas diarias, inventario, compras, RRHH y generar reportes mensuales de ingresos vs costos, ventas por producto, uso de insumos y pagos a trabajadores.

## Arquitectura
- **Frontend**: Angular SPA para administrador y cajeras (rutas protegidas, módulos por dominio).
- **Backend**: Node.js + Express + Prisma, capas (router → controller → service → repository), autenticación JWT.
- **Base de datos**: MySQL con migraciones versionadas (Prisma Migrate).

## Recursos y Endpoints Iniciales
Todas las rutas (salvo `POST /auth/login`) requieren JWT. Respuesta estándar:
```json
{
  "data": {...},
  "meta": {...},
  "errors": []
}
```

### 1. Autenticación y usuarios
- `POST /auth/login` – body: `{ email, password }` → tokens de acceso/refresh.
- `POST /auth/refresh` – recibe refresh token y devuelve par nuevo.
- `GET /auth/me` – perfil del usuario conectado (rol, permisos).
- `GET /users` – solo admin; lista usuarios, roles, estado.
- `POST /users` – crea cajera/admin (nombre, email, password, rol).

### 2. Catálogo de productos
- `GET /products` – lista productos base con variantes activas.
- `POST /products` – crea producto (nombre, categoría, descripción, estado).
- `POST /products/:id/variants` – tamaño/presentación, precio, vigencia.
- `GET /products/:id/variants` – consulta variantes.

### 3. Proveedores y compras (control de costos)
- `GET /suppliers` / `POST /suppliers` – catálogo básico.
- `POST /purchases` – registra gastos operativos asociados a proveedores (cada item especifica descripción, categoría, cantidad y costo unitario).
- `GET /purchases?month=` – consulta compras por mes para el flujo de caja.

### 4. Ventas, promociones y catálogo
- `GET /products` / `POST /products` – catálogo central de productos y variantes.
- `POST /products/:id/variants` – tamaño/presentación, precio y vigencia.
- `POST /sales` – registra venta (fecha/hora, método de pago, cajera, items con `variantId`, `quantity`, `unitPrice` opcional). Se permiten descuentos/códigos promocionales (`discount`, `couponCode`, `promoDescription`).
- `GET /sales?from=&to=` – listado filtrado por rango o turno.
- `GET /sales/:id` – detalle de ticket.

### 5. Turnos y RRHH
- `POST /shifts` – programa turnos para cajeras (fecha, horario, temporada). Guarda quién los crea.
- `GET /shifts?from=&to=&userId=` – consulta agenda o turnos del usuario autenticado.
- `PATCH /shifts/:id/attendance` – marca asistencia (check-in/out) y estatus del turno.
- `POST /payroll` – registra pago a trabajador (referencia a turno opcional, mes, monto y método).
- `GET /payroll?month=` – listado mensual para costeo laboral.

### 6. Gastos fijos
- `POST /fixed-expenses` – arriendo, servicios; campos: mes, categoría, monto, comprobante.
- `GET /fixed-expenses?month=` – consulta mensual.

### 7. Metas y reportes
- `POST /sales-goals` / `GET /sales-goals?month=` – metas diarias de ventas para el panel de promociones.
- `GET /reports/monthly-summary?month=` – ingresos vs costos (ventas netas, compras, gastos fijos, nómina) y metas registradas.
- `GET /reports/sales-by-product?month=` – ventas por producto/variante para analizar promociones.


## Próximos pasos
1. Diseñar el esquema Prisma (modelos y relaciones) según los recursos anteriores. 
2. Inicializar backend (Node + Express) con módulos base y autenticación. 
3. Crear proyecto Angular y conectar con la API.
