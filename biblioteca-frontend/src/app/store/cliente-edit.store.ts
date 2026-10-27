import { computed, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { ClienteService } from "../services/cliente.service";
import { Cliente } from "../model/cliente";

@Service({ autoProvided: false })
export class ClienteEditStore {

    private readonly clienteService = inject(ClienteService);
    readonly $id = signal<number | null>(null);

    private readonly $clienteRequest = computed(() => {
        const id = this.$id();
        return id ? `${this.clienteService.resourceUrl}/${id}` : null;
    });

    readonly clienteResource = httpResource<Cliente>(() => this.$clienteRequest());

    setId(id: number | null) {
        this.$id.set(id);
    }
}
