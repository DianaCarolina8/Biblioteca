-- Creación de la tabla Categoria
CREATE TABLE categoria (
                           id_categoria SERIAL PRIMARY KEY,
                           nombre VARCHAR(50) NOT NULL,
                           descripcion VARCHAR(150),
                           estado BOOLEAN NOT NULL
);

-- Creación de la tabla Libro
CREATE TABLE libro (
                       id_libro SERIAL PRIMARY KEY,
                       titulo VARCHAR(150) NOT NULL,
                       autor VARCHAR(100) NOT NULL,
                       isbn VARCHAR(20) NOT NULL UNIQUE,
                       disponible BOOLEAN NOT NULL,
                       id_categoria INT NOT NULL,
                       CONSTRAINT fk_libro_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

-- Creación de la tabla Cliente
CREATE TABLE cliente (
                         id_cliente SERIAL PRIMARY KEY,
                         nombres VARCHAR(70) NOT NULL,
                         apellidos VARCHAR(70) NOT NULL,
                         cedula VARCHAR(20) NOT NULL UNIQUE,
                         email VARCHAR(100) NOT NULL UNIQUE
);

-- Creación de la tabla Reserva
CREATE TABLE reserva (
                         id_reserva SERIAL PRIMARY KEY,
                         fecha_reserva TIMESTAMP NOT NULL,
                         id_cliente INT NOT NULL,
                         CONSTRAINT fk_reserva_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

-- Creación de la tabla DetalleReserva
CREATE TABLE detalle_reserva (
                                 id_detalle SERIAL PRIMARY KEY,
                                 id_reserva INT NOT NULL,
                                 id_libro INT NOT NULL,
                                 CONSTRAINT fk_detalle_reserva_reserva FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE,
                                 CONSTRAINT fk_detalle_reserva_libro FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

-- -----------------------------------------------------------------------------
-- Foreign keys
-- -----------------------------------------------------------------------------

