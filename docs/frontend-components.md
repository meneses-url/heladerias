# Componentes frontend propuestos para Dulce Tentación

Este documento define los componentes frontend recomendados para la aplicación web administrativa de **Dulce Tentación**. El objetivo es que la codificación del SPA en Angular tenga una base consistente, reutilizable y alineada con la operación real del negocio: ventas, catálogo, compras, turnos, nómina, gastos y reportes.

La propuesta parte del stack ya presente en el proyecto:
- **Angular 18** como framework del SPA.
- **Angular Material** para componentes base accesibles y consistentes.
- **Tailwind CSS** para composición visual rápida y flexible.

## Criterios de diseño

Cada componente debe responder a una necesidad concreta del sistema:
- Reducir fricción operativa para administrador y cajeras.
- Reutilizar patrones para evitar pantallas aisladas.
- Soportar permisos por rol (`ADMIN`, `CASHIER`).
- Facilitar mantenimiento, pruebas y escalabilidad.

## 1. Componentes de estructura base

### `AppShellComponent`
**Propósito:** contenedor principal de la aplicación autenticada.

**Responsabilidades:**
- Mostrar sidebar, header, área de contenido y estado global de sesión.
- Cambiar la navegación visible según el rol.
- Servir como layout común para todos los módulos protegidos.

**Justificación:**
Este sistema no es una landing page, sino un panel administrativo con múltiples módulos. Sin un contenedor base, cada pantalla terminaría resolviendo por separado navegación, espaciado, títulos y acciones globales. Un `AppShellComponent` centraliza esa estructura y reduce duplicación.

### `SidebarNavigationComponent`
**Propósito:** navegación lateral por módulos.

**Responsabilidades:**
- Mostrar accesos a dashboard, ventas, productos, compras, turnos, nómina, gastos y reportes.
- Ocultar o deshabilitar opciones según permisos.
- Resaltar la ruta actual.

**Justificación:**
La navegación de un sistema administrativo debe ser estable, rápida y predecible. Un sidebar mejora la orientación del usuario y evita depender de enlaces dispersos por pantalla. Además, facilita adaptar el menú para administrador y cajera sin crear dos aplicaciones distintas.

### `TopbarComponent`
**Propósito:** barra superior del sistema.

**Responsabilidades:**
- Mostrar nombre del usuario autenticado y rol.
- Incluir acciones rápidas como cerrar sesión, volver al dashboard o abrir accesos frecuentes.
- Contener breadcrumbs o título contextual si se requiere.

**Justificación:**
El usuario necesita confirmación constante de contexto: quién está logueado, en qué módulo está y cómo salir o cambiar de sección. Esta pieza mejora control y reduce errores de uso compartido entre empleados.

### `PageHeaderComponent`
**Propósito:** encabezado reutilizable para pantallas internas.

**Responsabilidades:**
- Mostrar título, descripción corta y acciones primarias.
- Estandarizar el inicio visual de cada vista.

**Justificación:**
Módulos como ventas, productos o reportes necesitan una cabecera consistente para que la interfaz no se perciba improvisada. Este componente acelera desarrollo y refuerza claridad visual.

## 2. Componentes de autenticación y sesión

### `LoginFormComponent`
**Propósito:** formulario de acceso al sistema.

**Responsabilidades:**
- Capturar email y contraseña.
- Validar campos.
- Ejecutar login y manejar estados de carga o error.

**Justificación:**
El login es el punto de entrada al sistema. Debe encapsular validación, mensajes y estados sin contaminar la página completa. Esto permite evolucionarlo luego con recuperación de sesión, branding o mensajes operativos.

### `AuthStatusBannerComponent`
**Propósito:** mensajes globales relacionados con sesión y seguridad.

**Responsabilidades:**
- Informar expiración de sesión próxima o errores de refresh.
- Mostrar alertas cuando el usuario pierda permisos o la sesión haya caducado.

