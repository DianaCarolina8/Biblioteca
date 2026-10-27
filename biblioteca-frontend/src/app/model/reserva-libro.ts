import { Libro } from "./libro";
import { Reserva } from "./reserva";

export interface ReservaLibroDTO {
    reserva: Reserva;
    libros: Libro[];
} 
