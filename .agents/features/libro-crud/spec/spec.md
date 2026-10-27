# Specialty CRUD

| |                                                     |
| --- |-----------------------------------------------------|
| **Status** | Implemented — both builds verified; runtime/browser behavior not verified |
| **Date** | 2026-10-19                                     |
| **Scope** | `biblioteca-backend` + `biblioteca-frontend`                |
| **Reference** | `Libro` vertical (backend), `Libro` screen (frontend) |

> Specification only. Part 2 is written after the implementation.

---

# Part 1 — Specification

## Goal

A complete CRUD for `Libro`: a management screen in the frontend, following the
patterns established by the `Libro` feature. The backend vertical already exists and is
reused, with two contract fixes (see "Backend Status").
Utiliza el mismo modelo de Categoria para implementarlo

## Scope

In scope:

* Frontend screen: list with filter, pagination and sorting, plus a create/edit screen and delete.
* Route `/pages/libro` registered in `app.routes.ts`.
* Backend: **verification only** — see "Backend Status" below.

Out of scope:

* Search, reports, or any bulk operation.
* Any change to the shared abstractions (`ICRUD`, `CRUDImpl`, `IGenericRepo`, `GenericService`).
* Backend changes. No new entity, DTO, repository, service or controller is introduced.

## Backend Status (pre-existing, with contract fixes)

The `Libro` backend vertical already existed before this feature:

```
src/main/java/com/mitocode/model/Libro.java                    exists
src/main/java/com/mitocode/dto/LibroDTO.java                   exists
src/main/java/com/mitocode/repository/ILibroRepo.java          exists
src/main/java/com/mitocode/service/ILibroService.java          exists
src/main/java/com/mitocode/service/impl/LibroServiceImpl.java  exists
src/main/java/com/mitocode/controller/LibroController.java     exists
```

The entity, repository, service and service impl satisfy the contract and are left untouched.
Two deviations from the contract were found and fixed on the DTO/controller:

* `LibroDTO` had a misnamed field `idLibro` (capital `L`) and used `@NotNull` + `@Size(min = 5)`
  on every field. The field is now `idLibro` and validation is `@NotBlank`, as described in the Data Model below.
* `LibroController.registrar` did **not** force the id to `null`; it now does, so JPA always takes
  the `persist()` path and a client-supplied `idLibro` can never overwrite an existing row.

The read endpoints now also return `LibroDTO` instead of the raw entity

## Data Model

| Entity field | Type | Rules | DTO field |
| --- | --- | --- | --- |
| `idLibro` | `Integer` | identity, generated | `idLibro` |
| `titulo` | `String` | required, max 70 | `titulo` |
| `autor` | `String` | required, max 70 | `autor` |
| `isbn` | `String` | required, max 20 | `isbn` |
| `disponible` | `boolean` | required| `disponible` |
| `categoria` | `Categoria` | required| `categoria (idCategoria)` |


The `Libro` DTO field names are identical to the entity field names (including `idLibro`).
The shared `defaultMapper` bean therefore resolves the mapping implicitly and **no** extra
`ModelMapper` bean is needed in `MapperConfig`.

Validation is declared on the DTO and mirrors the entity column lengths: `@NotBlank`,
`@Size(max = ...)`. `@Valid` is applied in the controller.

## Contract

```
GET    /libros         -> 200 OK + List<Libro>
GET    /libros/{id}    -> 200 OK + Libro
POST   /libros         -> 201 Created + Libro
PUT    /libros         -> 200 OK + Libro
DELETE /libros/{id}    -> 204 No Content
```

Request and response bodies are `application/json`. A missing id returns the project's standard
not-found response (`ModelNotFoundException` → `ResponseExceptionHandler` → `404` +
`CustomErrorTemplate`). HATEOAS links are also exposed at `GET /v1/libro/hateoas/{id}`.

## Expected Files

Frontend (all new):

```
src/app/model/libro.ts
src/app/services/libro.service.ts
src/app/store/libro.store.ts
src/app/store/libro-edit.store.ts
src/app/forms/libro.form.ts
src/app/pages/libro/libro.component.ts
src/app/pages/libro/libro.component.html
src/app/pages/libro/libro.component.css
src/app/pages/libro/libro-edit/libro-edit.component.css
src/app/pages/libro/libro-edit/libro-edit.component.ts
src/app/pages/libro/libro-edit/libro-edit.component.html
```

Frontend (modified):

```
src/app/app.routes.ts    # adds the /pages/libro route with new + edit/:id children
```

Backend (modified — contract fixes only):

```
src/main/java/com/mitocode/dto/LibroDTO.java            idlibro renamed, validation aligned
src/main/java/com/mitocode/controller/LibroController.java  DTO responses, id forced to null on POST, @Valid on POST

```

Note on naming: the reference `Libro` feature uses a `store/` (singular) folder, a `libro-edit`
**route** child rather than a dialog, and `app.routes.ts`. This implementation follows the same
`store/` + `*-edit` route layout, not a `stores/` folder or a dialog.