**Justificación:**
El backend ya contempla access token y refresh token. En un SPA administrativo, el usuario no debe enfrentarse a fallos silenciosos. Este componente vuelve visible el estado de autenticación sin obligar a repetir lógica en cada vista.

### `RoleGuardedViewComponent`
**Propósito:** envolver bloques de UI que dependen del rol.

**Responsabilidades:**
- Renderizar contenido solo si el usuario tiene el permiso requerido.
- Mostrar fallback o mensaje de restricción si aplica.

**Justificación:**
El proyecto tiene permisos diferenciados entre `ADMIN` y `CASHIER`. En lugar de llenar plantillas con condiciones dispersas, conviene concentrar esa decisión en un componente reutilizable. Mejora legibilidad y evita inconsistencias.

## 3. Componentes de UI transversal

### `DataTableComponent`
**Propósito:** tabla reutilizable para listados administrativos.

**Responsabilidades:**
- Renderizar columnas configurables.
- Integrar ordenamiento, paginación y estados vacíos.
- Permitir acciones por fila como editar, ver detalle o eliminar.

**Justificación:**
Usuarios, productos, compras, ventas, turnos y nómina comparten un patrón claro: listado + filtros + acciones. Un `DataTableComponent` evita reimplementar tablas en cada módulo y mejora consistencia operativa.

### `FilterBarComponent`
**Propósito:** barra de filtros para búsquedas y consultas.

**Responsabilidades:**
- Ofrecer filtros por fecha, mes, estado, categoría, usuario o método de pago.
- Emitir criterios al contenedor padre.

**Justificación:**
Los módulos del proyecto dependen fuertemente de consultas filtradas. Sin un patrón común, cada vista definirá filtros distintos y el sistema perderá coherencia. Este componente estandariza cómo se busca información.

### `StatCardComponent`
**Propósito:** tarjeta para indicadores clave.

**Responsabilidades:**
- Mostrar métricas como ventas del día, compras del mes, utilidad neta o metas alcanzadas.
- Incluir variaciones o contexto secundario.

**Justificación:**
Los dashboards y reportes requieren lectura rápida. Una tarjeta estadística bien definida facilita que el administrador identifique tendencias sin recorrer tablas completas.

### `EmptyStateComponent`
**Propósito:** representación visual de estados sin datos.

**Responsabilidades:**
- Mostrar mensajes claros cuando no existan ventas, productos, compras o turnos.
- Sugerir acción siguiente, por ejemplo "Crear producto" o "Registrar primera venta".

**Justificación:**
En sistemas internos nuevos, es común trabajar con bases de datos vacías en etapas tempranas. Un estado vacío bien diseñado evita que la interfaz parezca rota y guía al usuario.

### `ConfirmDialogComponent`
**Propósito:** diálogo de confirmación para acciones sensibles.

**Responsabilidades:**
- Confirmar eliminación, cierre de sesión, cambios importantes o registros críticos.

**Justificación:**
En operaciones financieras y administrativas, un clic accidental puede tener impacto real. Este componente introduce fricción donde sí conviene tenerla.

### `FeedbackSnackbarComponent`
**Propósito:** notificaciones breves del sistema.

**Responsabilidades:**
- Confirmar acciones exitosas o errores puntuales.
- Unificar el feedback visual de toda la aplicación.

**Justificación:**
Registrar una venta, crear un producto o guardar un turno necesita confirmación inmediata. Las notificaciones breves reducen incertidumbre y mejoran la percepción de control.

### `LoadingStateComponent`
**Propósito:** indicador de carga reutilizable.

**Responsabilidades:**
- Mostrar skeletons, spinner o bloque de carga según contexto.
- Cubrir pantallas completas o secciones puntuales.

**Justificación:**
El sistema depende de API y consultas de base de datos. Los estados de carga forman parte del flujo real, no son un detalle opcional. Un patrón único evita experiencias incoherentes.

## 4. Componentes del módulo de dashboard

### `DashboardOverviewComponent`
**Propósito:** vista principal tras iniciar sesión.

**Responsabilidades:**
- Resumir estado del negocio con métricas del día o del mes.
- Mostrar accesos rápidos a acciones frecuentes.

