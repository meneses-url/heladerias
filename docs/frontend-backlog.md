# Backlog técnico frontend (orden de desarrollo)

Este backlog traduce la arquitectura de componentes propuesta a un plan de implementación incremental para el SPA Angular de Dulce Tentación.

## Convenciones
- Prioridad: `P0` (crítico), `P1` (alto), `P2` (medio).
- Estimación: `S` (0.5-1 día), `M` (1-2 días), `L` (3-5 días).
- Cada ítem incluye dependencias y criterio de aceptación.

---

## Fase 0. Fundaciones técnicas (P0)

### FE-001 Configurar arquitectura base por features
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: ninguna
- Entregable:
  - Estructura `core/`, `shared/`, `features/` en `src/app/`.
  - Rutas lazy por módulo.
- Criterio de aceptación:
  - La app compila y navega con rutas lazy sin romper placeholders actuales.

### FE-002 Configurar cliente HTTP y environment
- Prioridad: `P0`
- Estimación: `S`
- Dependencias: FE-001
- Entregable:
  - `ApiClient` con `baseUrl`.
  - Manejo de `environment` dev/prod.
- Criterio de aceptación:
  - Todas las llamadas API se realizan vía una sola capa de acceso.

### FE-003 Definir sistema de diseño base (Material + Tailwind)
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-001
- Entregable:
  - Tokens visuales base (colores, espaciado, tipografía).
  - Wrappers de componentes comunes (`Button`, `Card`, `Input`, `Badge`).
- Criterio de aceptación:
  - Login y dashboard consumen componentes base, no estilos ad hoc.

---

## Fase 1. Autenticación, sesión y permisos (P0)

### FE-004 Implementar `AuthService` + estado de sesión
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-002
- Entregable:
  - Login, refresh, perfil (`/auth/login`, `/auth/refresh`, `/auth/me`).
  - Estado reactivo de usuario y tokens.
- Criterio de aceptación:
  - Usuario puede iniciar sesión y mantener sesión activa con refresh.

### FE-005 Implementar interceptor JWT + refresh automático
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-004
- Entregable:
  - Header `Authorization: Bearer`.
  - Reintento automático una sola vez tras 401 por token vencido.
- Criterio de aceptación:
  - Petición protegida se reintenta correctamente luego de refresh exitoso.

### FE-006 Implementar guards de autenticación y rol
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-004, FE-005
- Entregable:
  - `authGuard` y `roleGuard`.
  - Redirecciones a login o no autorizado.
- Criterio de aceptación:
  - Un usuario `CASHIER` no accede a pantallas exclusivas `ADMIN`.

### FE-007 Construir `AppShell` (sidebar + topbar + logout)
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-006
- Entregable:
  - Layout autenticado común.
  - Menú dinámico por rol.
- Criterio de aceptación:
  - Todas las rutas protegidas renderizan dentro del shell.

---

## Fase 2. Componentes transversales reutilizables (P0/P1)

### FE-008 `DataTableComponent` reutilizable
- Prioridad: `P1`
- Estimación: `L`
- Dependencias: FE-003
- Entregable:
  - Tabla configurable con paginación, orden, acciones por fila.
- Criterio de aceptación:
  - Se usa en al menos dos módulos (ejemplo: productos y compras).

### FE-009 `FilterBarComponent` + `DateRangeSelectorComponent`
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-003
- Entregable:
  - Filtros por fecha, mes, estado y texto.
- Criterio de aceptación:
  - Un módulo puede filtrar y refrescar resultados sin recargar página.

### FE-010 Estados UI globales (`Loading`, `Empty`, `ApiError`, `Snackbar`, `ConfirmDialog`)
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-003
- Entregable:
  - Biblioteca de estados visuales y feedback unificados.
- Criterio de aceptación:
  - Cualquier módulo puede mostrar carga, vacío, error y confirmación con el mismo patrón.

---

## Fase 3. Módulo de ventas (núcleo operativo) (P0)

### FE-011 `SalesPOSComponent` (pantalla principal de venta)
- Prioridad: `P0`
- Estimación: `L`
- Dependencias: FE-007, FE-010
- Entregable:
  - Flujo de creación de venta con items, descuento y método de pago.
- Criterio de aceptación:
  - Se puede registrar una venta válida contra `/api/sales`.

### FE-012 `ProductPickerComponent` + búsqueda de catálogo
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-011
- Entregable:
  - Selector de productos/variantes para POS.
- Criterio de aceptación:
  - Cajera agrega variantes al ticket sin escribir IDs manuales.

### FE-013 `CartSummaryComponent` + cálculo de totales
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-011
- Entregable:
  - Carrito con edición de cantidad, remoción y total en tiempo real.
- Criterio de aceptación:
  - Total final coincide con cálculo enviado al backend.

### FE-014 `SaleDetailDialogComponent` + historial de ventas
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-008, FE-011
- Entregable:
  - Listado de ventas (`GET /sales`) y detalle por ticket.
- Criterio de aceptación:
  - Usuario abre detalle de una venta sin salir de la pantalla de historial.

---

## Fase 4. Módulo de catálogo (productos y variantes) (P0)

### FE-015 `ProductCatalogPageComponent` (listado + filtros)
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-008, FE-009
- Entregable:
  - Listado de productos con estado y búsqueda.
- Criterio de aceptación:
  - `ADMIN` consulta catálogo y filtra por nombre/categoría.

### FE-016 `ProductFormComponent` (crear/editar producto)
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-015
- Entregable:
  - Formulario reactivo para crear/editar producto.
- Criterio de aceptación:
  - Producto creado aparece en listado sin recarga completa.

### FE-017 `VariantManagerComponent`
- Prioridad: `P0`
- Estimación: `L`
- Dependencias: FE-016
- Entregable:
  - Gestión de variantes por producto (precio, vigencia, activo/inactivo).