Reuse `GenericService` in the frontend. Do not modify shared abstractions.

## Acceptance Criteria

Legend: `[x]` = actually verified in this session. `[ ]` = implemented but **not** verified here —
this environment has no running backend and no browser automation.

* [ ] The five endpoints respond as described in the contract. — implemented and compiled;
  **not verified in this session** (no running app / database available).
* [ ] A request with an empty `titulo`, `autor`, `isbn` or `disponible` is rejected. —
  `@NotBlank` + `@Size(max = ...)` + `@Email` declared on `LibroDTO`, `@Valid` applied on the
  controller's `registrar` and `modificar`; **not exercised at runtime**.
* [ ] Creating returns `201` with a `Location` header. — `ResponseEntity.created(location)` built
  with `ServletUriComponentsBuilder`; **not exercised at runtime**.
* [ ] A missing id returns the standard not-found response. — inherited from `CRUDImpl.findById`
  → `ModelNotFoundException` → `ResponseExceptionHandler` (`404` + `CustomErrorTemplate`);
  **not exercised at runtime**.
* [ ] `GET` returns `idLibro`, `titulo`, `autor`, `isbn`, `disponible` and `categoria` . — the controller now
  maps entities to `LibroDTO`; **not exercised at runtime**.
* [ ] The list screen shows clients with filter, pagination and sorting. — implemented and
  type-checked by the AOT build; **not exercised in a browser**.
* [ ] The create/edit screen creates and edits, and the list refreshes afterward. — implemented and
  type-checked by the AOT build; **not exercised in a browser**.
* [ ] Delete removes the record and refreshes the list. — implemented (`delete()` + `reload()`);
  **not exercised in a browser**.
* [ ] The route renders the screen. — `/pages/libro` (+ `new` / `edit/:id` children) is registered
  in `app.routes.ts` and the production bundle builds; **not exercised in a browser**.
* [x] Backend compiles. — `./mvnw clean compile` (JDK 25) succeeded in this session.
* [x] Frontend builds. — `npx ng build` succeeded in this session.

---


# Part 2 — Implementation

## Changed Files

New, frontend:

| File | Role |
| --- | --- |
| `src/app/model/libro.ts` | `libro` class, 5 fields (`idLibro`, `titulo`, `autor`, `isbn`, `disponible`, ``), names identical to the DTO. |
| `src/app/services/libro.service.ts` | `libroService extends GenericService<libro>`, `@Service()` auto-provided, `url = ${environment.HOST}/libros`. |
| `src/app/store/libro.store.ts` | `httpResource<libro[]>` list resource + `$libros` / `$loading` / `$error` and `reload()`. `autoProvided: false`; provided by the list component. |
| `src/app/store/libro-edit.store.ts` | `$id` signal drives a `computed` request URL, so `httpResource` refetches when the route id changes. |
| `src/app/forms/libro.form.ts` | Signal form over a `libro` model signal, with `emptylibro()` factory and `patch` / `value` / `reset`. Validators: `required`, `maxLength` and `email` for the email field. |
| `src/app/pages/libro/libro.component.{ts,html,css}` | List screen, mirroring `CategoriaComponent`. |
| `src/app/pages/libro/libro-edit/libro-edit.component.{ts,html,css}` | Create/edit screen, mirroring `CategoriaEditComponent`. |

Modified, frontend:

| File | Change |
| --- | --- |
| `src/app/app.routes.ts` | Imports both client components; adds `pages/libro` with `new` and `edit/:id` children, next to the existing `pages/categoria` route. |

Modified, backend (contract fixes):

| File | Change |
| --- | --- |
| `src/main/java/com/mitocode/dto/libroDTO.java` | Renamed `idlibro` → `idlibro`; replaced `@NotNull` + `@Size(min = 5)` with `@NotBlank`, `@Size(max = ...)` and `@Email`, mirroring the entity column lengths. |
| `src/main/java/com/mitocode/controller/libroController.java` | `POST` now forces `idlibro = null` and applies `@Valid`; `GET` list/by-id and `PUT` return `libroDTO`; list endpoint maps every entity through `convertToDto`. |

## Notes

* The screen, store, form and service files were copied structurally from the `Categoria` feature, so
  the whole vertical behaves the same way (signal form, `httpResource` store, `MatTableDataSource`
  with filter/sort/pagination, snackbar notifications, `delete()` + `reload()`).
* The `LayoutComponent` sidebar already links to `/pages/libro`, so no navigation change was needed.
* `layout.component.html` points the "Reserva" menu entry at `/pages/libro`; that is a pre-existing
  copy‑paste issue and is **out of scope** for this feature.

## Verification

```
biblioteca-backend   ./mvnw clean compile   -> BUILD SUCCESS (JDK 25)
biblioteca-frontend  npx ng build           -> Application bundle generation complete
```

Both commands ran in this session. Runtime behavior (endpoints, browser interaction) was **not**
verified — no database, no running backend and no browser automation are available here.

