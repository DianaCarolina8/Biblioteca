import { httpResource } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Libro } from "../model/libro";
import { LibroService } from "../services/libro.service";

@Service({autoProvided: false})
export class LibroStore{

    private readonly libroService = inject(LibroService);

    readonly libroResource = httpResource<Libro[]>( () => this.libroService.resourceUrl, { defaultValue: [] });

    readonly $libros = this.libroResource.value;
    readonly $loading = this.libroResource.isLoading;
    readonly $error = this.libroResource.error;

    reload(){
        this.libroResource.reload();
    }

}