**Justificación:**
Después del login, el usuario necesita una lectura rápida del estado del negocio. Esta vista actúa como centro de control y reduce tiempo de navegación.

### `QuickActionsPanelComponent`
**Propósito:** panel de accesos operativos directos.

**Responsabilidades:**
- Permitir saltar a registrar venta, crear producto, registrar compra o revisar turnos.

**Justificación:**
El software debe reducir pasos, no agregarlos. Las acciones rápidas son especialmente útiles en negocios pequeños donde una misma persona ejecuta tareas de varios módulos.

### `SalesGoalProgressComponent`
**Propósito:** visualización de metas de venta.

**Responsabilidades:**
- Mostrar meta diaria o mensual frente a ventas acumuladas.
- Resaltar cumplimiento o desvío.

**Justificación:**
El sistema incluye metas de ventas como parte del análisis comercial. Llevar esa información al dashboard convierte el dato en una herramienta de decisión diaria.

## 5. Componentes del módulo de ventas

### `SalesPOSComponent`
**Propósito:** interfaz principal para registrar ventas.

**Responsabilidades:**
- Permitir seleccionar productos, variantes, cantidades y descuentos.
- Calcular subtotal, descuentos y total en tiempo real.
- Confirmar método de pago y enviar la venta.

**Justificación:**
Este es uno de los componentes más valiosos del sistema porque conecta directamente con la operación diaria. Debe priorizar velocidad, legibilidad y baja fricción para la cajera.

### `ProductPickerComponent`
**Propósito:** selector visual del catálogo para ventas.

**Responsabilidades:**
- Buscar productos por nombre o categoría.
- Elegir variantes y agregarlas al ticket.

**Justificación:**
Separar la selección de productos del resto del POS reduce complejidad en la pantalla principal y permite optimizar la experiencia de búsqueda del catálogo.

### `CartSummaryComponent`
**Propósito:** resumen del ticket en construcción.

**Responsabilidades:**
- Listar items agregados.
- Ajustar cantidades, eliminar líneas y visualizar totales.

**Justificación:**
La venta necesita una representación clara del pedido actual. Este componente encapsula la lógica visible del carrito y facilita evitar errores antes de guardar.

### `PaymentMethodSelectorComponent`
**Propósito:** selección del tipo de pago.

**Responsabilidades:**
- Elegir entre efectivo, tarjeta, transferencia o mixto.
- Activar reglas o campos adicionales cuando corresponda.

**Justificación:**
El backend ya modela varios métodos de pago. Llevar eso a un componente aislado evita mezclar reglas del checkout con el resto del POS.

### `SaleDetailDialogComponent`
**Propósito:** visualización rápida de una venta registrada.

**Responsabilidades:**
- Mostrar items, total, descuento, cajera, turno y hora.

**Justificación:**
Las ventas suelen requerir consulta inmediata sin salir del listado principal. Un detalle en diálogo mantiene contexto y mejora revisión operativa.

## 6. Componentes del módulo de productos

### `ProductCatalogPageComponent`
**Propósito:** pantalla principal de gestión de productos.

**Responsabilidades:**
- Listar productos activos e inactivos.
- Filtrar por nombre, categoría o estado.

**Justificación:**
El catálogo es una entidad base del negocio. Necesita una vista centralizada porque de él dependen ventas, precios y análisis posterior.

### `ProductFormComponent`
**Propósito:** formulario de creación y edición de productos.

**Responsabilidades:**
- Gestionar nombre, categoría, descripción y estado.

**Justificación:**
Separar el formulario del listado facilita reutilización en creación y edición, y simplifica pruebas unitarias del flujo.

### `VariantManagerComponent`
**Propósito:** administración de variantes de producto.

**Responsabilidades:**
- Crear tamaños o presentaciones.
- Definir precio, vigencia y estado.

**Justificación:**
Las variantes son núcleo del dominio del negocio. No basta con un producto simple; la heladería vende presentaciones distintas. Este componente evita tratar variantes como un campo secundario y les da el peso correcto.

