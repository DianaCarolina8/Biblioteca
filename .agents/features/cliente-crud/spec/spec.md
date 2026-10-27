# cliente CRUD

| |                                                     |
| --- |-----------------------------------------------------|
| **Status** | Implemented — both builds verified; runtime/browser behavior not verified |
| **Date** | 2026-10-19 (implemented 2026-10-19)             |
| **Scope** | `biblioteca-backend` + `biblioteca-frontend`              |
| **Reference** | `Categoria` feature (`biblioteca-frontend/src/app/**/categoria*`) |

> Specification only. Part 2 is written after the implementation.

---

# Part 1 — Specification

## Goal

A complete CRUD for `Cliente`: a management screen in the frontend, following the
patterns established by the `Categoria` feature. The backend vertical already exists and is
reused, with two contract fixes (see "Backend Status").
Utiliza el mismo modelo de Categoria para implementarlo

## Scope

In scope:

* Frontend screen: list with filter, pagination and sorting, plus a create/edit screen and delete.
* Route `/pages/cliente` registered in `app.routes.ts`.
* Backend: **verification only** — see "Backend Status" below.

Out of scope:

* Search, reports, or any bulk operation.
* Any change to the shared abstractions (`ICRUD`, `CRUDImpl`, `IGenericRepo`, `GenericService`).
* Backend changes. No new entity, DTO, repository, service or controller is introduced.

## Backend Status (pre-existing, with contract fixes)

The `Cliente` backend vertical already existed before this feature:

```
src/main/java/com/mitocode/model/Cliente.java                    exists
src/main/java/com/mitocode/dto/ClienteDTO.java                   exists
src/main/java/com/mitocode/repository/IClienteRepo.java          exists
src/main/java/com/mitocode/service/IClienteService.java          exists
src/main/java/com/mitocode/service/impl/ClienteServiceImpl.java  exists
src/main/java/com/mitocode/controller/ClienteController.java     exists
```

The entity, repository, service and service impl satisfy the contract and are left untouched.
Two deviations from the contract were found and fixed on the DTO/controller:

* `ClienteDTO` had a misnamed field `idCLiente` (capital `L`) and used `@NotNull` + `@Size(min = 5)`
  on every field. The field is now `idCliente` and validation is `@NotBlank`, `@Size(max = ...)`
  and `@Email`, as described in the Data Model below.
* `ClienteController.registrar` did **not** force the id to `null`; it now does, so JPA always takes
  the `persist()` path and a client-supplied `idCliente` can never overwrite an existing row.

The read endpoints now also return `ClienteDTO` instead of the raw entity, so the response body
matches the contract and the `email` field is never silently dropped by the entity.

## Data Model

| Entity field | Type | Rules | DTO field |
| --- | --- | --- | --- |
| `idCliente` | `Integer` | identity, generated | `idCliente` |
| `nombres` | `String` | required, max 70 | `nombres` |
| `apellidos` | `String` | required, max 70 | `apellidos` |
| `cedula` | `String` | required, max 20 | `cedula` |
| `email` | `String` | required, max 100, email format | `email` |


The `Cliente` DTO field names are identical to the entity field names (including `idCliente`).
The shared `defaultMapper` bean therefore resolves the mapping implicitly and **no** extra
`ModelMapper` bean is needed in `MapperConfig`.

Validation is declared on the DTO and mirrors the entity column lengths: `@NotBlank`,
`@Size(max = ...)` and `@Email`. `@Valid` is applied in the controller.

## Contract

```
GET    /v1/clientes        -> 200 OK + ClienteDTO[]
GET    /v1/clientes/{id}   -> 200 OK + ClienteDTO
POST   /v1/clientes        -> 201 Created + Location header
PUT    /v1/clientes/{id}   -> 200 OK +ClienteDTO
DELETE /v1/clientes/{id}   -> 204 No Content
```

Request and response bodies are `application/json`. A missing id returns the project's standard
not-found response (`ModelNotFoundException` → `ResponseExceptionHandler` → `404` +
`CustomErrorTemplate`). HATEOAS links are also exposed at `GET /v1/clientes/hateoas/{id}`.

## Expected Files

Frontend (all new):

```
src/app/model/cliente.ts
src/app/services/cliente.service.ts
src/app/store/cliente.store.ts
src/app/store/cliente-edit.store.ts
src/app/forms/cliente.form.ts
src/app/pages/cliente/cliente.component.ts
src/app/pages/cliente/cliente.component.html
src/app/pages/cliente/cliente.component.css
src/app/pages/cliente/cliente-edit/cliente-edit.component.css
src/app/pages/cliente/cliente-edit/cliente-edit.component.ts
src/app/pages/cliente/cliente-edit/cliente-edit.component.html
```

Frontend (modified):

```
src/app/app.routes.ts    # adds the /pages/cliente route with new + edit/:id children
```

Backend (modified — contract fixes only):

```
src/main/java/com/mitocode/dto/ClienteDTO.java            idCliente renamed, validation aligned
src/main/java/com/mitocode/controller/ClienteController.java  DTO responses, id forced to null on POST, @Valid on POST
```

