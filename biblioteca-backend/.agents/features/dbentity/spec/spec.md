# DB Entities — JPA model generated for Library Reservation System

| | |
| --- | --- |
| **Status** | Draft |
| **Date** | 2026-10-15 |
| **Scope** | `biblioteca-backend` |
| **Affects** | `com.mitocode.model.*`, generated `.agents/features/dbentity/resources/schema-backup.sql` |
| **Reference** | Requisitos del Trabajo Final - Java AI Full Stack (MitoCode) |

> Specification only. Part 2 is written after the implementation.

---

# Part 1 — Specification

## Problem

El proyecto de la biblioteca comienza vacío: una aplicación Spring Boot con JPA configurado, pero sin las entidades de persistencia mapeadas. Escribir las entidades y sus relaciones (Categoría, Libro, Cliente, Reserva y DetalleReserva) a mano puede generar errores en las restricciones, tipos de datos o nombres de llaves foráneas. 

Además, es necesario contar con un script SQL de respaldo estructurado que permita recrear el esquema completo de forma limpia en Supabase o en una base de datos PostgreSQL local.

El modelo entidad relacion esta en db_diagram.png 

## Goal

Generar el modelo JPA completo en el paquete `com.mitocode.model` basándose estrictamente en los requerimientos del sistema de biblioteca, y **producir el script SQL del esquema resultante como respaldo**.

Dos entregables:
1. Las clases de entidades bajo `src/main/java/com/mitocode/model/`.
2. `.agents/features/dbentity/resources/schema-backup.sql` — el script DDL para desplegar las tablas en la base de datos.

## Scope

In scope:
* Las 5 entidades del negocio: `Categoria`, `Libro`, `Cliente`, `Reserva`, y `DetalleReservaPK`.
* Tipos de columnas, longitudes de texto (`varchar`), restricciones de nulos (`nullable = false`), restricciones de unicidad (`unique`) y llaves foráneas con nombres explícitos.
* Las relaciones correspondientes: de Categoría a Libro (1 a N), de Cliente a Reserva (1 a N), de Reserva a DetalleReserva (1 a N con cascada), y de Libro a DetalleReserva (1 a N).

Out of scope:
* DTOs, repositorios, servicios y controladores (la spec se detiene en la capa `model`).
* Auditorías complejas, borrados lógicos u otras tablas no solicitadas.
* Datos de prueba (las tablas se crean vacías).

## Decisions

**Las entidades se toman textualmente de los requisitos.**
Cada tabla, columna y relación proviene de las especificaciones del trabajo final de MitoCode. Se establecen longitudes estándar para los campos de tipo texto y restricciones de unicidad en campos clave (`isbn`, `cedula`, `email`).

**Nombres en Java, columnas derivadas en snake_case.**
Los campos usan `lowerCamelCase` en las entidades de Java y Spring Boot se encarga de convertirlos a `snake_case` en la base de datos (`fechaReserva` a `fecha_reserva`, etc.). Se utiliza `@Column(name = ...)` de manera explícita cuando se requiere asegurar la compatibilidad con el DDL.

**Cada llave foránea se nombra explícitamente en minúsculas.**
Ejemplo: `@JoinColumn(..., foreignKey = @ForeignKey(name = "fk_libro_categoria"))`. Esto evita hashes automáticos de Hibernate y mantiene la consistencia con PostgreSQL.

**Las llaves primarias usan `IDENTITY`.**
Todas las entidades utilizan la estrategia de auto-incremento de la base de datos mediante `@GeneratedValue(strategy = GenerationType.IDENTITY)`.

**La igualdad se basa exclusivamente en el ID.**
Todas las entidades llevan `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con `@EqualsAndHashCode.Include` en su respectivo identificador.

---

## Entity Model

Longitudes configuradas mediante `@Column(length = ...)`; **NN** indica `nullable = false`.

**`Categoria`** — tabla `categoria`

| Field | Column | Type | Constraints |
| --- | --- | --- | --- |
| `idCategoria` | `id_categoria` | Integer | PK, identity |
| `nombre` | `nombre` | varchar(50) | NN |
| `descripcion` | `descripcion` | varchar(150) | |
| `estado` | `estado` | boolean | NN |

**`Libro`** — tabla `libro`

| Field | Column | Type | Constraints |
| --- | --- | --- | --- |
| `idLibro` | `id_libro` | Integer | PK, identity |
| `titulo` | `titulo` | varchar(150) | NN |
| `autor` | `autor` | varchar(100) | NN |
| `isbn` | `isbn` | varchar(20) | NN, unique |
| `disponible` | `disponible` | boolean | NN |
| `categoria` | `id_categoria` | FK → `categoria` | NN, `@ManyToOne`, `fk_libro_categoria` |

**`Cliente`** — tabla `cliente`

| Field | Column | Type | Constraints |
| --- | --- | --- | --- |
| `idCliente` | `id_cliente` | Integer | PK, identity |
| `nombres` | `nombres` | varchar(70) | NN |
| `apellidos` | `apellidos` | varchar(70) | NN |
| `cedula` | `cedula` | varchar(20) | NN, unique |
| `email` | `email` | varchar(100) | NN, unique |

**`Reserva`** — tabla `reserva`

| Field | Column | Type | Constraints |
| --- | --- | --- | --- |
| `idReserva` | `id_reserva` | Integer | PK, identity |
| `fechaReserva` | `fecha_reserva` | timestamp | NN, `LocalDateTime` |
| `cliente` | `id_cliente` | FK → `cliente` | NN, `@ManyToOne`, `fk_reserva_cliente` |
| `detalles` | — | `List<DetalleReserva>` | `@OneToMany(mappedBy = "reserva", cascade = ALL, orphanRemoval = true)` |

**`DetalleReservaPK`** — tabla `detalle_reserva`

| Field | Column | Type | Constraints |
| --- | --- | --- | --- |
| `idDetalle` | `id_detalle` | Integer | PK, identity |
| `reserva` | `id_reserva` | FK → `reserva` | NN, `@ManyToOne`, `fk_detalle_reserva_reserva` |
| `libro` | `id_libro` | FK → `libro` | NN, `@ManyToOne`, `fk_detalle_reserva_libro` |

---

## Relationships

```
  categoria      1 ──< N libro
  cliente        1 ──< N reserva
  reserva        1 ──< N detalle_reserva (bidireccional, cascade ALL)
  libro          1 ──< N detalle_reserva
```

---

## SQL Backup Script (Supabase / PostgreSQL DDL)

Script de respaldo ubicado en `.agents/features/dbentity/resources/schema-backup.sql`:

---

## Expected Files

* `model/Categoria.java`
* `model/Libro.java`
* `model/Cliente.java`
* `model/Reserva.java`
* `model/DetalleReserva.java`
* `.agents/features/dbentity/resources/schema-backup.sql`

## Acceptance Criteria

* [ ] Las entidades requeridas están creadas bajo el paquete `com.mitocode.model`.
* [ ] La aplicación compila de forma exitosa (`./mvnw clean compile`).
* [ ] Las tablas se generan automáticamente en Supabase o PostgreSQL mediante Spring Boot.
* [ ] Las llaves foráneas y restricciones únicas operan correctamente en la base de datos.

---
# Part 2 — Implementation Notes