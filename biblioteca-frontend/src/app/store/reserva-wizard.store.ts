import { Injectable, signal } from "@angular/core";
import { Libro } from "../model/libro";

@Injectable()
export class ReservaWizardStore {

    readonly $librosSeleccionados = signal<Libro[]>([]);

    addLibro(libro: Libro) {
        const current = this.$librosSeleccionados();
        // Evitar duplicados
        const exists = current.some(l => l.idLibro === libro.idLibro);
        if (exists) {
            return;
        }
        this.$librosSeleccionados.update(list => [...list, libro]);
    }

    removeLibro(idLibro: number) {
        this.$librosSeleccionados.update(list => list.filter(l => l.idLibro !== idLibro));
    }

    clear() {
        this.$librosSeleccionados.set([]);
    }
}
