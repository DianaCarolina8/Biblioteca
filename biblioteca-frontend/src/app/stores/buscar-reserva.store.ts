import { Service } from "@angular/core";
import { signal } from "@angular/core";

@Service({ autoProvided: false })
export class BuscarReservaStore {

    readonly $resultados = signal<any[]>([]);
    readonly $loading = signal<boolean>(false);

    setResultados(resultados: any[]) {
        this.$resultados.set(resultados);
    }

    clear() {
        this.$resultados.set([]);
    }

}
