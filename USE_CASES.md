# Casos de uso – Backend Dulce Tentación

> Este documento describe cómo se usa cada módulo de la API tomando como referencia los endpoints actuales. Sirve como guía rápida para nuevos desarrolladores y QA.

## 1. Autenticación y roles
- **Iniciar sesión**: `POST /api/auth/login` recibe `{ email, password }` y devuelve `accessToken`/`refreshToken`. El token se usa en el header `Authorization: Bearer <token>` para todas las operaciones protegidas.
- **Actualizar tokens**: `POST /api/auth/refresh` intercambia el refresh token por un par nuevo (útil para sesiones largas).
- **Perfil**: `GET /api/auth/me` permite que las cajeras vean sus datos sin exponer información de otros usuarios.

## 2. Gestión de usuarios
- **Listar** (`GET /api/users`) y **crear** (`POST /api/users`) solo para ADMIN. Se usa al onboarding de nuevas cajeras o administradores.

## 3. Catálogo y ventas con promociones
1. **Crear producto/variante** (ADMIN): `POST /api/products` y `POST /api/products/:productId/variants` para definir el menú diario.
2. **Consultar catálogo**: `GET /api/products` (cualquier usuario autenticado) llena las pantallas del POS.
3. **Registrar venta**: `POST /api/sales` requiere `paymentType` y `items` (`variantId`, `quantity`, `unitPrice` opcional). Campos adicionales:
   - `discount`: monto absoluto a restar del subtotal.
   - `couponCode` y `promoDescription`: referencia al beneficio aplicado (p. ej. “NAVIDAD”).
   - `shiftId`: opcional para ligar la venta a un turno específico.
4. **Historial de ventas**: `GET /api/sales?from=&to=` devuelve tickets con información del cajero y productos vendidos.

## 4. Control de gastos y proveedores
1. **Registrar proveedor**: `POST /api/suppliers` con datos básicos.
2. **Captura de gastos/compras**: `POST /api/purchases` recibe `supplierId`, `items` (`description`, `category`, `quantity`, `unitCost`, `unit`). El sistema calcula `total` y lo guarda para los reportes.
3. **Consulta mensual**: `GET /api/purchases?month=YYYY-MM` muestra cuánto se gastó en proveedores durante un período.

## 5. Turnos y asistencia
1. **Programar turnos**: `POST /api/shifts` (ADMIN) define usuario, fecha y horario. Se guarda quién lo creó.
2. **Consulta de agenda**:
   - ADMIN: `GET /api/shifts?from=&to=&userId=` para ver cualquier turno.
   - Cajera: la misma ruta pero automáticamente se filtra por su usuario.
3. **Marcar asistencia**: `PATCH /api/shifts/:id/attendance` actualiza `status` (`SCHEDULED`, `COMPLETED`, `ABSENT`) y opcionalmente `checkInAt`/`checkOutAt` y notas.

## 6. Nómina
1. **Registrar pago**: `POST /api/payroll` recibe `userId`, `periodMonth (YYYY-MM)`, `amount`, `method` y opcional `shiftId`. Útil para llevar control de pagos por turno o por periodo.
2. **Consulta mensual**: `GET /api/payroll?month=YYYY-MM` consolida pagos para el informe de costos laborales.

## 7. Gastos fijos
- **Registrar**: `POST /api/fixed-expenses` con `month`, `category`, `amount`, `description` opcional.
- **Consultar**: `GET /api/fixed-expenses?month=YYYY-MM` para obtener todos los gastos recurrentes del periodo.

## 8. Metas de ventas
- **Crear meta diaria**: `POST /api/sales-goals` (`date`, `target`, `description`).
- **Consultar metas**: `GET /api/sales-goals?month=YYYY-MM` alimenta dashboards de promociones.

## 9. Reportes financieros
1. **Resumen mensual**: `GET /api/reports/monthly-summary?month=YYYY-MM` retorna:
   - Ventas totales y descuentos aplicados.
   - Total de compras (gastos asociados a proveedores).
   - Gastos fijos y nómina del mes.
   - Utilidad neta (ventas – descuentos – compras – gastos – nómina).
   - Metas registradas en el periodo.
2. **Ventas por producto**: `GET /api/reports/sales-by-product?month=YYYY-MM` agrupa `SaleItem` para identificar los productos/variantes más vendidos.

## 10. Flujo recomendado
1. Admin crea usuarios, productos y variantes.
2. Programa turnos y registra proveedores.
3. Durante el mes, captura compras/gastos, metas y ventas con promociones.
4. Marca asistencia y registra pagos de nómina.
5. Al cierre, consulta el resumen mensual y el ranking de productos para planificar promociones.
