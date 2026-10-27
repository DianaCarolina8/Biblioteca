import { Service, signal } from "@angular/core";
import { form, required } from "@angular/forms/signals";

export interface BuscarReservaModel {
    cedula: string;
    nombres: string;
    fecha1: Date | string | null;
    fecha2: Date | string | null;
}

const emptyBuscarReserva = (): BuscarReservaModel => ({
    cedula: '',
    nombres: '',
    fecha1: null,
    fecha2: null
});

@Service({ autoProvided: false })
export class BuscarReservaForm {

    readonly $model = signal<BuscarReservaModel>(emptyBuscarReserva());

    readonly $form = form(this.$model);

    reset() {
        this.$model.set(emptyBuscarReserva());
    }

    value() {
        return this.$model();
    }

}
