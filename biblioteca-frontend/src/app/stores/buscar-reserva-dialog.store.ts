import { Injectable, signal } from "@angular/core";

@Injectable()
export class BuscarReservaDialogStore {

    readonly $reservaSeleccionada = signal<any>(null);
    readonly $libros = signal<any[]>([]);

    setReserva(reserva: any) {
        this.$reservaSeleccionada.set(reserva);
    }

    setLibros(libros: any[]) {
        this.$libros.set(libros);
    }

    clear() {
        this.$reservaSeleccionada.set(null);
        this.$libros.set([]);
    }

}