## 7. Componentes del módulo de compras y proveedores

### `SupplierFormComponent`
**Propósito:** crear y editar proveedores.

**Responsabilidades:**
- Gestionar datos de contacto, teléfono y email.

**Justificación:**
Los proveedores alimentan el flujo de compras y costos. Tener un formulario dedicado mejora calidad del dato y evita registros incompletos.

### `PurchaseFormComponent`
**Propósito:** registrar compras o gastos asociados a proveedores.

**Responsabilidades:**
- Seleccionar proveedor.
- Registrar ítems, cantidad, unidad, costo unitario y notas.
- Calcular total.

**Justificación:**
Una compra en este sistema no es un monto aislado; es un conjunto de ítems con impacto financiero. Este componente traduce esa necesidad del negocio a una interfaz correcta.

### `PurchaseItemsTableComponent`
**Propósito:** subcomponente para líneas de compra.

**Responsabilidades:**
- Añadir, editar y eliminar filas de detalle.
- Recalcular subtotales.

**Justificación:**
La captura de compras tiene suficiente complejidad como para separarla del formulario general. Esto hace el código más legible y reusable.

## 8. Componentes del módulo de turnos y RRHH

### `ShiftCalendarComponent`
**Propósito:** visualizar turnos programados.

**Responsabilidades:**
- Mostrar agenda por día o semana.
- Filtrar por usuario o rango de fechas.

**Justificación:**
Los turnos son temporalmente sensibles. Una representación tipo calendario comunica mucho mejor que una tabla plana cuando el objetivo es programar y revisar cobertura.

### `ShiftFormComponent`
**Propósito:** crear o editar turnos.

**Responsabilidades:**
- Seleccionar usuario, fecha, hora de inicio, hora de fin y temporada.

**Justificación:**
Es una operación administrativa recurrente. Un formulario claro evita conflictos de programación y reduce errores manuales.

### `AttendancePanelComponent`
**Propósito:** registrar asistencia.

**Responsabilidades:**
- Marcar check-in, check-out y estado del turno.
- Añadir observaciones si hubo ausencia o novedad.

**Justificación:**
La asistencia no es exactamente igual a la programación del turno. Separarla en un componente dedicado respeta esa diferencia funcional y simplifica la lógica de RRHH.

### `PayrollFormComponent`
**Propósito:** registrar pagos al personal.

**Responsabilidades:**
- Asociar pago a usuario, mes y método.
- Relacionarlo con turno cuando aplique.

**Justificación:**
La nómina requiere captura estructurada y trazabilidad. Este componente conecta RRHH con costos del negocio, por lo que no debería mezclarse con formularios genéricos.

## 9. Componentes del módulo de gastos fijos

### `FixedExpenseFormComponent`
**Propósito:** registrar gastos recurrentes.

**Responsabilidades:**
- Capturar mes, categoría, monto, descripción y adjunto si aplica.

**Justificación:**
Los gastos fijos son clave para calcular utilidad real. Deben tener una interfaz simple y directa porque suelen cargarse de forma periódica.

### `MonthlyExpenseSummaryComponent`
**Propósito:** resumen visual de gastos del período.

**Responsabilidades:**
- Agrupar gastos por categoría.
- Mostrar totales del mes.

**Justificación:**
No basta con registrar gastos; el sistema debe ayudar a entenderlos. Este componente traduce datos contables en lectura operativa.

## 10. Componentes del módulo de reportes

### `MonthlySummaryReportComponent`
**Propósito:** presentar el resumen mensual del negocio.

**Responsabilidades:**
- Mostrar ventas, descuentos, compras, gastos fijos, nómina y utilidad neta.

**Justificación:**
Este componente materializa el objetivo principal del proyecto: saber si el negocio está siendo rentable y por qué.

### `SalesByProductChartComponent`
**Propósito:** visualizar productos y variantes más vendidos.

**Responsabilidades:**
- Representar ranking por ingresos o cantidad.
- Soportar filtros por mes.

