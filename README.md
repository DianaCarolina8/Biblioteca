# Sistema de Biblioteca - Trabajo Final

Aplicación web para la gestión de una biblioteca con funcionalidades CRUD, registro de reservas mediante asistente (wizard) y consulta/búsqueda de reservas.

## Tecnologías utilizadas

### Backend
- **Java 25**
- **Spring Boot 4.1.1** (spring-boot-starter-webmvc, spring-boot-starter-data-jpa, spring-boot-starter-validation, spring-boot-starter-hateoas)
- **PostgreSQL** (driver postgresql)
- **ModelMapper 3.2.6**
- **Lombok**
- **Maven**

### Frontend
- **Angular 22** (standalone components)
- **Angular Material 22** (CDK + Material)
- **Angular Forms with Signals**
- **RxJS 7.8**
- **TypeScript 6.0.2**
- **Vite/Angular CLI 22**

## Funcionalidades

### CRUDs
- **Categorías** - Gestión completa (listar, crear, editar, eliminar)
- **Clientes** - Gestión completa (listar, crear, editar, eliminar)
- **Libros** - Gestión completa (listar, crear, editar, eliminar)

### Reservas
- **Registrar Reserva (Wizard)** - Asistente de dos pasos:
  1. Selección de cliente, fecha de reserva y adición de libros (con búsqueda/autocompletado, sin duplicados)
  2. Revisión y confirmación antes de guardar (transaccional)
- **Buscar Reservas** - Búsqueda con dos modos mutuamente excluyentes:
  - Por cliente (cédula exacta o nombres/apellidos con búsqueda parcial)
  - Por rango de fechas (inclusivo)
  - Diálogo con detalle de libros de la reserva

## Estructura del proyecto

```
TRABAJO FINAL/
├── biblioteca-backend/      # API REST Spring Boot
├── biblioteca-frontend/     # Aplicación Angular
└── .agents/                 # Especificaciones de features
```

## Cómo levantar el proyecto

### Requisitos previos
- Java 25
- Node.js y npm (compatible con Angular 22)
- PostgreSQL (o acceso a Supabase)

### Backend

1. Navegar al directorio del backend:
```bash
cd biblioteca-backend
```

2. Configurar la conexión a base de datos en `src/main/resources/application.yaml` (o mediante variables de entorno):
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/biblioteca}
    username: ${DB_USERNAME:usuario}
    password: ${DB_PASSWORD:password}
```

3. Ejecutar la aplicación:
```bash
./mvnw spring-boot:run
```
o en Windows:
```bash
mvnw.cmd spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd biblioteca-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL del backend en `src/environments/environment.development.ts`:
```typescript
export const environment = {
    HOST: 'http://localhost:8080'
};
```

4. Ejecutar en modo desarrollo:
```bash
npm start
```
o
```bash
ng serve
```

El frontend estará disponible en `http://localhost:4200`

## Notas
- El backend usa `ddl-auto: update`, por lo que Hibernate creará/actualizará las tablas automáticamente al iniciar.
- Las entidades, repositorios, servicios y controladores siguen el patrón CRUD genérico del proyecto (`ICRUD`, `CRUDImpl`, `IGenericRepo`).
- La ruta de reservas se envía en una sola transacción (`@Transactional` en `guardarTransaccion`).
