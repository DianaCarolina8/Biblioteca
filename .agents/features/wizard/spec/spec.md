# Consult Wizard

| | |
| --- | --- |
| **Status** | Implemented |
| **Date** | 2026-10-25 |
| **Scope** | `biblioteca-backend` + `biblioteca-frontend` |
| **Affects** | `reserva-wizard.component`, `reserva-wizard.form`, `reserva-wizard.store`, `reserva.service`, `reserva-libro.ts`, `app.routes.ts`, `layout.component.html` |
| **Reference** | `Libro` vertical (backend), `Cliente` screen (frontend) |


> Specificationes only. Part 2 is written after the implementation.

---

# Parte 1 — Especificaciones

## Problema
Registrar una reserva de libros no es una operación de un solo formulario simple. Requiere seleccionar un cliente, una fecha de reserva y una lista de $N$ libros seleccionados con sus correspondientes comprobaciones. Un diálogo flotante convencional (MatDialog) o un formulario plano no resulta óptimo para gestionar la búsqueda dinámica de libros, su preselección y la revisión final antes del guardado.

En el menú lateral (layout.component.html) se requiere agregar la opción de menú
Registrar Reserva que dirija a la ruta /pages/reserva-wizard.


## Objetivo

Crear una pantalla estilo Wizard (asistente de pasos) en Angular que recolecte la información de la reserva y sus libros seleccionados en un único flujo, realizando el envío al backend en una sola petición y dentro de una misma transacción. Nada se guarda en la base de datos hasta que el usuario confirma en el paso final de revisión.

## Scope

In scope:

* Crear la nueva ruta en Angular y los componentes correspondientes para reserva-wizard utilizando formularios reactivos/Signal Forms y Signal Store para el estado.
* Nueva pantalla en la ruta pages/reserva-wizard accesible desde el sidenav/layout.
* Paso 1 — Principal: Selección de Cliente (mat-select), Fecha de reserva (mat-datepicker con valor mínimo = hoy) y Búsqueda/Autocompletado de Libros (mat-autocomplete) con opción de agregar/remover de una lista visual (mat-list).
* Paso 2 — Revisión y Confirmación: Resumen de solo lectura del cliente, fecha y lista de libros seleccionados antes de enviar, junto con el botón Guardar.
* Envío mediante POST /reservas enviando la cabecera de la reserva y la lista de libros seleccionados (ReservaLibroDTO)
* Bloqueo client-side para evitar enviar peticiones si la información está incompleta.


Out of scope:

* Editar o eliminar reservas creadas previamente desde el Wizard (es un flujo create-only).
* Creación de clientes o libros desde el interior del Wizard.
* Autenticación/Manejo de tokens JWT (se asume integrado en interceptores globales).


## Modelo de Datos

Estructura de interfaces/modelos TypeScript en el frontend:

| Entity | Key columns | Notes |
| --- | --- | --- |
| `Reserva` | `idReserva`, `cliente`, `fechaReserva` |  |
| `DetalleReserva` | `reserva` + `libro` | `@IdClass(DetalleReservaPK)`, composite PK, no surrogate id |


## Flujo

Paso 1 — Datos de Reserva & Selección de Libros:

*Selector de Cliente (mat-select o mat-autocomplete).
*Selector de Fecha de Reserva (mat-datepicker con [min]="today").
*Buscador/Autocompletado de Libros (mat-autocomplete) con botón Agregar Libro que lo añade a una lista visible de mat-list.
*La lista de libros permite eliminar elementos antes de avanzar.
*Validación: Un mismo libro no puede agregarse dos veces a la lista.

Paso 2 — Resumen & Guardado:

*Resumen de solo lectura (<dl> o mat-card) mostrando: Cliente seleccionado, Fecha elegida y Cantidad/Lista de Libros.
*Botón Guardar Reserva.

Después de un guardado exitoso, la pantalla se reinicia automáticamente (formulario, listado de libros y stepper vuelven al estado inicial limpio).

## Decisiones

*Una sola petición transaccional.
*El Wizard consume POST /reservas enviando la interfaz ReservaLibroDTO. El backend gestiona la persistencia de la cabecera y la relación detalle_reserva.
*Objeto completo vs IDs.
*El frontend envía el objeto Cliente y los objetos Libro completos seleccionados directamente del catálogo devuelto por los servicios /clientes y /libros.
*Evitar duplicados en el cliente.
*Para evitar violaciones de Clave Primaria compuesta en detalle_reserva, el Wizard filtra automáticamente los libros ya seleccionados antes de agregarlos a la lista.
*Bloqueo del botón Guardar.
*El botón Guardar permanece deshabilitado hasta que el formulario sea válido: debe haber un cliente seleccionado, fecha válida y al menos 1 libro en la lista.

## Contract



Los otros cuatro endpoints of `ReservaController` (`GET` all, `GET` by id, `PUT`, `DELETE`) existen
y no son parte de este feature. The wizard solo llama al `POST`.

## Expected Files


Frontend:

* `model/reserva.ts`,`model/reserva-libro.ts`
* `services/reserva.service.ts`
* `store/reserva-wizard.store.ts`
* `forms/reserva-wizard.form.ts`
* `pages/reserva-wizard/reserva-wizard.component.{ts,html,css}`
* Route entry in `app.routes.ts`

Reuse `ICRUD`, `CRUDImpl` and `IGenericRepo` in the backend, and `GenericService` in the frontend.
`ReservaService` extends `GenericService<Reserva>` and only **adds** `guardarTransaccion`; it does not
override the inherited methods. Do not modify shared abstractions.

Acceptance Criteria

[ ] El botón en el menú lateral despliega y navega a la pantalla del Wizard en /pages/reserva-wizard.
[ ] El Paso 1 carga los catálogos de Clientes y Libros desde las APIs existentes (/clientes y /libros).
[ ] Se pueden agregar y quitar libros de la lista temporal antes de guardar.
[ ] Intentar agregar un libro que ya está en la lista seleccionada no realiza ninguna acción (evita duplicados).
[ ] El botón Guardar permanece deshabilitado hasta que haya un cliente, una fecha válida y al menos un libro seleccionado.
[ ] Al presionar Guardar, se realiza la llamada POST /reservas y se muestra un mensaje emergente (MatSnackBar) informando la creación exitosa.
[ ] Tras la respuesta exitosa (201 Created), el Wizard reinicia todos sus campos, limpia los libros seleccionados y regresa al Paso 1.