- Criterio de aceptación:
  - Variantes creadas son consumibles por el POS de ventas.

---

## Fase 5. Compras y proveedores (P1)

### FE-018 `SupplierFormComponent` + listado de proveedores
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-008
- Entregable:
  - CRUD básico de proveedores.
- Criterio de aceptación:
  - Proveedor creado puede seleccionarse en registro de compra.

### FE-019 `PurchaseFormComponent` + `PurchaseItemsTableComponent`
- Prioridad: `P1`
- Estimación: `L`
- Dependencias: FE-018, FE-010
- Entregable:
  - Captura de compra por ítems con total calculado.
- Criterio de aceptación:
  - Compra se guarda correctamente contra `/api/purchases`.

### FE-020 Historial mensual de compras
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-008, FE-009, FE-019
- Entregable:
  - Vista filtrada por `month=YYYY-MM`.
- Criterio de aceptación:
  - Admin consulta compras por mes y totaliza resultados.

---

## Fase 6. Turnos y nómina (P1)

### FE-021 `ShiftCalendarComponent` + programación de turnos
- Prioridad: `P1`
- Estimación: `L`
- Dependencias: FE-007, FE-009
- Entregable:
  - Vista calendario/agenda para turnos.
- Criterio de aceptación:
  - Admin crea turnos y cajera ve solo los propios.

### FE-022 `AttendancePanelComponent`
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-021
- Entregable:
  - Marcación de asistencia (`check-in/out`, estado, notas).
- Criterio de aceptación:
  - Cambios persisten usando `/api/shifts/:id/attendance`.

### FE-023 `PayrollFormComponent` + listado mensual
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-021
- Entregable:
  - Registro de pagos y consulta por período.
- Criterio de aceptación:
  - Pago aparece en consulta `GET /api/payroll?month=`.

---

## Fase 7. Gastos fijos y metas (P1/P2)

### FE-024 `FixedExpenseFormComponent` + listado mensual
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-008, FE-009
- Entregable:
  - Registro y consulta de gastos fijos por mes.
- Criterio de aceptación:
  - Datos se reflejan en el reporte mensual del backend.

### FE-025 Gestión de metas de ventas
- Prioridad: `P2`
- Estimación: `M`
- Dependencias: FE-009
- Entregable:
  - Crear y listar metas (`/api/sales-goals`).
- Criterio de aceptación:
  - Metas visibles en dashboard y reportes.

---

## Fase 8. Dashboard y reportes (P1)

### FE-026 `DashboardOverviewComponent` + `StatCardComponent`
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-007, FE-010
- Entregable:
  - Dashboard con métricas de alto nivel.
- Criterio de aceptación:
  - Admin visualiza ventas, costos y utilidad neta del período.

### FE-027 `MonthlySummaryReportComponent`
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-009, FE-026
- Entregable:
  - Vista del endpoint `/api/reports/monthly-summary`.
- Criterio de aceptación:
  - Reporte muestra todos los totales (ventas, descuentos, compras, gastos, nómina, utilidad).

### FE-028 `SalesByProductChartComponent`
- Prioridad: `P1`
- Estimación: `M`
- Dependencias: FE-027
- Entregable:
  - Ranking visual de productos/variantes más vendidos.
- Criterio de aceptación:
  - Datos de `/api/reports/sales-by-product` se muestran en gráfico y tabla.

### FE-029 `ExportActionsComponent` (base)
- Prioridad: `P2`
- Estimación: `S`
- Dependencias: FE-027
- Entregable:
  - Botonera y contratos de exportación (placeholder funcional).
- Criterio de aceptación:
  - Estructura lista para incorporar export PDF/Excel sin rediseñar reportes.

---

## Fase 9. Calidad, pruebas y hardening (P0/P1)

### FE-030 Tests unitarios de core auth y guards
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-004, FE-005, FE-006
- Criterio de aceptación:
  - Cobertura mínima del flujo login, refresh, guard y logout.

### FE-031 Tests de componentes críticos
- Prioridad: `P1`
- Estimación: `L`
- Dependencias: FE-011, FE-017, FE-027
- Criterio de aceptación:
  - POS, variantes y reporte mensual tienen tests de comportamiento.

### FE-032 QA funcional end-to-end (manual guiado)
- Prioridad: `P0`
- Estimación: `M`
- Dependencias: FE-011 a FE-028
- Criterio de aceptación:
  - Flujos completos validados:
    - Login y sesión.
    - Registrar venta.
    - Registrar compra/gasto.
    - Crear turno y pago.
    - Consultar reporte mensual.

### FE-033 Documentación técnica y handoff
- Prioridad: `P1`
- Estimación: `S`
- Dependencias: FE-001 a FE-032
- Criterio de aceptación:
  - README frontend actualizado con arquitectura, comandos, módulos y convenciones.

---

## Ruta crítica sugerida (orden recomendado)

1. FE-001, FE-002  
2. FE-004, FE-005, FE-006, FE-007  
3. FE-010, FE-008, FE-009  
4. FE-011, FE-012, FE-013  
5. FE-015, FE-016, FE-017  
6. FE-018, FE-019, FE-020  
7. FE-021, FE-022, FE-023  
8. FE-024, FE-026, FE-027, FE-028  
9. FE-030, FE-031, FE-032, FE-033

---

## Definición de terminado (DoD)

Un ítem del backlog se considera completado cuando:
- Cumple su criterio de aceptación funcional.
- Tiene manejo de estados de carga/error/vacío.
- Respeta control de permisos por rol cuando aplique.
- Incluye pruebas mínimas de unidad o integración del módulo.
- Queda documentado en la sección correspondiente.
