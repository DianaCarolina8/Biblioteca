import { Cliente } from "./cliente";

export interface Reserva {
    idReserva: number | null;
    fechaReserva: string | Date;
    cliente: Cliente;
} 