Note on naming: the reference `Categoria` feature uses a `store/` (singular) folder, a `categoria-edit`
**route** child rather than a dialog, and `app.routes.ts`. This implementation follows the same
`store/` + `*-edit` route layout, not a `stores/` folder or a dialog.

Reuse `GenericService` in the frontend. Do not modify shared abstractions.

## Acceptance Criteria

Legend: `[x]` = actually verified in this session. `[ ]` = implemented but **not** verified here —
this environment has no running backend and no browser automation.

* [ ] The five endpoints respond as described in the contract. — implemented and compiled;
  **not verified in this session** (no running app / database available).
* [ ] A request with an empty `nombres`, `apellidos`, `cedula` or `email` is rejected. —
  `@NotBlank` + `@Size(max = ...)` + `@Email` declared on `ClienteDTO`, `@Valid` applied on the
  controller's `registrar` and `modificar`; **not exercised at runtime**.
* [ ] Creating returns `201` with a `Location` header. — `ResponseEntity.created(location)` built
  with `ServletUriComponentsBuilder`; **not exercised at runtime**.
* [ ] A missing id returns the standard not-found response. — inherited from `CRUDImpl.findById`
  → `ModelNotFoundException` → `ResponseExceptionHandler` (`404` + `CustomErrorTemplate`);
  **not exercised at runtime**.
* [ ] `GET` returns `idCliente`, `nombres`, `apellidos`, `cedula` and `email`. — the controller now
  maps entities to `ClienteDTO`; **not exercised at runtime**.
* [ ] The list screen shows clients with filter, pagination and sorting. — implemented and
  type-checked by the AOT build; **not exercised in a browser**.
* [ ] The create/edit screen creates and edits, and the list refreshes afterward. — implemented and
  type-checked by the AOT build; **not exercised in a browser**.
* [ ] Delete removes the record and refreshes the list. — implemented (`delete()` + `reload()`);
  **not exercised in a browser**.
* [ ] The route renders the screen. — `/pages/cliente` (+ `new` / `edit/:id` children) is registered
  in `app.routes.ts` and the production bundle builds; **not exercised in a browser**.
* [x] Backend compiles. — `./mvnw clean compile` (JDK 25) succeeded in this session.
* [x] Frontend builds. — `npx ng build` succeeded in this session.

---


# Part 2 — Implementation

## Changed Files

New, frontend:

| File | Role |
| --- | --- |
| `src/app/model/cliente.ts` | `Cliente` class, 5 fields (`idCliente`, `nombres`, `apellidos`, `cedula`, `email`), names identical to the DTO. |
| `src/app/services/cliente.service.ts` | `ClienteService extends GenericService<Cliente>`, `@Service()` auto-provided, `url = ${environment.HOST}/clientes`. |
| `src/app/store/cliente.store.ts` | `httpResource<Cliente[]>` list resource + `$clientes` / `$loading` / `$error` and `reload()`. `autoProvided: false`; provided by the list component. |
| `src/app/store/cliente-edit.store.ts` | `$id` signal drives a `computed` request URL, so `httpResource` refetches when the route id changes. |
| `src/app/forms/cliente.form.ts` | Signal form over a `Cliente` model signal, with `emptyCliente()` factory and `patch` / `value` / `reset`. Validators: `required`, `maxLength` and `email` for the email field. |
| `src/app/pages/cliente/cliente.component.{ts,html,css}` | List screen, mirroring `CategoriaComponent`. |
| `src/app/pages/cliente/cliente-edit/cliente-edit.component.{ts,html,css}` | Create/edit screen, mirroring `CategoriaEditComponent`. |

Modified, frontend:

| File | Change |
| --- | --- |
| `src/app/app.routes.ts` | Imports both client components; adds `pages/cliente` with `new` and `edit/:id` children, next to the existing `pages/categoria` route. |

Modified, backend (contract fixes):

| File | Change |
| --- | --- |
| `src/main/java/com/mitocode/dto/ClienteDTO.java` | Renamed `idCLiente` → `idCliente`; replaced `@NotNull` + `@Size(min = 5)` with `@NotBlank`, `@Size(max = ...)` and `@Email`, mirroring the entity column lengths. |
| `src/main/java/com/mitocode/controller/ClienteController.java` | `POST` now forces `idCliente = null` and applies `@Valid`; `GET` list/by-id and `PUT` return `ClienteDTO`; list endpoint maps every entity through `convertToDto`. |

## Notes

* The screen, store, form and service files were copied structurally from the `Categoria` feature, so
  the whole vertical behaves the same way (signal form, `httpResource` store, `MatTableDataSource`
  with filter/sort/pagination, snackbar notifications, `delete()` + `reload()`).
* The `LayoutComponent` sidebar already links to `/pages/cliente`, so no navigation change was needed.
* `layout.component.html` points the "Reserva" menu entry at `/pages/cliente`; that is a pre-existing
  copy‑paste issue and is **out of scope** for this feature.

## Verification

```
biblioteca-backend   ./mvnw clean compile   -> BUILD SUCCESS (JDK 25)
biblioteca-frontend  npx ng build           -> Application bundle generation complete
```

Both commands ran in this session. Runtime behavior (endpoints, browser interaction) was **not**
verified — no database, no running backend and no browser automation are available here.

