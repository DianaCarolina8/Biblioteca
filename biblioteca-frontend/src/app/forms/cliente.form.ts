import { Service, signal } from "@angular/core";
import { form, maxLength, required } from "@angular/forms/signals";
import { Cliente } from "../model/cliente";

const emptyCliente = (): Cliente => ({
    idCliente: null,
    nombres: '',
    apellidos: '',
    cedula: '',
    email: ''
});

@Service({ autoProvided: false })
export class ClienteForm {

    readonly $model = signal<Cliente>(emptyCliente());

    readonly $form = form(this.$model, (path) => {
        required(path.nombres);
        maxLength(path.nombres, 70);

        required(path.apellidos);
        maxLength(path.apellidos, 70);

        required(path.cedula);
        maxLength(path.cedula, 20);

        required(path.email);
        maxLength(path.email, 100);
    });

    readonly isInvalid = () => this.$form().invalid();

    patch(cliente: Cliente) {
        this.$model.set(cliente);
    }

    value() {
        return this.$model();
    }

    reset() {
        this.$model.set(emptyCliente());
    }

}
