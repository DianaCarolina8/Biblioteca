import { Service, signal } from "@angular/core";
import { form, required } from "@angular/forms/signals";
import { Cliente } from "../model/cliente";

export interface ReservaWizardModel {
    cliente: Cliente | null;
    fechaReserva: Date | string | null;
}

const emptyReservaWizard = (): ReservaWizardModel => ({
    cliente: null,
    fechaReserva: null
});

@Service({ autoProvided: false })
export class ReservaWizardForm {

    readonly model = signal<ReservaWizardModel>(emptyReservaWizard());

    readonly form = form(this.model, (path) => {
        required(path.cliente);
        required(path.fechaReserva);
    });

    readonly isInvalid = () => this.form().invalid();

    patch(model?: Partial<ReservaWizardModel>) {
        this.model.update(current => ({ ...current, ...(model || {}) }));
    }

    value() {
        return this.model();
    }

    reset() {
        this.model.set(emptyReservaWizard());
    }
}