**Justificación:**
Una tabla sola no siempre permite detectar patrones comerciales. Un gráfico comparativo ayuda a decidir promociones, compras y ajustes del menú.

### `DateRangeSelectorComponent`
**Propósito:** seleccionar períodos de consulta.

**Responsabilidades:**
- Elegir mes o rango de fechas para reportes y listados.

**Justificación:**
Varios módulos dependen de filtros temporales. Este componente reduce duplicación y evita diferencias en el manejo de fechas entre vistas.

### `ExportActionsComponent`
**Propósito:** reunir acciones de exportación o impresión.

**Responsabilidades:**
- Permitir exportar listados o reportes.
- Preparar una futura salida PDF o Excel si el proyecto la incorpora.

**Justificación:**
Los sistemas administrativos suelen terminar necesitando compartir información fuera del sistema. Aunque la exportación no esté implementada desde el inicio, conviene reservar un patrón visual y funcional.

## 11. Componentes técnicos de soporte

### `ApiErrorStateComponent`
**Propósito:** mostrar errores de carga de datos.

**Responsabilidades:**
- Presentar fallos del backend con mensaje comprensible y opción de reintento.

**Justificación:**
En una aplicación conectada a API, los errores remotos son inevitables. Tener un componente estándar evita respuestas improvisadas por módulo.

### `PermissionBadgeComponent`
**Propósito:** representar visualmente rol o capacidad del usuario.

**Responsabilidades:**
- Mostrar badges como `ADMIN` o `CAJERA`.
- Reforzar contexto en vistas de usuarios y sesión.

**Justificación:**
Aunque pequeño, ayuda a dar claridad inmediata sobre jerarquías y permisos, especialmente en módulos de gestión de usuarios.

### `SectionCardComponent`
**Propósito:** contenedor visual reutilizable para bloques internos.

**Responsabilidades:**
- Agrupar formularios, tablas o widgets con un estilo consistente.

**Justificación:**
El sistema tendrá muchas pantallas con bloques funcionales. Un contenedor común mejora cohesión visual sin repetir clases y estructura en cada template.

## Priorización recomendada para implementación

### Fase 1: base operativa
- `AppShellComponent`
- `SidebarNavigationComponent`
- `TopbarComponent`
- `LoginFormComponent`
- `RoleGuardedViewComponent`
- `LoadingStateComponent`
- `FeedbackSnackbarComponent`

**Justificación:** sin sesión, layout y control de acceso, el resto del frontend no tiene base técnica sólida.

### Fase 2: operación diaria
- `SalesPOSComponent`
- `ProductPickerComponent`
- `CartSummaryComponent`
- `PaymentMethodSelectorComponent`
- `ProductCatalogPageComponent`
- `ProductFormComponent`
- `VariantManagerComponent`

**Justificación:** ventas y catálogo son el corazón operativo del negocio.

### Fase 3: control administrativo
- `SupplierFormComponent`
- `PurchaseFormComponent`
- `PurchaseItemsTableComponent`
- `ShiftCalendarComponent`
- `ShiftFormComponent`
- `AttendancePanelComponent`
- `PayrollFormComponent`
- `FixedExpenseFormComponent`

**Justificación:** aquí se consolida el control de costos y RRHH.

### Fase 4: analítica y cierre
- `DashboardOverviewComponent`
- `StatCardComponent`
- `SalesGoalProgressComponent`
- `MonthlySummaryReportComponent`
- `SalesByProductChartComponent`
- `ExportActionsComponent`

**Justificación:** estas piezas transforman los registros operativos en información útil para decidir.

## Conclusión

El frontend de Dulce Tentación debe construirse como un **SPA administrativo modular**, no como una colección de pantallas sueltas. Los componentes propuestos responden a procesos reales del negocio y permiten que el código avance con orden, reutilización y una arquitectura consistente.

La regla práctica es simple: si una interacción se repite, si representa una entidad clave del negocio o si expresa una regla de permisos/sesión, debe convertirse en componente explícito.
