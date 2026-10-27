# Query Consult

| | |
| --- | --- |
| **Status** | Draft |
| **Date** | 2026-10-25 |
| **Scope** | `biblioteca-backend` + `biblioteca-frontend` |
| **Affects** | `IReservaRepo`, `IReservaService`, `ReservaServiceImpl`, `ReservaController`, `IDetalleReservaRepo`, `MapperConfig` |
| **Reference** | `Reserva` vertical (backend), `Cliente` screen (frontend) |

> Specification only. Part 2 is written after the implementation.

---

# Part 1 — Especificacion

## Problema

Las reservas de libros se pueden registrar y listar, pero no existe una forma de consultar reservas pasadas de manera específica. El usuario necesita localizar una reserva ya sea por el cliente que la solicitó (por su cédula o nombres/apellidos) o por el rango de fechas en el que se realizó, y posteriormente inspeccionar qué libros exactos contenía dicha reserva.

## Objetivo

Una pantalla de búsqueda con dos modos mutuamente excluyentes y un diálogo de detalles de solo lectura, respaldada por los endpoints de consultas que las sirven.

## Scope

In scope:

* Métodos de consulta en el backend sobre Reserva: búsqueda por datos del cliente (cedula o apellidos/nombres), búsqueda por rango de fechas (fecha_reserva), y obtención de libros por reserva.
* Los tres endpoints que exponen estas consultas.
* El mapeo Reserva -> ReservaDTO necesario para que la tabla de resultados renderice correctamente la información del cliente.
* Pantalla de búsqueda en el frontend: formulario con pestañas (tabs), tabla de resultados y diálogo de detalles.
* Route `/busqueda` registered in the app routes.

Out of scope:

* Paginación, ordenamiento o filtrado del lado del servidor de los resultados.
* Edición o eliminación de una reserva desde la pantalla de búsqueda.
* Combinar ambos modos de búsqueda en una sola petición simultánea.

## Decisiones

Dos modos de búsqueda, una pantalla, un botón de envío.
La pestaña activa decide qué modo se ejecuta. El componente lee el índice de la pestaña seleccionada y direcciona la petición correspondiente. No existe una consulta combinada.

La búsqueda por datos del cliente es un POST con cuerpo (body); la búsqueda por fechas es un GET con parámetros en la URL (query params).
La primera transporta un objeto de filtro y se modela como un comando; la segunda es una lectura parametrizada compartible como URL. Esta asimetría es intencional.

El payload de filtro es un record declarado dentro de ReservaController.
No tiene reutilización fuera de este endpoint y no pertenece al paquete dto.

Los métodos de consulta residen en IReservaRepo como JPQL @Query.
La búsqueda de clientes abarca dos columnas con OR y LIKE.
La búsqueda por fechas se expresa con BETWEEN.

Los libros de una reserva provienen de un endpoint separado, no embebidos en ReservaDTO.
La tabla de resultados principal no los necesita; solo el diálogo de detalles los solicita bajo demanda para mantener ligera la respuesta inicial.

El rango de fechas viaja como cadenas ISO local date-time, no como epoch millis.
El backend las procesa con LocalDateTime.parse, por lo que el frontend debe enviar el formato completo yyyy-MM-ddTHH:mm:ss.

## Data Flow

```
 tab 0 --> POST /reserva/busqueda/cliente  {cedula, nombres} --> repo.buscar(cedula, fullname)
 tab 1 --> GET  /reserva/busqueda/fechas?date1&date2       --> repo.buscarPorFechas(date1, date2)
                            |
                            v
                     ReservaDTO[] --> tabla de resultados
                            |
                 "Ver Detalles" --> dialog
                            |
                            +--> GET /detallereservas/{idReserva} --> LibroDTO[]
```

## Contract

```
POST /reservas/busqueda/cliente   -> 200 OK + ReservaDTO[]
GET  /reservas/busqueda/fechas    -> 200 OK + ReservaDTO[]
GET  /detallereservas/{idreserva} -> 200 OK + LibroDTO[]
```

**`POST /reservas/busqueda/cliente`**

Body, `application/json`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cedula` | `String` | no | Coincidencia estricta con `cliente.cedula` |
| `nombres` | `String` | no | Coincidencia con LIKE %...% contra `cliente.nombres` y `cliente.apellidos`, en minúsculas|

The two fields are combined with `OR`, not `AND`. Sending both widens the result set instead of narrowing it. The endpoint does not validate the body; it is not annotated with `@Valid`.

**`GET /reservas/busqueda/fechas`**

| Param | Type | Required | Format |
| --- | --- | --- | --- |
| `fecha1` | `String` | yes | `yyyy-MM-dd` + `T` + `HH:mm:ss` |
| `fecha2` | `String` | yes | `yyyy-MM-dd` + `T` + `HH:mm:ss` |

Ambos límites son inclusivos (BETWEEN).

**`GET /detallereservas/{idConsult}`**

Devuelve los libros vinculados a la reserva a través de la entidad intermedia DetalleReserva. Un ID desconocido retorna una lista vacía.

## Consultas

`IReservaRepo`:

```java
@Query("FROM Reserva r WHERE r.cliente.cedula = :cedula OR LOWER(r.cliente.nombres) LIKE %:nombres% OR LOWER(r.cliente.apellidos) LIKE %:nombres%")
List<Reserva> buscarPorCliente(@Param("cedula") String cedula, @Param("nombres") String nombres);

@Query("FROM Reserva r WHERE r.fechaReserva BETWEEN :date1 AND :date2")
List<Reserva> buscarPorFechas(@Param("date1") LocalDateTime date1, @Param("date2") LocalDateTime date2);

```

`IDetalleReservaRepo`:

```java
@Query("SELECT dr.libro FROM DetalleReserva dr WHERE dr.reserva.idReserva = :idReserva")
List<Libro> getLibrosByReservaId(@Param("idReserva") Integer idReserva);
```


## Expected Files

Backend:

* `repository/IReservaRepo.java` — `buscarPorCliente`, `buscarPorFechas`
* `repository/IDetalleReservaRepo.java` — `getLibrosByReservaId`
* `service/IReservaService.java`, `service/impl/ReservaServiceImpl.java`
* `controller/ReservaController.java` — Registro del record de filtro y endpoints de búsqueda.`
* `config/MapperConfig.java` — `consultMapper` bean


Frontend:

* `model/filter-reserva-dto.ts` — Clase modelo para el envío del filtro de búsqueda por cliente.
* `services/reserva.service.ts` — Métodos buscarPorCliente, buscarPorFechas y detallesUrl.
* `stores/buscar-reserva.store.ts`, `stores/buscar-reserva-dialog.store.ts`
* `forms/buscar-reserva.form.ts.`
* `pages/buscar-reserva/buscar-reserva.component.{ts,html,css}`
* `pages/buscar-reserva/buscar-reserva-dialog/buscar-reserva-dialog.component.{ts,html,css}`
* Route entry in `app.routes.ts`




## Criterios de aceptacion

[ ] Buscar por un número de cédula exacto retorna las reservas de ese cliente.
[ ] Buscar por un nombre parcial en minúsculas coincide con el nombre o apellido del cliente.
[ ] El rango de fechas retorna las reservas registradas entre ambos límites de forma inclusiva.
[ ] La tabla de resultados muestra correctamente los datos del cliente y la fecha de la reserva.
[ ] Al cambiar de pestaña y realizar una nueva búsqueda, los resultados previos se reemplazan.
[ ] El diálogo de detalles muestra la lista de libros asociados a la reserva seleccionada.
[ ] La ruta /pages/buscar-reserva renderiza la pantalla correctamente.


